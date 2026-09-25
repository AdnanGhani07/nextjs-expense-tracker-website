# Self-Hosted Observability Stack (Oracle Cloud Always-Free VM)

This lightweight stack runs on an **Oracle Cloud Always-Free VM** (`VM.Standard.E2.1.Micro`, 1 vCPU, 1 GB RAM, Ubuntu 24.04 LTS).

## Services Included
* **Uptime Kuma** (Port `3001`): Synthetic uptime monitoring and alerting via Discord / Telegram / Slack.
* **Prometheus** (Port `9090`): Time-series metrics collection.
* **Grafana** (Port `3000`): Visual operational dashboards.

## Quick Start on VM
1. Connect via SSH:
   ```bash
   ssh -i ~/.ssh/id_rsa ubuntu@<ORACLE_VM_PUBLIC_IP>
   ```

2. Clone this repository or copy this folder to the VM:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   ```

3. Start the services:
   ```bash
   cd observability
   docker-compose up -d
   ```

4. Configure Cloud Run Monitoring in Uptime Kuma:
   * Navigate to `http://<ORACLE_VM_PUBLIC_IP>:3001` in your browser.
   * Create an admin account on first launch.
   * Click **+ Add New Monitor**:
     * **Monitor Type**: `HTTP(s)`
     * **Friendly Name**: `ExpenseTracker AI Production`
     * **URL**: `https://<YOUR_CLOUD_RUN_URL>/api/healthz`
     * **Heartbeat Interval**: `60 seconds`
     * **Retries**: `2`
   * Under **Notifications**, add your Discord or Telegram Webhook for instant mobile alerts if Cloud Run or Neon fails.
