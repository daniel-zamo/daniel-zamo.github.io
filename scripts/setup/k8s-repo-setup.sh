#!/bin/bash
# Protocolo de provisión de Repositorios Oficiales de Kubernetes (v1.35)
set -e

K8S_VERSION="v1.35"

echo "==> Configurando Repositorio de Kubernetes $K8S_VERSION..."
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl gpg

sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/$K8S_VERSION/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/$K8S_VERSION/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
echo "==> Repositorios sincronizados correctamente."

