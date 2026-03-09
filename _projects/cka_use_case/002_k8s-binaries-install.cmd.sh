# En todos los nodos, instalación de Herramientas de Kubernetes (kubeadm, kubelet, kubectl)

## Este reporte describe el procedimiento para instalar los componentes base de Kubernetes en **Ubuntu 24.04 LTS**. Este proceso es **idéntico** para todos los nodos del clúster.

## 1. Preparación de Repositorios

### A. Dependencias y Llave GPG
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gpg

sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.35/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

### B. Configuración del Repositorio (v1.35)
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

## 2. Instalación de Paquetes

sudo apt update
sudo apt install -y kubelet kubeadm kubectl

# Prevenir actualizaciones automáticas que puedan romper el clúster (Pinning)

sudo apt-mark hold kubelet kubeadm kubectl

## > **Ref. Oficial:** [Instalación de kubeadm, kubelet y kubectl](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)

