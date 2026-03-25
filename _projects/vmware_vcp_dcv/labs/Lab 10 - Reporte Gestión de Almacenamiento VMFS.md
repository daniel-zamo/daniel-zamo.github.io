---
id: "VMW-202405201830"
title: "Gestión de Datastores VMFS: Expand vs Extend"
type: Lab_Report
status: Validated
priority: High
certification: "VCP-DCV"
course: "vSphere ICM v8"
module: "Module 10"
lab_id: "Lab 10"
domain: Storage
technology: [iSCSI, VMFS6, LUN]
environment: Lab
mentor_tips: true
exam_relevant: true
related_notes: 
  - "[[Arquitectura_iSCSI_Deep_Dive]]"
  - "[[Lab_07_Storage_Connectivity]]"
created: 2024-05-20
---

# Lección de Ingeniería: Gestión Avanzada de Datastores VMFS (Lab 10)

Felicidades por la decisión de reforzar estos conceptos. Como tu mentor, te diré que el **Laboratorio 10** es donde se separan los administradores de los arquitectos. No se trata solo de "hacer espacio", sino de entender la **integridad de los datos** y la **agilidad del almacenamiento**.

Al operar bajo un túnel inverso, recuerda que las operaciones de particionado y formateo de VMFS son críticas; si la conexión fluctúa durante un *Expand* o *Extend*, el inventario de vCenter podría mostrar el datastore como "Inaccessible" temporalmente. No entres en pánico, el *Rescan* es tu mejor amigo.

---

## 1. Guía Operativa Estratégica: La Lógica del Ciclo de Vida del Disco

Este laboratorio te enseña las cuatro operaciones vitales del almacenamiento:

### Fase A: El Particionado Inteligente (Task 1)
*   **Lógica:** Al crear `VMFS-2` sobre la LUN 2 (11 GB) pero reduciendo el tamaño a **8 GB**, estás dejando "espacio en blanco" al final del disco físico. 
*   **Propósito:** Esto simula un escenario real donde un administrador reserva espacio para crecimiento futuro o para otras particiones, evitando el agotamiento inmediato de la LUN.

### Fase B: Expansión vs. Extensión (Task 2 y Task 4)
Este es el punto más importante del laboratorio.
*   **Expand (Task 2):** Aumentas el tamaño del datastore usando el espacio que dejaste libre en la **misma LUN** (LUN 2). Es una operación segura y limpia.
*   **Extend (Task 4):** Aumentas el tamaño agregando una **LUN diferente** (LUN 6). Esto crea lo que llamamos un **Datastore Multi-Extent**.
*   **Lógica:** El `VMFS-2` se convierte en un "volumen distribuido" que abarca dos dispositivos físicos distintos.

### Fase C: Decomisionamiento Seguro (Task 3)
*   **Lógica:** Eliminar `VMFS-3` es necesario para liberar la LUN 6. En vSphere, no puedes "quitarle" una LUN a un datastore sin destruirlo. Primero destruyes el sistema de archivos para poder reutilizar el hardware en la Task 4.

---

## 2. Justificación de Diseño y "Ojo Clínico"

Desde la perspectiva de certificación VCP/VCAP, aquí es donde aplicamos el criterio técnico:

*   **Peligro de los Extents (Task 4):** Como arquitecto, te advierto: **Extender un datastore con una segunda LUN es una práctica de alto riesgo.** Si la LUN 2 o la LUN 6 fallan físicamente, **todo el datastore `Shared-VMFS` se corrompe y pierdes todas las VMs**. Es como un RAID 0 (JBOD). Solo se recomienda si no hay otra opción para crecer.
*   **VMFS 6 y el Overhead (Task 1, Paso 6):** Notarás que el espacio disponible es menor a 8 GB. VMFS 6 utiliza una estructura de metadatos más pesada que VMFS 5 para soportar funciones como **Automatic UNMAP**. Ese "overhead" es el precio de tener un sistema de archivos empresarial ultra-eficiente.
*   **Nomenclatura (Task 4, Paso 4):** Cambiar el nombre a `Shared-VMFS` al final es vital. En producción, un datastore llamado "VMFS-2" no dice nada. Un nombre funcional indica que ese recurso es compartido por el clúster, evitando que otro administrador intente borrarlo pensando que es local.

---

## 3. Conceptos Clave para Examen y Producción

1.  **Diferencia Crítica: Expand vs. Extend:**
    *   **Expand (Aumentar):** Misma LUN, más espacio. (Recomendado).
    *   **Extend (Extender):** Nueva LUN, se suma al volumen. (Riesgoso).
2.  **VMFS 6 vs VMFS 5:** Recuerda que VMFS 6 es la versión actual. No se puede "convertir" de 5 a 6; hay que crear uno nuevo y migrar las VMs (Storage vMotion).
3.  **Particionado de Bloques:** VMFS usa bloques de **1 MB** (Large Block) de forma nativa desde la versión 5, lo que optimiza el rendimiento para archivos de discos virtuales (`.vmdk`) de gran tamaño.

---

## 4. Expansión de Terminología y Tecnología

Selecciono estos 4 términos que aparecen en tus archivos y son fundamentales:

1.  **Extent (Extensión):** Es cada una de las particiones físicas que componen un datastore. Un datastore puede tener hasta **32 extents**. En tu Task 4, verás en "Device Backing" que tienes dos extents formando un solo nombre lógico.
2.  **Device Backing:** Es la pestaña que revela la verdad física del almacenamiento. Te dice qué identificador de hardware (NAA ID) respalda a tu volumen VMFS. Es la herramienta principal para mapear errores de la cabina de discos hacia vSphere.
3.  **System Overhead:** Son los recursos que el sistema de archivos reserva para el **Journaling**. VMFS es un sistema de archivos *journaled*, lo que significa que registra los cambios antes de escribirlos. Si hay una caída de tensión, el Journal permite que el datastore se recupere sin errores de consistencia.
4.  **Resignature (implícito en el manejo de LUNs):** Aunque el lab no lo detalla, cuando borras un datastore y lo reutilizas, vCenter a veces detecta una "firma" antigua. Saber manejar las firmas de las LUNs es vital cuando trabajas con réplicas o snapshots de almacenamiento.

**Mentor's Note:** Ahora que dominas cómo crear, estirar y fusionar discos físicos en volúmenes lógicos, tienes la base sólida de almacenamiento para que, cuando entres al **Lab 13**, entiendas exactamente sobre qué "suelo" se están moviendo tus máquinas virtuales. ¡Excelente trabajo de refuerzo!
