El **Laboratorio 11** introduce el almacenamiento de nivel de fichero (**File-level storage**), completando así la visión de los protocolos más usados en el datacenter moderno: iSCSI (bloques) y NFS (ficheros).

Este laboratorio se centrará en la diferencia operativa entre las versiones de NFS y la importancia de la red VMkernel para este protocolo.

# Informe Técnico: Implementación y Gestión de Almacenamiento NFS

A diferencia de VMFS, donde el host ESXi gestiona el sistema de archivos, en NFS delegamos esa responsabilidad en la cabina (NAS). El host simplemente "monta" un directorio remoto.

## 1. Configuración de NFS 4.1 (Tarea 1)
*   **Acción:** Montar `NFS-Datastore` apuntando a `172.20.10.15` con el path `/mnt/NFS-POOL`.
*   **Justificación Técnica:** Se utiliza la versión **4.1** porque soporta nativamente multipathing (si la cabina lo permite) y ofrece mejores algoritmos de bloqueo de archivos (locking) y seguridad mediante Kerberos. 
*   **Punto Crítico:** El manual recalca que el nombre del folder es **Case-sensitive**. Es común que un error en una mayúscula en el path es la causa del 90% de los fallos de montaje en producción.

## 2. Análisis del Almacenamiento (Tarea 2)
*   **Observación:** Al revisar el Summary, el administrador debe verificar que el tipo sea **NFS 4.1** y que el espacio disponible coincida con lo configurado en la cabina.
*   **Insight Profesional:** Se ha notado que no hubo que elegir "Partition Configuration" ni "Block Size". Esto es porque el volumen ya viene formateado desde el servidor NFS; ESXi solo lo consume.

## 3. El Desafío Opcional: NFS 3 y Bind to vmknic
El manual sugiere un paso avanzado: desmontar el volumen y volverlo a montar usando **NFS 3** con la opción **Bind to vmknic**.

*   **¿Por qué es importante?** NFS 3 es un protocolo "single-path" por naturaleza (solo usa una conexión TCP). Al marcar **Bind to vmknic** y seleccionar `vmk0`, estamos forzando de forma determinista por qué interfaz física saldrá el tráfico de este datastore.
*   **Justificación:** En entornos de troubleshooting o redes muy segmentadas, el "Binding" asegura que el tráfico de almacenamiento no se mezcle con otros flujos, garantizando el ancho de banda.

---

### Finalidad y Aprendizaje Clave (The "VCP" Takeaway)

Lo más importante que este laboratorio pone en evidencia es la **Abstracción del Protocolo de Almacenamiento**:

1.  **Ficheros vs Bloques:** Con iSCSI (Lab 9/10), se creo un sistema de archivos VMFS sobre un disco "virgen". Con NFS, simplemente se ha conectado una carpeta. Al final, para la Máquina Virtual, el resultado es el mismo: un lugar donde guardar sus archivos `.vmdk`.
2.  **Visibilidad Multihost:** Al seleccionar ambos hosts (`sa-esxi-01` y `02`) durante el asistente, vCenter realiza el montaje simultáneo en ambos. Esto evidencia que vCenter actúa como un **orquestador de configuración**, manteniendo la consistencia en todo el cluster.
3.  **Elección de Versión:** Se ha visto que NFS 4.1 es la recomendación moderna por su soporte de **Session Trunking** (multipathing), mientras que NFS 3 se mantiene por compatibilidad y simplicidad, requiriendo configuraciones adicionales como el "Binding" para control de tráfico.

**Conclusión de la sesión de hoy:**
Hasta aquí, se ha construido una infraestructura completa. Teniendo:
*   Un Inventario organizado por carpetas.
*   Una Red Distribuida (`dvs-Lab`) configurada.
*   Almacenamiento compartido de Bloques (`Shared-VMFS` vía iSCSI).
*   Almacenamiento compartido de Ficheros (`NFS-Datastore`).

**El entorno ahora, está 100% preparado para las funciones avanzadas de VMware (vMotion, HA y DRS).** Se ha pasado de tener servidores aislados a tener un verdadero Software-Defined Datacenter. 

