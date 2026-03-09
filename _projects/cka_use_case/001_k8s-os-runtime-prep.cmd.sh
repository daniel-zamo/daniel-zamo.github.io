# Preparación del Sistema Operativo y Runtime para Kubernetes v1.35

# Este reporte resume los pasos críticos de pre-configuración necesarios en nodos **Ubuntu 24.04 LTS** para actuar como miembros de un clúster de Kubernetes. Estos pasos deben ejecutarse en **todos los nodos** (Control Plane y Workers).

## 1. Requisitos Básicos del Sistema

### *   **Identificación Única:** Cada nodo debe tener un `hostname`, dirección MAC e `id-product` único.
### *   **Swap Deshabilitada:** Kubernetes requiere que el intercambio (swap) esté desactivado para garantizar la predictibilidad del programador (scheduler).
### *   **Conectividad:** Acceso total a internet (o repositorio local) y puertos específicos abiertos (6443, 2379-2380, 10250, etc.).

## 2. Configuración de Red del Kernel

### A. Módulos del Kernel

#### Carga persistente
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

#### Carga inmediata
sudo modprobe overlay
sudo modprobe br_netfilter

### B. Parámetros de Sysctl

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

####  Aplicar cambios sin reiniciar
sudo sysctl --system

## 3. Instalación y Configuración del Runtime (containerd)

### A. Instalación de paquetes

sudo apt update
sudo apt install -y containerd socat conntrack


### B. Configuración del Driver de Cgroup (Paso Crítico)

#### 1.  Generar configuración base:

sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml 

#### 2.  Activar `SystemdCgroup`:

sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd

## 4. Resumen de Herramientas de Kubernetes
### Una vez finalizado las tareas enumeradas en este reporte, el sistema está listo para la instalación de:
### *   **kubeadm:** Herramienta para inicializar el clúster.
### *   **kubelet:** El agente principal que corre en los nodos.
### *   **kubectl:** La interfaz de línea de comandos para interactuar con el API.

