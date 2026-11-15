# Kubernetes Chat Lab

A learning project that runs a Node.js, Express and Socket.IO chat application with MongoDB. Kubernetes manifests define the application, database and NGINX services.

## Structure

- `app/` — chat application and Dockerfile.
- `k8s/` — deployments, services and an NGINX ConfigMap.

The application deployment expects a locally available `chat-app:latest` image (`imagePullPolicy: Never`), so build and load that image into your Kubernetes environment before applying the manifests. The manifests are a lab configuration and have not been hardened for production.
