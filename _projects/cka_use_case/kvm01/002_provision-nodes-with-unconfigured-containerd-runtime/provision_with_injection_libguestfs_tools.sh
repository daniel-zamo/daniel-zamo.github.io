#!/bin/bash

# 1. PATHS ABSOLUTOS
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
readonly FILE_NODES="${SCRIPT_DIR}/nodes.csv"
readonly USER_DATA="${SCRIPT_DIR}/user-data.yaml"

# 2. VARIABLES KVM
readonly POOL_NAME='ssd-pool'
readonly BASE_IMAGE='noble-server-cloudimg-amd64.img'
readonly GW='172.17.17.17'

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
      nameservers: {addresses: [$GW, 8.8.8.8]}" \
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


