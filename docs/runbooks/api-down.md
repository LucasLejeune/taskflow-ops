# Runbook — TaskFlowApiDown

## Symptome
La sonde blackbox sur /health echoue (probe_success == 0).

## Diagnostic
1. curl -v http://<ip>/health
2. multipass exec <vm> -- sudo systemctl status taskflow-api
3. multipass exec <vm> -- sudo journalctl -u taskflow-api -n 50

## Actions
- Redemarrer le service : multipass exec <vm> -- sudo systemctl restart taskflow-api
- Si echec persistant : rollback vers la derniere release fonctionnelle
  (gh workflow run deploy.yml -f rollback_to=<N>)
- Notifier l equipe via le canal d astreinte.
