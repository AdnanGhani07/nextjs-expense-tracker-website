variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "region" {
  type        = string
  default     = "us-central1" # Region eligible for GCP Cloud Run Always-Free Tier
  description = "GCP deployment region"
}

variable "service_name" {
  type        = string
  default     = "expense-tracker"
  description = "Cloud Run service identifier"
}

variable "github_repo" {
  type        = string
  description = "Format: username/repository-name (for Workload Identity Federation)"
}

variable "clerk_publishable_key" {
  type        = string
  description = "Clerk public publishable key"
}
