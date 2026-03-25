# Informe de Ingeniería: Implementación de Almacenamiento NAS con NFS v4.1

Como tu mentor y arquitecto, tras analizar el **Laboratorio 11**, observo que estamos completando el abanico de posibilidades de almacenamiento para tu SDDC. Ya dominas el almacenamiento de bloques (iSCSI); ahora entramos en el mundo del **almacenamiento de archivos (NAS)** mediante el protocolo **NFS**.

Operar esto a través de tu túnel inverso requiere especial atención: las latencias de red pueden afectar el tiempo de montaje inicial. Asegúrate de que los pings entre los hosts y la IP `172.20.10.15` sean estables antes de proceder.

---

## 1. Guía Operativa Estratégica: La Lógica del Montaje NAS

A diferencia de iSCSI, donde formateamos una LUN "virgen", en NFS el sistema de archivos ya existe en el servidor. Nosotros solo lo "colgamos" (montamos) en nuestro árbol de directorios.

*   **Selección de Versión (Task 1, Paso 3c):** Al elegir **NFS 4.1**, estamos optando por la modernidad. A diferencia de la v3, la 4.1 soporta de forma nativa el balanceo de carga y mayor seguridad.
*   **Identificación del Recurso (Task 1, Pasos 3e-f):**
    *   **Folder (`/mnt/NFS-POOL`):** Es el "Export Path". Es sensible a mayúsculas. Si te equivocas en una letra, el servidor denegará la conexión (Permission Denied).
    *   **Server (`172.20.10.15`):** Aplicamos la misma lógica que discutimos antes: usamos IP para evitar dependencias del DNS durante el arranque del centro de datos.
*   **Accesibilidad Simultánea (Task 1, Paso 3j):** Al seleccionar ambos hosts (`01` y `02`) en el asistente, vCenter ejecuta el comando de montaje en paralelo. Esto garantiza que el Datastore tenga el mismo **UUID interno** en todo el clúster, algo vital para la alta disponibilidad.

---

## 2. Justificación de Diseño y "Ojo Clínico"

¿Por qué usar NFS en lugar de iSCSI? Aquí el criterio del Arquitecto:

*   **Gestión de Espacio (Thin Provisioning Nativo):** En NFS, todos los discos virtuales (`.vmdk`) son **Thin** por defecto. El ESXi no "reserva" el espacio en el servidor; solo consume lo que la VM escribe realmente. Esto optimiza el almacenamiento pero requiere monitorización constante para no llenar el servidor NAS.
*   **Multipathing en NFS 4.1:** A diferencia de NFS v3 (que solo usaba un camino), la versión 4.1 soporta **Session Trunking**. Esto permite que el tráfico fluya por múltiples tarjetas de red simultáneamente si el servidor NAS lo permite, aumentando drásticamente el rendimiento de entrada/salida (IOPS).
*   **Bloqueo de Archivos (File Locking):** En VMFS (iSCSI), el ESXi gestiona los bloqueos de los archivos. En NFS, es el **Servidor NAS** quien gestiona quién escribe en cada archivo. Esto reduce la carga de procesamiento del host ESXi pero traslada la responsabilidad de la integridad de datos al servidor externo.

---

## 3. Conceptos Clave para Examen y Producción

Si buscas la certificación **VCP (VMware Certified Professional)**, graba esto:

1.  **NFS v3 vs v4.1:** v3 no soporta Kerberos ni multipathing nativo. v4.1 soporta multipathing y seguridad avanzada, pero **no es compatible con Storage DRS ni con Site Recovery Manager (SRM)** en ciertas configuraciones antiguas. Siempre verifica la matriz de compatibilidad.
2.  **Hardware Acceleration (VAAI):** Para que NFS rinda como un disco local, el servidor NAS debe soportar **VAAI (vSphere Storage APIs for Array Integration)**. Esto permite delegar tareas como el clonado de VMs directamente a la cabina, liberando la red de gestión.
3.  **Permisos de Root:** El servidor NFS debe estar configurado con la opción `no_root_squash`. De lo contrario, el host ESXi (que actúa como usuario root) no tendrá permisos para crear archivos dentro del datastore.

---

## 4. Expansión de Terminología y Tecnología

1.  **NAS (Network Attached Storage):** A diferencia de una SAN (iSCSI/FC), un NAS entrega un sistema de archivos completo sobre la red IP. Es ideal para repositorios de ISOs, plantillas y entornos donde la flexibilidad es más importante que la bajísima latencia de los bloques puros.
2.  **Mount Point (Punto de Montaje):** Es el lugar lógico en el sistema de archivos `/vmfs/volumes/` donde el ESXi conecta el recurso remoto. En vSphere, el nombre que le das (`NFS-Datastore`) es solo un alias para ese punto de montaje.
3.  **Kerberos (Task 1, Paso 3i):** Es un protocolo de autenticación mutua. Mientras que NFS v3 confía ciegamente en la IP del host, NFS v4.1 con Kerberos exige que el host y el servidor demuestren su identidad mediante tickets criptográficos, eliminando el riesgo de "IP spoofing" en la red de almacenamiento.

**Mentor's Note:** Tras completar este laboratorio, tu infraestructura tiene ahora tres tipos de almacenamiento: Local, iSCSI y NFS. Estás construyendo un entorno **Híbrido y Resiliente**.