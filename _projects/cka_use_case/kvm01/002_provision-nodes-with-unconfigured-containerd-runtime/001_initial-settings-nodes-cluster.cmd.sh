# Instalación de K8s. Sesión en todos los nodos (master y worker)

# 1. Swap (Ya lo tienes, solo verifica free -h)
swapon --show   # EL COMANDO MAS SEGURO DE VERIFICAR Muestra el estado de los dispositivos.
free -h         # Si muestra 0 estaría deshabilitada.
sudo swapoff -a # Detiene/Deshabilita swap (no es persistente esto).

sudo sed -i '/swap/d' /etc/fstab

# Lo siguiente es opcional
systemctl --type=swap  # Busca unidades activas
sudo systemctl mask dev-nvme0n1p3.swap # Si las hay, enmascararlas

# 2. Módulos del Kernel (Corregido)

cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 3. Sysctl (Completo para K8s)
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system

# 4. Instalación y Configuración de Containerd (CRÍTICO)
sudo apt update
sudo apt install -y containerd

# Generar config por defecto y activar SystemdCgroup
# Ref: https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml
sudo systemctl restart containerd

