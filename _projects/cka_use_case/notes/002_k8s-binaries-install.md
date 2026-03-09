# Instalación de Herramientas de Kubernetes (kubeadm, kubelet, kubectl)

Este reporte describe el procedimiento para instalar los componentes base de Kubernetes en **Ubuntu 24.04 LTS**. Este proceso es **idéntico** para todos los nodos del clúster.

## 1. Preparación de Repositorios
Kubernetes ya no utiliza los repositorios antiguos de Google Cloud. El estándar actual es el repositorio alojado en `pkgs.k8s.io`.

### A. Dependencias y Llave GPG
```bash
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl gpg

# Crear directorio para llaves si no existe y descargar la llave oficial
sudo mkdir -p -m 755 /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.35/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```

### B. Configuración del Repositorio (v1.35)
```bash
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

## 2. Instalación de Paquetes
Se deben instalar las tres herramientas fundamentales:
1.  **kubeadm**: El comando para crear y administrar el clúster.
2.  **kubelet**: El agente que corre en cada nodo y gestiona los contenedores.
3.  **kubectl**: La utilidad de línea de comandos para hablar con el API Server.

```bash
sudo apt update
sudo apt install -y kubelet kubeadm kubectl

# Prevenir actualizaciones automáticas que puedan romper el clúster (Pinning)
sudo apt-mark hold kubelet kubeadm kubectl
```

> **Ref. Oficial:** [Instalación de kubeadm, kubelet y kubectl](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)

