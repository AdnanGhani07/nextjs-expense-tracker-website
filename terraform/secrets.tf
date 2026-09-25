locals {
  app_secret_keys = [
    "DATABASE_URL",
    "CLERK_SECRET_KEY",
    "GEMINI_API_KEY",
  ]
}

resource "google_secret_manager_secret" "app_secrets" {
  for_each  = toset(local.app_secret_keys)
  secret_id = each.key

  replication {
    auto {}
  }
}

# Dedicated Service Account for Cloud Run runtime
resource "google_service_account" "cloud_run_sa" {
  account_id   = "expense-tracker-cr-sa"
  display_name = "Cloud Run Expense Tracker Runtime SA"
}

# Grant Cloud Run permission to read Secret Manager secrets
resource "google_secret_manager_secret_iam_member" "secret_access" {
  for_each  = toset(local.app_secret_keys)
  secret_id = google_secret_manager_secret.app_secrets[each.key].id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}
