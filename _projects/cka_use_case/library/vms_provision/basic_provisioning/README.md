# README.md

Sustento técnico de la documentación oficial y la refactorización de seguridad para el usuario, aplicados en este cambio.

### 1. Documentación Oficial y Requisitos

La URL principal donde el desarrollador de Kubernetes especifica estas herramientas (principalmente a la instalación/configuración del "runtime Containerd") es:

**[https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin)**

En la página **[Implementation Details de Kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/implementation-details/)** se documenta que:

*   **`socat` y `conntrack`**: Son requeridos por `kube-proxy` y por los pre-checks de `kubeadm`. `socat` es necesario para el reenvío de puertos (`port-forward`) y `conntrack` es vital para que la red del clúster mantenga el estado de las conexiones.
*   **`containerd`**: Es el motor (runtime). Se detalla en la sección de **[Container Runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)**.
*   **`nfs-common`**: No es un requisito para que el clúster "arranque", pero es un requisito práctico para cualquier nodo que necesite montar volúmenes persistentes vía NFS (muy común en ejercicios de almacenamiento de la CKA).

**¿Deben ir en todos los nodos? SÍ.**
Tanto el **Control Plane (Master)** como los **Workers** ejecutan Pods (el master corre los pods de sistema como `kube-apiserver`, `etcd`, etc.). Por lo tanto, todos necesitan el runtime (`containerd`), las herramientas de red (`socat`/`conntrack`) y el soporte de volúmenes si vas a usar almacenamiento externo.

---

### 1. Script Refactorizado: provision_vms_cluster.sh
He eliminado la función de red de cloud-init que ya no usaba (porque ahora inyectas con virt-customize) y simplificado las variables.

- [provision_with_injection_libguestfs_tools.sh](./provision_with_injection_libguestfs_tools.sh)

---

### 2. Refactorización del `user-data.yaml` (Sudo sin Password)

- He añadido los paquetes necesarios para Kubernetes (socat, conntrack) (ver Ref. en este mismo `README.md`) y la configuración de módulos y sysctl para que el runtime containerd funcione perfectamente desde el primer boot.

- Se ha modificado la sección del usuario `dzamo`. Se ha eliminado la sintaxis de lista anterior y he usado la propiedad `sudo` directa dentro de la definición del usuario, que es la forma más limpia en `cloud-init`.

- [user-data.yaml](./user-data.yaml)


### Principales cambios realizados
1. **Script:** Se eliminaron las funciones de red de Bash porque ya no hacían falta. Ahora el script es una línea recta: Metadata -> Disco -> Inyección -> Instalación.
2. User-Data (Containerd Base):
  * **Paquetes:** Se añadieron socat y conntrack. Sin ellos, kubeadm init dará error.
  * **Persistencia:** La configuración de módulos (/etc/modules-load.d/k8s.conf) y red (/etc/sysctl.d/k8s.conf) ahora es persistente. No tendrás que volver a escribir esos archivos si reinicias la VM.
  * **Swap:** El runcmd ahora limpia el /etc/fstab automáticamente.

**Siguiente paso (luego de provisionar con este):**
Cuando las VMs arranquen, se tendra containerd instalado y el sistema listo. Solo es entrar y hacer la parte "divertida": generar el archivo config.toml de containerd y añadir los repos de Kubernetes para hacer el kubeadm init.

#### Otros cambios realizados respecto del anterior
He eliminado la línea global `sudo: ['ALL=(ALL) NOPASSWD:ALL']` que tenías fuera y la he integrado correctamente dentro de la estructura del usuario `dzamo`. Esto garantiza que, al hacer login, puedas ejecutar cualquier comando administrativo con `sudo` de inmediato sin que el sistema te interrumpa pidiendo la contraseña.

**Dato de experto:** Al instalar la versión 1.35, se sugiere que después de arrancar las máquinas verifiques la versión instalada de `containerd` con `containerd --version`. Ubuntu 24.04 suele traer una versión bastante reciente que es totalmente compatible con la v1.35 de Kubernetes.

