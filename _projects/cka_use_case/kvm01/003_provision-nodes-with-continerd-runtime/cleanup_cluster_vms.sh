#!/bin/bash

# ==============================================================================
# Script: cleanup_cluster_vms.sh
# Descripción: Detiene y elimina por completo los dominios y discos de KVM
# Paradigma: Iteración basada en CSV (Limpieza de Recursos)
# ==============================================================================


# 1. DETERMINACIÓN DEL PATH ABSOLUTO (Independiente del lugar de ejecución)
# Esto obtiene la carpeta donde está guardado este archivo .sh
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# 2. INICIALIZACIÓN DE VARIABLES BASADAS EN EL SCRIPT_DIR
readonly FILE_NODES="${SCRIPT_DIR}/nodes.csv"

# Variables de Libvirt/KVM
readonly POOL_NAME='ssd-pool'

# --- Función para eliminar un nodo ---
function cleanup_node() {
    local hostname=$1
    
    echo "--- Iniciando limpieza del nodo: ${hostname} ---"

    # 1. Verificar si el dominio existe en libvirt
    if ! virsh dominfo "${hostname}" &>/dev/null; then
        echo "[AVISO] El nodo ${hostname} no existe o ya fue eliminado. Saltando..."
        return
    fi

    # 2. Detener la VM si está en ejecución (Force Stop)
    # Usamos destroy porque en un cleanup de laboratorio no nos importa el ACPI shutdown
    if virsh list --name | grep -q "^${hostname}$"; then
        echo "[1/2] Deteniendo dominio ${hostname}..."
        virsh destroy "${hostname}" > /dev/null
    fi

    # 3. Eliminar la definición del dominio y sus discos asociados
    # El flag --remove-all-storage es clave para liberar espacio en el ssd-pool
    echo "[2/2] Eliminando definición y discos de ${hostname}..."
    virsh undefine "${hostname}" --remove-all-storage --nvram > /dev/null

    if [ $? -eq 0 ]; then
        echo "--- Nodo ${hostname} eliminado correctamente ---"
    else
        echo "--- [ERROR] Hubo un problema al eliminar ${hostname} ---"
    fi
}

# --- Main Logic ---

# Validar que el archivo de nodos existe
if [[ ! -f "$FILE_NODES" ]]; then
    echo "Error: El archivo ${FILE_NODES} no existe."
    exit 1
fi

echo "====================================================="
echo "  LIMPIEZA DE LABORATORIO KVM - CLUSTER 01"
echo "====================================================="

# Recorremos el CSV saltando la cabecera
tail -n +2 "${FILE_NODES}" | while IFS=',' read -r hostname ram vcpus; do
    cleanup_node "${hostname}"
done

echo "====================================================="
echo "  Proceso de limpieza finalizado."
echo "  Espacio liberado en pool: ${POOL_NAME}"
echo "====================================================="

# Opcional: Refrescar el pool para actualizar el estado del almacenamiento en libvirt
virsh pool-refresh "${POOL_NAME}" > /dev/null

> ~/.ssh/known_hosts

