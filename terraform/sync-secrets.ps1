# PowerShell script to push existing .env secrets directly into GCP Secret Manager
# Usage: .\sync-secrets.ps1 -ProjectId "your-gcp-project-id"

param (
    [Parameter(Mandatory=$true)]
    [string]$ProjectId
)

if (-not (Test-Path "..\.env")) {
    Write-Error "Could not find .env file in parent directory."
    exit 1
}

$envLines = Get-Content "..\.env"
$secrets = @("DATABASE_URL", "CLERK_SECRET_KEY", "GEMINI_API_KEY", "OPENROUTER_API_KEY")

foreach ($secret in $secrets) {
    $line = $envLines | Where-Object { $_ -match "^$secret=" } | Select-Object -First 1
    if ($line) {
        $val = ($line -split "=", 2)[1]
        Write-Host "Updating secret $secret in GCP Secret Manager (Project: $ProjectId)..." -ForegroundColor Cyan
        $val | gcloud secrets versions add $secret --project=$ProjectId --data-file=-
    } else {
        Write-Warning "Secret $secret not found in .env, skipping."
    }
}

Write-Host "All secrets synchronized successfully!" -ForegroundColor Green
