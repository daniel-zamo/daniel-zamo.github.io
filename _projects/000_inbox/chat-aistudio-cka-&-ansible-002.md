**Contexto:** En nuestro sitio tenemos notas que en concreto resumen la implementación/despliegue de un cluster kubernetes con el método kubeadm (para producción). Estas son:

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

Ahora por cada uno de los nodos y para continuar con el despliegue del cluster kubernetes donde el nodo `cluster1-master1` sera el control pane y los demas seran worker, es que hemos implementado roles de Ansible. El codigo lo hemos colocado de tal modo que tenemos:

```bash
dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ tree scripts/ops/ansible-k8s-provision/
scripts/ops/ansible-k8s-provision/
├── ansible.cfg
├── inventory.ini
├── roles
│   └── kubernetes_bootstrap
│       ├── defaults
│       │   └── main.yml
│       ├── handlers
│       │   └── main.yml
│       └── tasks
│           ├── install.yml
│           ├── main.yml
│           └── setup_repo.yml
└── site.yml

```

Cuyas definiciones son:

```bash
dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/ansible.cfg
[defaults]
# 1. Definimos el inventario y usuario
inventory = ./inventory.ini
remote_user = candidate
host_key_checking = False

# 2. ELIMINACIÓN DEL ERROR DEL CALLBACK
# En lugar de usar 'yaml', usamos el plugin 'default' de ansible-core
stdout_callback = ansible.builtin.default
# Activamos los callbacks para comandos ad-hoc (como el ping)
bin_ansible_callbacks = True

# 3. SILENCIAR WARNINGS DE PYTHON
# Esto elimina los mensajes amarillos sobre el descubrimiento del intérprete
interpreter_python = auto_silent

roles_path = ./roles
forks = 5

# 4. CONFIGURACIÓN ESPECÍFICA DEL FORMATO YAML
[callback_default]
# Aquí es donde activamos el formato YAML que antes hacía el plugin externo
result_format = yaml

[ssh_connection]
ssh_args = -C -o ControlMaster=auto -o ControlPersist=60s
pipelining = True

dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/inventory.ini
[masters]
cluster1-master1 ansible_host=172.17.17.200

[workers]
cluster1-worker1 ansible_host=172.17.17.221
cluster1-worker2 ansible_host=172.17.17.222
cluster1-worker3 ansible_host=172.17.17.223

[k8s_cluster:children]
masters
workers

[k8s_cluster:vars]
ansible_user=candidate


dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/roles/kubernetes_bootstrap/defaults/main.yml
---
# Versión de Kubernetes según documentación v1.35 (Marzo 2026)
k8s_version: "v1.35"
k8s_gpg_keyring: "/etc/apt/keyrings/kubernetes-apt-keyring.gpg"
k8s_repo_url: "https://pkgs.k8s.io/core:/stable:/{{ k8s_version }}/deb/"

dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/roles/kubernetes_bootstrap/handlers/main.yml
---
- name: Reload systemd
  ansible.builtin.systemd:
    daemon_reload: yes

- name: Restart kubelet
  ansible.builtin.systemd:
    name: kubelet
    state: restarted

dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/roles/kubernetes_bootstrap/tasks/install.yml
---
- name: Instalar binarios de Kubernetes
  ansible.builtin.apt:
    name:
      - kubelet
      - kubeadm
      - kubectl
    state: present
  notify: Reload systemd

- name: Prevenir actualización automática (hold)
  ansible.builtin.dpkg_selections:
    name: "{{ item }}"
    selection: hold
  loop: [kubelet, kubeadm, kubectl]

- name: Habilitar servicio kubelet
  ansible.builtin.systemd:
    name: kubelet
    enabled: yes
    state: started

dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/roles/kubernetes_bootstrap/tasks/main.yaml
---
- name: Actualizar cache de APT y Upgrade de sistema
  ansible.builtin.apt:
    upgrade: dist
    update_cache: yes
  when: ansible_os_family == "Debian"

- ansible.builtin.include_tasks: setup_repo.yml
- ansible.builtin.include_tasks: install.yml

dzamo@aspire:~/01_Hot_Tier/github.com/daniel-zamo.github.io$ cat scripts/ops/ansible-k8s-provision/roles/kubernetes_bootstrap/tasks/setup_repo.yml
---
- name: Crear directorio para keyrings con permisos correctos
  ansible.builtin.file:
    path: /etc/apt/keyrings
    state: directory
    mode: '0755'

- name: Descargar y desarmar llave GPG de Kubernetes v1.35
  ansible.builtin.get_url:
    url: "{{ k8s_repo_url }}/Release.key"
    dest: /tmp/kubernetes-release.key
    mode: '0644'

- name: Convertir llave a formato de confianza (dearmor)
  ansible.builtin.shell: |
    cat /tmp/kubernetes-release.key | gpg --dearmor -o {{ k8s_gpg_keyring }}
  args:
    creates: "{{ k8s_gpg_keyring }}"

- name: Configurar repositorio oficial de Kubernetes
  ansible.builtin.apt_repository:
    repo: "deb [signed-by={{ k8s_gpg_keyring }}] {{ k8s_repo_url }} /"
    filename: kubernetes
    state: present
    update_cache: yes

```

Sobre cada uno de ellos

**Tarea:** 