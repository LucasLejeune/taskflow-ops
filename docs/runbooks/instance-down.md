# Runbook — InstanceDown

## Symptome
Prometheus ne parvient plus a scraper une cible (metrique up == 0).

## Diagnostic
1. multipass list pour verifier l etat de la VM concernee.
2. multipass exec <vm> -- systemctl status taskflow-api node_exporter
3. Verifier le reseau : docker compose exec prometheus wget -qO- http://<ip>:<port>/metrics

## Actions
- Si le service est arrete : multipass exec <vm> -- sudo systemctl start <service>
- Si la VM est down : multipass start <vm>
- Si persistant : escalade, poser un silence Alertmanager le temps de l intervention.
