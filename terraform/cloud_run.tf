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
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.repository_id}/app:latest"

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
        for_each = toset(locals.app_secret_keys)
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

      startup_probe {
        http_get {
          path = "/api/healthz"
          port = 3000
        }
        initial_delay_seconds = 10
        period_seconds        = 5
        failure_threshold     = 3
      }
    }
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
