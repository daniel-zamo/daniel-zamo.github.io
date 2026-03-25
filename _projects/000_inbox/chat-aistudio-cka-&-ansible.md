**Contexto:* Realizando una implementación/despliegue de un cluster kubernetes con el método kubeadm (para producción), teniendo los archivos:

- `node.csv`

```csv 
hostname,ram,vcpus,ip
cluster1-master1,2048,2,172.17.17.200
cluster1-worker1,2048,2,172.17.17.221
cluster1-worker2,2048,2,172.17.17.222
cluster1-worker3,2048,2,172.17.17.223
```

- `user-data.yaml`

```yaml
#cloud-config
users:
  - name: candidate
    # Conf. de sudo sin passwd
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: sudo
    shell: /bin/bash
    lock_passwd: false
    passwd: "...PASSWORD_HASH..."
    ssh_authorized_keys:
      - ssh-rsa ...CLAVE_PUBLICA...
# 1. INSTALACIÓN DE PAQUETES (Base + Runtime)
package_update: true
packages:
  - curl
  - gnupg
  - vim
  - apt-transport-https
  - ca-certificates
  - socat       # Instalación automática del runtime (Requisito Kubeadm)
  - conntrack   # (Requisito Kubeadm)
  - containerd  # El Runtime (Requisitor de Kubeadm)
  - nfs-common  # Útil para volúmenes persistentes futuros

# 2. CONFIGURACIÓN DE ARCHIVOS (Módulos y Sysctl)
write_files:
  - path: /etc/modules-load.d/k8s.conf
    content: |
      overlay
      br_netfilter
  - path: /etc/sysctl.d/k8s.conf
    content: |
      net.bridge.bridge-nf-call-iptables  = 1
      net.bridge.bridge-nf-call-ip6tables = 1
      net.ipv4.ip_forward                 = 1

# 3. EJECUCIÓN DE COMANDOS (El Ritual de Containerd)
runcmd:
  # Desactivar Swap permanentemente
  - [ swapoff, -a ]
  - [ sed, -i, '/swap/d', /etc/fstab ]
  
  # sysctl - Cargar módulos y aplicar red
  - [ modprobe, overlay ]
  - [ modprobe, br_netfilter ]
  # Aplicar cambios de red sin reiniciar
  - [ sysctl, --system ]

  # Configuración de Containerd (Driver Systemd)
  - mkdir -p /etc/containerd
  - sh -c "containerd config default > /etc/containerd/config.toml"
  - sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
  # Configuración inicial de containerd (se completará manualmente para practicar)
  - [ systemctl, enable, --now, containerd ]
  # Configurar el socket de containerd para crictl
  - [ crictl, config, runtime-endpoint, unix:///run/containerd/containerd.sock ] 
  # Reiniciar para aplicar cambios
  - systemctl restart containerd
  - systemctl enable containerd
```

- `vms_provision.sh`
```bash
#!/bin/bash

# 1. PATHS ABSOLUTOS
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
readonly FILE_NODES="${SCRIPT_DIR}/nodes.csv"
readonly USER_DATA="${SCRIPT_DIR}/user-data.yaml"

# 2. VARIABLES KVM
readonly POOL_NAME='kvm-images'
readonly BASE_IMAGE='noble-server-cloudimg-amd64.img'
readonly GW='172.17.17.17'
readonly DNS1='172.17.17.17'

# --- Function: Metadata Generation (Efímero) ---
function generate_temp_metadata() {
    local hostname=$1
    local temp_file=$(mktemp /tmp/metadata.${hostname}.XXXXXX.yaml)
    echo -e "instance-id: ${hostname}\nlocal-hostname: ${hostname}" > "$temp_file"
    echo "$temp_file"
}

# --- Main Provisioning Loop ---
tail -n +2 "${FILE_NODES}" | while IFS=',' read -r hostname ram vcpus ip; do
    echo "--- Aprovisionando: ${hostname} (${ip}) ---"

    current_metadata=$(generate_temp_metadata "$hostname")

    # 1. Crear disco diferencial
    virsh vol-create-as ${POOL_NAME} ${hostname}.qcow2 20G \
      --format qcow2 --backing-vol ${BASE_IMAGE} --backing-vol-format qcow2 > /dev/null

    DISK_PATH=$(virsh vol-path --pool ${POOL_NAME} ${hostname}.qcow2)

    # 2. INYECCIÓN DIRECTA (Network & Fixes)
    sudo virt-customize -a "$DISK_PATH" \
      --hostname "$hostname" \
      --write "/etc/netplan/01-netcfg.yaml:
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: false
      addresses: [$ip/24]
      routes: [{to: default, via: $GW}]
      nameservers: {addresses: [$DNS1, 8.8.8.8]}" \
      --run-command "rm -f /etc/netplan/50-cloud-init.yaml" \
      --write "/etc/cloud/cloud.cfg.d/99-disable-network-config.cfg:network: {config: disabled}"

    # 3. LANZAMIENTO
    virt-install \
     --name "${hostname}" --ram "${ram}" --vcpus "${vcpus}" \
     --os-variant ubuntu24.04 --disk path="$DISK_PATH" \
     --network bridge=br0 --graphics none --import \
     --cloud-init user-data="${USER_DATA}",meta-data="${current_metadata}" \
     --noautoconsole

    rm -f "$current_metadata"
done
```

Con las anteriores definiciones, sobre un host anfitrion de KVM ejecutamos: `./vms_provision.sh` con lo al finalizar dicho script podemos revisar que:

```bash
 virsh list --all
 Id   Name               State
-----------------------------------
 2    cluster1-master1   running
 4    cluster1-worker1   running
 6    cluster1-worker2   running
 8    cluster1-worker3   running
```

Y nuestros nodos estan provisionados y disponibles.

Ahora por cada uno de ellos y para hacer el despliegue del cluster kubernetes donde el nodo `cluster1-master1` sera el control pane y los demas seran worker, es que debemos continuar con ejecutar:

```bash
sudo apt update && sudo apt -y upgrade
sudo mkdir -p -m 755 /etc/apt/keyrings

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.35/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt update
sudo apt install -y kubelet kubeadm kubectl

sudo apt-mark hold kubelet kubeadm kubectl
```

Sobre cada uno de ellos

**Tarea:** se te pide que como sysadmin LFCS codifiques roles de Ansible para orquestar la instalación de las dependencias y configuración inicial de los paquetes ultimos indicados (kubelet, kubeadm y kubectl), preferiblemente codificando con buenas practicas segun tu experiencia utilizando roles, para proyectar mas evolución/modularidad y evolución de la codificación Ansible diseñada.