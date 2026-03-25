Este **Laboratorio 10** es la culminación práctica de la gestión de almacenamiento. Aquí es donde dejamos de ver "discos" (LUNs) y empezamos a gestionar "volúmenes lógicos" (Datastores).

El analisis de este laboratorio se centrará en la diferencia crítica entre **Expandir** y **Extender**, un concepto que suele ser pregunta de examen y, lo más importante, una decisión de diseño vital en producción.

# Informe Técnico: Ciclo de Vida y Escalabilidad de Datastores VMFS

En esta sesión, gestionaremos el sistema de archivos de alto rendimiento de VMware: **VMFS-6**. El objetivo es dominar las operaciones de creación, crecimiento y eliminación de almacenamiento compartido.

## 1. Creación de Datastores y Particionado (Tarea 1)
*   **Operación:** Se crean `VMFS-2` (usando parte del LUN 2) y `VMFS-3` (usando el LUN 6).
*   **Ojo Clínico del Experto:** En el paso `3.i`, el manual nos pide reducir el tamaño del datastore a **8 GB** a pesar de que el LUN tiene 11 GB. 
*   **Justificación:** Esto se hace deliberadamente para dejar "espacio sin reclamar" en el LUN y poder practicar la **Expansión** en la siguiente tarea. Es una simulación de cuando un administrador de almacenamiento agranda un volumen en la cabina y nosotros debemos reclamar ese espacio desde vSphere.

## 2. Expansión vs. Extensión (Tareas 2 y 4)
Este es el núcleo de aprendizaje del laboratorio. Un VCP debe diferenciar estas dos operaciones:

### A. Expandir (Tarea 2)
*   **Acción:** Aumentar `VMFS-2` usando el espacio libre del **mismo LUN** (LUN 2).
*   **Justificación:** Es la forma más segura y recomendada de crecer. Se mantiene la integridad del volumen en un solo objeto físico.

### B. Extender (Tarea 4)
*   **Acción:** Aumentar `VMFS-2` agregando un **segundo LUN** (LUN 6, que quedó libre tras borrar `VMFS-3` en la Tarea 3).
*   **Justificación:** Esto crea un **"Extent"** (envergadura). Estamos uniendo dos discos físicos distintos en un solo volumen lógico.
*   **Advertencia Profesional:** Como experto, debo señalar que el uso de *Extents* aumenta el riesgo: si falla cualquiera de los dos LUNs (LUN 2 o LUN 6), se pierde la integridad de todo el Datastore `Shared-VMFS`. Solo se recomienda en casos donde no se puede agrandar el LUN original en la cabina.

## 3. Eliminación Segura (Tarea 3)
*   **Acción:** Borrar `VMFS-3`.
*   **Justificación:** Antes de borrar, vSphere verifica que no haya máquinas virtuales registradas ni archivos activos (como ISOs o logs). En producción, este paso es irreversible y destruye todos los datos del volumen.

## 4. Renombrado Dinámico (Tarea 4, punto 4)
*   **Acción:** Cambiar `VMFS-2` a `Shared-VMFS`.
*   **Justificación:** VMFS permite el cambio de nombre en caliente. Esto es vital para mantener la **consistencia de nombres** en el inventario sin afectar a la ejecución de las VMs (ya que vSphere utiliza el UUID interno, no el nombre amigable, para identificar el datastore).

---

### Finalidad y Aprendizaje Clave (The "VCP" Takeaway)

Lo más importante que este laboratorio pone en evidencia es la **Flexibilidad del Almacenamiento VMFS**:

1.  **Independencia del Hardware:** Aprendemos que el tamaño de un Datastore no es estático. Puede crecer dinámicamente según las necesidades del negocio.
2.  **VMFS-6 y Metadatos:** Al usar VMFS-6 (paso 3.h), estamos utilizando la versión que permite el desbloqueo automático de espacio (Automatic UNMAP), lo que devuelve espacio fino al almacenamiento físico de forma eficiente.
3.  **Gestión de Multiextent:** La Tarea 4 evidencia cómo vSphere puede "sumar" capacidades de diferentes discos. Al finalizar, el reporte de **Device Backing** mostrará dos nombres de dispositivo para un solo Datastore, una vista técnica que todo administrador debe saber interpretar para el troubleshooting de rendimiento.

**Estado del Laboratorio:** Se ha configurado un Datastore compartido llamado `Shared-VMFS` que ahora es visible por ambos hosts. La infraestructura está finalmente lista para mover máquinas virtuales entre servidores sin apagar el servicio.


