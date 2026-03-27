# Synthocracy K8s Backup

Backed up and removed from cluster on 2026-03-27.
App is now running exclusively on Railway: https://synthocracy.up.railway.app
Static mirror on here.now: https://coral-parcel-ytrg.here.now/

## What was removed

| Resource | Kind | Notes |
|---|---|---|
| synthocracy-api | Deployment | Node.js API server (server.js), port 8081 |
| synthocracy-frontend | Deployment | Nginx serving static demo/ HTML files |
| agent-network-api | Deployment | Earlier name for same app (0/1 ready, crashing) |
| agent-network-frontend | Deployment | Earlier name for same app |
| synthocracy-api-service | Service | ClusterIP 10.152.183.50:8081 |
| synthocracy-frontend-service | Service | ClusterIP 10.152.183.175:80 |
| agent-network-api-service | Service | ClusterIP 10.152.183.193:8081 |
| agent-network-frontend-service | Service | ClusterIP 10.152.183.91:80 |
| synthocracy-ingress | Ingress | Host: synthocracy.openclaw.distiller.local |
| agent-network-ingress | Ingress | Host: agent-network.openclaw.distiller.local |
| selenium-chrome | Pod | Selenium test runner (ContainerStatusUnknown) |
| selenium-chrome | Service | ClusterIP 10.152.183.101:4444,7900 |

## To spin back up

```bash
kubectl apply -f k8s-backup/deployments.yaml
kubectl apply -f k8s-backup/services.yaml
kubectl apply -f k8s-backup/ingress.yaml
# Selenium (pod, not deployment — will need to recreate manually):
kubectl apply -f k8s-backup/selenium-pod.yaml
```

Note: selenium-chrome was a bare Pod (not a Deployment), so it won't self-heal on restart.
Consider converting to a Deployment when re-enabling.
