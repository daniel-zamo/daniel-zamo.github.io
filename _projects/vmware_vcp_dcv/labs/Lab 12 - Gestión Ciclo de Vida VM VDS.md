# Informe de Ingeniería: Gestión del Ciclo de Vida de Máquinas Virtuales (Lab 12)

Estimado ingeniero, confirmo la recepción y análisis de los **3 archivos adjuntos** (la carátula del Laboratorio 12 y las dos páginas de procedimientos técnicos). Tras haber estabilizado el almacenamiento iSCSI en el `sa-esxi-02`, este laboratorio es el examen final de esa configuración: vamos a poner a prueba la escritura y el registro de objetos en ese recurso.

Operar desde un escritorio **KDE Plasma/Windows 10** a través de un **túnel inverso** requiere precisión al navegar por el sistema de archivos del datastore. Ten en cuenta que la latencia del túnel puede hacer que el refresco del inventario tras borrar o registrar una VM tarde unos segundos más de lo habitual.

---

## 1. Guía Operativa Estratégica: Lógica del Despliegue y Registro

El laboratorio no solo busca crear una VM, sino enseñarte a manipular punteros de inventario:

### Fase A: Creación Determinista (Task 1)
*   **Selección de Compute (`sa-esxi-02`):** Elegimos este host específicamente para validar que el trabajo realizado en los laboratorios anteriores (red y iSCSI) es funcional. Si algo falló antes, la VM no podrá crearse aquí.
*   **Separación de Recursos (ISO vs VM):** Notarás que montas una ISO desde `ICM-Datastore` pero instalas la VM en `iSCSI-Datastore`. 
    *   *Lógica:* Esto demuestra que vSphere puede manejar dependencias cruzadas entre datastores de distinta tecnología (Bloques vs NAS/Local) de forma transparente.

### Fase B: Inventario vs. Persistencia (Task 2 y 3)
*   **Remove from Inventory:** Aquí solo borras el "puntero" en la base de datos de vCenter. La VM "desaparece" de la lista, pero sus datos siguen vivos. Es la forma segura de mover una VM entre diferentes vCenters o limpiar el inventario sin riesgo de pérdida de datos.
*   **Registration:** Al buscar el archivo `.vmx` y registrarlo, estás re-vinculando los archivos físicos con el plano de control. Es una habilidad esencial para recuperación ante desastres.

### Fase C: Purga Completa (Task 4)
*   **Delete from Disk:** Esta es la acción definitiva. vCenter envía una instrucción al host ESXi para ejecutar un `unmount` y un `delete` de todos los archivos asociados (`.vmdk`, `.vmx`, `.nvram`). No hay papelera de reciclaje en VMFS; esta acción es irreversible.

---

## 2. Justificación de Diseño y "Ojo Clínico"

Como arquitecto, analizo estas decisiones de configuración:

*   **Thin Provisioning (Task 1, Paso 11d):** 
    *   *Justificación:* En un entorno de laboratorio (y en el 90% de producción), el **Thin Provisioning** es la norma. Permite que tu `iSCSI-Datastore` de 130GB parezca mucho más grande. La VM de 12GB solo ocupará ~1GB inicialmente (el tamaño del SO Photon).
    *   *Ojo Crítico:* El riesgo es el "Overcommitment". Si todas las VMs crecen al mismo tiempo, el datastore colapsará (Out of Space), provocando que todas las VMs en ese datastore se suspendan.
*   **VMware Photon OS:** Se elige porque es un sistema operativo Linux optimizado para VMware, extremadamente ligero y con los **VMware Tools** preinstalados o integrados en el kernel, lo que facilita la gestión desde vCenter.
*   **Compatibilidad (Hardware Version):** Al dejar el valor por defecto en "Compatibility", estás asegurando que la VM pueda hacer vMotion hacia versiones de ESXi que soporten esa versión de hardware virtual (ej. vmx-20 en ESXi 8.0).

---

## 3. Conceptos Clave para Examen y Producción

Este laboratorio contiene preguntas clásicas de la certificación VCP:

1.  **¿Qué archivos componen una VM?** 
    *   `.vmx`: Archivo de configuración (texto plano).
    *   `.vmdk`: El disco virtual (los datos).
    *   `.nvram`: Configuración de la BIOS/EFI.
    *   `.vmsd` / `.vmsn`: Relacionados con Snapshots.
2.  **Unregister vs. Delete:** Debes saber que "Unregister" (Remove from Inventory) solo quita la VM de la vista de vCenter, mientras que "Delete from Disk" destruye los datos. En producción, siempre se recomienda "Remove from Inventory" primero si tienes dudas.
3.  **ISO Mounting:** Una VM puede tener dependencias de múltiples datastores. Si borras el `ICM-Datastore` donde está la ISO mientras la VM está encendida, podrías causar errores de I/O en la consola de la VM.

---

## 4. Expansión de Terminología y Tecnología

1.  **`.vmx` (Virtual Machine Configuration):** Es el "cerebro" de la VM. Si este archivo se corrompe, la VM no puede arrancar aunque los discos virtuales estén sanos. Siempre es buena práctica tener backups de estos archivos pequeños.
2.  **Registration (Registro):** Es el proceso de añadir una VM existente al inventario de un host ESXi o vCenter Server. Se realiza navegando por el datastore hasta encontrar el `.vmx`. Es la técnica número 1 para recuperar VMs después de que un vCenter ha sido reinstalado.
3.  **Thin Provisioning:** Tecnología que asigna espacio bajo demanda. A diferencia de "Thick Provision Lazy Zeroed" (que reserva todo el espacio pero no lo limpia) o "Eager Zeroed" (que reserva y limpia, ideal para alto rendimiento), el Thin prioriza el ahorro de espacio sobre la latencia de escritura inicial.
4.  **Guest OS Family:** Al seleccionar "Linux" y "Photon OS", vCenter optimiza los dispositivos virtuales (como el adaptador de red VMXNET3) para ese kernel específico, garantizando el mejor rendimiento posible.

**Mentor's Note:** Has completado el ciclo. Creaste la red, configuraste el almacenamiento, nivelaste los hosts y ahora has creado y destruido vida virtual sobre esa base. Estás más que preparado para el **Laboratorio 13**, donde veremos cómo esa VM que creaste puede "viajar" entre los hosts gracias a la infraestructura simétrica que has construido.
