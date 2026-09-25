resource "google_cloud_run_v2_service" "app" {
  name     = var.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = 0 # Scale to zero when idle ($0 cost)
      max_instance_count = 2 # Prevent unexpected traffic spikes
    }

    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      resources {
        limits = {
          cpu    = "1000m" # 1 vCPU (Free Tier eligible)
          memory = "512Mi" # 512MB RAM
        }
      }

      # Static public environment variables
      env {
        name  = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
        value = var.clerk_publishable_key
      }
      env {
        name  = "NEXT_PUBLIC_APP_URL"
        value = "https://${var.service_name}-${var.project_id}.${var.region}.run.app"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }

      # Secrets injected securely from GCP Secret Manager
      dynamic "env" {
        for_each = toset(local.app_secret_keys)
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.key
              version = "latest"
            }
          }
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [
      client,
      client_version,
      template[0].containers[0].image,
      template[0].containers[0].startup_probe,
    ]
  }

  depends_on = [
    google_secret_manager_secret_iam_member.secret_access
  ]
}

# Allow public unauthenticated web traffic to Cloud Run
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
