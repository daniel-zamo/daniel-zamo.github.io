---
note_type: theory
---

# Lección Magistral: Adaptadores, Targets y Datastores (Clarificando Conceptos)

Entiendo perfectamente tu duda. En el mundo de VMware, la terminología puede ser confusa al principio porque varios términos suenan parecido pero cumplen funciones distintas. Vamos a desglosar esa duda sobre "un solo iSCSI" y las diferencias entre tus dos datastores principales.

---

## 1. El Adaptador vs. El Datastore: La Analogía del "Teléfono"

Cuando dije que **"solo se permite un iSCSI por host"**, me refería estrictamente al **Software iSCSI Adapter (`vmhba65`)**. 

Para que lo visualices mentalmente:
*   **El Adaptador (`vmhba65`) es como un "Teléfono Virtual"** que instalamos dentro del kernel del ESXi.
*   No necesitas dos o tres teléfonos para llamar a distintas personas. Con **un solo teléfono** (un solo adaptador), puedes llamar a muchos números (Servidores de Almacenamiento) y recibir muchos paquetes (Datastores).
*   vSphere deshabilita el botón "Add" porque ya detecta que el "teléfono" está instalado. Instalar otro sería redundante y consumiría recursos de CPU innecesarios.

**Resumen:** Tienes **un** adaptador que gestiona **toda** tu red iSCSI, sin importar cuántos datastores tengas.

---

## 2. Diferencias Tecnológicas: ICM-Datastore vs. iSCSI-Datastore

Aunque ambos viven en la misma pestaña de vSphere, tecnológicamente y por diseño de laboratorio, tienen propósitos distintos:

| Característica | **ICM-Datastore** | **iSCSI-Datastore** |
| :--- | :--- | :--- |
| **Origen (LUN)** | LUN 0 (120 GB) | LUN 5 (130 GB) |
| **Tecnología Base** | iSCSI (Bloques) | iSCSI (Bloques) |
| **Sistema de Archivos** | VMFS 6 | VMFS 6 |
| **Propósito Arquitectónico** | **Infraestructura Core:** Aquí suelen vivir las VMs de gestión, plantillas (templates) y archivos ISO de instalación. | **Cargas de Trabajo (Workloads):** Aquí es donde el manual te pide crear TUS máquinas virtuales de laboratorio (como la `Photon-Empty`). |

**¿Hay una diferencia tecnológica real?** No en el protocolo (ambos usan iSCSI), pero sí en el **aislamiento**. En producción, separamos los datastores para que, si una VM en el `iSCSI-Datastore` satura el disco con muchas operaciones de lectura/escritura (IOPS), no afecte la velocidad de las VMs críticas que están en el `ICM-Datastore`.

---

## 3. El Concepto de LUN (Logical Unit Number)

Aquí es donde está la clave de tu laboratorio. Tu servidor de almacenamiento (`172.20.10.15`) es una sola máquina física, pero ha dividido su disco duro en varias "rebanadas" llamadas **LUNs**.

1.  El **Adaptador (`vmhba65`)** se conecta al servidor.
2.  El servidor le dice: "Hola Host 02, tengo para ti la **LUN 0** y la **LUN 5**".
3.  Tu ESXi toma la **LUN 0** y la formatea como `ICM-Datastore`.
4.  Tu ESXi toma la **LUN 5** y la formatea como `iSCSI-Datastore`.

Es como si tuvieras un disco duro físico y crearas la partición `C:` y la `D:`. Son dos "discos" distintos para el sistema operativo, pero viajan por el mismo cable.

---

## 4. Conceptos Clave para Examen y Producción

*   **Fan-In / Fan-Out:** Un solo adaptador iSCSI conectándose a múltiples LUNs es un diseño estándar. Lo que nunca debes hacer en producción es que todos los datastores dependan de un solo cable físico (por eso usamos el **Port Binding** con dos vmnics).
*   **Encapsulamiento SCSI:** iSCSI significa "Internet SCSI". Lo que hace la tecnología es tomar comandos de disco tradicionales (SCSI) y meterlos dentro de paquetes de red (TCP/IP). El `ICM-Datastore` y el `iSCSI-Datastore` son simplemente dos "túneles" de datos SCSI viajando sobre tu red Ethernet.

---

## 5. Terminología Expandida

1.  **Initiator (Iniciador):** Es tu host ESXi (el que "inicia" la conexión). El `vmhba65` es tu *Software Initiator*.
2.  **Target (Destino):** Es el servidor de almacenamiento (`172.20.10.15`). Un iniciador puede tener muchos targets (podrías tener otra cabina de discos en otra IP y usar el mismo `vmhba65`).
3.  **VMFS (Virtual Machine File System):** Es la capa que ves en tus capturas. iSCSI entrega "espacio bruto" (RAW), y VMFS es la "pintura" que permite que VMware guarde archivos ahí. Ambos datastores usan VMFS 6, que es la versión moderna que permite recuperación automática de espacio (UNMAP).

**Conclusión del Mentor:** Lo has entendido bien, solo te faltaba separar el concepto de "el aparato que conecta" (adaptador) del "recurso conectado" (datastore). ¡Estás operando como un verdadero Ingeniero de Sistemas! ¿Listo para el vMotion en el Lab 13?

