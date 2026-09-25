resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "expense-tracker-repo"
  description   = "Docker repository for Expense Tracker AI"
  format        = "DOCKER"
}
