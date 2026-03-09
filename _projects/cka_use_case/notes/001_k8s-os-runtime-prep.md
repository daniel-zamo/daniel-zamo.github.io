# Preparación del Sistema Operativo y Runtime para Kubernetes v1.35

Este reporte detalla los pasos críticos de pre-configuración necesarios en nodos **Ubuntu 24.04 LTS** para actuar como miembros de un clúster de Kubernetes. Estos pasos deben ejecutarse en **todos los nodos** (Control Plane y Workers).

## 1. Requisitos Básicos del Sistema
Antes de la instalación, se deben cumplir las siguientes condiciones de infraestructura:
*   **Identificación Única:** Cada nodo debe tener un `hostname`, dirección MAC e `id-product` único.
*   **Swap Deshabilitada:** Kubernetes requiere que el intercambio (swap) esté desactivado para garantizar la predictibilidad del programador (scheduler).
*   **Conectividad:** Acceso total a internet (o repositorio local) y puertos específicos abiertos (6443, 2379-2380, 10250, etc.).

> **Ref. Oficial:** [Prerrequisitos de Kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin)

## 2. Configuración de Red del Kernel
Kubernetes requiere que los nodos permitan el tráfico a través de puentes (bridges) y que las iptables puedan filtrar este tráfico para la comunicación entre Pods.

### A. Módulos del Kernel
Se deben cargar los módulos `overlay` (para capas de contenedores) y `br_netfilter` (para redes de puente).
```bash
# Carga persistente
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

# Carga inmediata
sudo modprobe overlay
sudo modprobe br_netfilter
```

### B. Parámetros de Sysctl
Es imperativo habilitar el reenvío de IP (IP Forwarding) y el filtrado de puente.
```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Aplicar cambios sin reiniciar
sudo sysctl --system
```
> **Ref. Oficial:** [Forwarding IPv4 y Bridged Traffic](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#forwarding-ipv4-and-letting-iptables-see-bridged-traffic)

## 3. Instalación y Configuración del Runtime (containerd)
El runtime es el motor que ejecuta los contenedores. `containerd` es el estándar industrial actual tras la depreciación de Docker-shim.

### A. Instalación de paquetes
```bash
sudo apt update
sudo apt install -y containerd socat conntrack
```

### B. Configuración del Driver de Cgroup (Paso Crítico)
Ubuntu 24.04 utiliza **systemd** para la gestión de grupos de control (cgroups). Es vital que `containerd` y el futuro `kubelet` coincidan en el uso del driver `systemd`.

1.  Generar configuración base:
    ```bash
    sudo mkdir -p /etc/containerd
    containerd config default | sudo tee /etc/containerd/config.toml 
    ```
2.  Activar `SystemdCgroup`:
    ```bash
    # Cambiar de false a true en la sección runc options
    sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
    sudo systemctl restart containerd
    ```

> **Ref. Oficial:** [Configuración del driver systemd cgroup](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd-systemd-cgroup-driver)

## 4. Resumen de Herramientas de Kubernetes
Una vez finalizado este reporte, el sistema está listo para la instalación de:
*   **kubeadm:** Herramienta para inicializar el clúster.
*   **kubelet:** El agente principal que corre en los nodos.
*   **kubectl:** La interfaz de línea de comandos para interactuar con el API.

> **Ref. Oficial:** [Instalación de herramientas de K8s](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)

