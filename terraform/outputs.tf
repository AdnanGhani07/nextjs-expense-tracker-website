output "cloud_run_url" {
  description = "The deployed URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.app.uri
}

output "artifact_registry_repo" {
  description = "Artifact Registry Docker repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.repository_id}"
}

output "wif_provider_name" {
  description = "Workload Identity Provider full resource name (set as GCP_WIF_PROVIDER secret in GitHub)"
  value       = google_iam_workload_identity_pool_provider.github_provider.name
}

output "wif_service_account" {
  description = "Deployer Service Account email (set as GCP_WIF_SERVICE_ACCOUNT secret in GitHub)"
  value       = google_service_account.github_sa.email
}
