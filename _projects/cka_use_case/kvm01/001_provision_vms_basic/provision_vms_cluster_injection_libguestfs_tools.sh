#!/bin/bash

# ==============================================================================
# Script: provision_vms_cluster.sh
# Refactor: Ephemeral Metadata & Static Network Paradigm
# ==============================================================================



# 1. DETERMINACIÓN DEL PATH ABSOLUTO (Independiente del lugar de ejecución)
# Esto obtiene la carpeta donde está guardado este archivo .sh
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# 2. INICIALIZACIÓN DE VARIABLES BASADAS EN EL SCRIPT_DIR
readonly FILE_NODES="${SCRIPT_DIR}/nodes.csv"
readonly USER_DATA="${SCRIPT_DIR}/user-data.yaml"

# Variables de Libvirt/KVM
readonly POOL_NAME='ssd-pool'
readonly BASE_IMAGE='noble-server-cloudimg-amd64.img'

# Datos globales de red (Requerimientos)
readonly GATEWAY='172.17.17.17'
readonly DNS1='172.17.17.17'

# --- Function: Metadata Generation ---
function generate_temp_metadata() {
    local hostname=$1
    local temp_file=$(mktemp /tmp/metadata.${hostname}.XXXXXX.yaml)
    cat <<EOF > "$temp_file"
instance-id: ${hostname}
local-hostname: ${hostname}
EOF
    echo "$temp_file"
}

# --- Function: Network Config Generation (Ubuntu/Netplan v2) ---
function generate_temp_network_config() {
    local ip=$1
    local hostname=$2
    local temp_file=$(mktemp /tmp/network.${hostname}.XXXXXX.yaml)
    
    # Nota: enp1s0 es el nombre de interfaz estándar para Ubuntu en KVM
    cat <<EOF > "$temp_file"
version: 2
ethernets:
  enp1s0:
    dhcp4: false
    addresses:
      - ${ip}/24
    routes:
      - to: default
        via: ${GATEWAY}
    nameservers:
      addresses: [${DNS1}]
EOF
    echo "$temp_file"
}

# --- Main Provisioning Loop ---

[[ ! -f "$FILE_NODES" ]] && { echo "Error: $FILE_NODES not found"; exit 1; }
[[ ! -f "$USER_DATA" ]] && { echo "Error: $USER_DATA not found"; exit 1; }

# Leemos el CSV incluyendo la nueva columna 'ip'
tail -n +2 "${FILE_NODES}" | while IFS=',' read -r hostname ram vcpus ip; do
    echo "--- Preparing Static Provisioning for: ${hostname} (${ip}) ---"

    # 1. Generar archivos efímeros (Metadata y Network)
    current_metadata=$(generate_temp_metadata "$hostname")
    current_net_config=$(generate_temp_network_config "$ip" "$hostname")

# 1. Crear el disco diferencial como siempre
virsh vol-create-as ${POOL_NAME} ${hostname}.qcow2 20G \
  --format qcow2 \
  --backing-vol ${BASE_IMAGE} \
  --backing-vol-format qcow2

# 2. INYECTAR RED ESTÁTICA DIRECTO AL DISCO (Sin Cloud-init)
# Obtenemos la ruta física del disco
DISK_PATH=$(virsh vol-path --pool ${POOL_NAME} ${hostname}.qcow2)

sudo virt-customize -a "$DISK_PATH" \
  --hostname "$hostname" \
  --write "/etc/netplan/01-netcfg.yaml:
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: false
      addresses: [$ip/24]
      routes:
        - to: default
          via: 172.17.17.17
      nameservers:
        addresses: [172.17.17.17, 8.8.8.8]" \
  --run-command "rm -f /etc/netplan/50-cloud-init.yaml" \
  --write "/etc/cloud/cloud.cfg.d/99-disable-network-config.cfg:network: {config: disabled}"
  #--run-command "netplan apply"

# 3. Lanzar la VM (ahora sin el flag network-config de cloud-init)
virt-install \
 --name "${hostname}" \
 --ram "${ram}" \
 --vcpus "${vcpus}" \
 --os-variant ubuntu24.04 \
 --disk path="$DISK_PATH" \
 --network bridge=br0 \
 --graphics none \
 --import \
 --cloud-init user-data="${USER_DATA}",meta-data="${current_metadata}" \
 --noautoconsole

    # 4. Limpieza de archivos temporales
    rm -f "$current_metadata"
    rm -f "$current_net_config"

    echo "--- VM ${hostname} deployed with IP ${ip} ---"
done

