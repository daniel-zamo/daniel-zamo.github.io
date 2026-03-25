---
created: 2026-03-16 23:12
updated: 2026-03-16 23:12
up: "[[Getafe - Curso 1453]]"
type: laboratory
status: 🔴 draft
tags:
  - learn
  - curso
  - vmware
  - esxi
---

# # Informe Técnico: Configuración de Networking Virtual (Standard Switches)

> Entramos en una de las áreas más determinantes para un **VCP-DCV**: el Networking Virtual.  Este **Laboratorio 7** es fundamental porque establece como permitir a las máquinas virtuales comunicarse con el mundo exterior. 
>
> Desde mi desktop trabajo Linux y/o Windows del aula, operando sobre el túnel hacia el entorno vSphere, procedo con la creación de **vSphere Standard Switches (VSS)**. Esta es la resolución

## Laboratorio

- ![[Attachments/ICM8_U1_LAB-MANUAL_v09-2023_Help-IT.pdf]] - páginas 31 - 38.

## Resolución/aprendizaje


Este laboratorio pone en práctica la abstracción del hardware de red. Creamos una infraestructura de conmutación aislada para el tráfico de producción, garantizando la separación de funciones a nivel de capa 2.

## 1. Resolución de Tareas

### Tarea 1: Inspección de vSwitch0 (Default Switch)
*   **Análisis:** El `vSwitch0` es el interruptor creado durante la instalación de ESXi.
*   **Respuestas a Auditoría:**
    *   **Q1 (Adaptadores físicos):** Generalmente `vmnic0` (y posiblemente `vmnic1` para redundancia). (aunque en nuestro laboratorio es diferente, ver al pie)
    *   **Q2 (Port Groups):** "VM Network" (para tráfico de VMs) y "Management Network" (puerto VMkernel para gestión).
    *   **Q3 (VMs conectadas):** Se observan las VMs del laboratorio (Linux-02, 04, 06) colgadas del grupo "VM Network".

#### Respuestas:  Resolución de Auditoría: Configuración de vSwitch0 (sa-esxi-01)

![[Virtual Switches - Configuración inicial en el laboratorio Charly.png]]

Basado en la captura de pantalla del vSphere Client de nuestro laboratorio activo, la resolución técnica de la **Tarea 1 del Lab 7**, con las respuestas validadas y justificadas desde la perspectiva de un experto **VCP-DCV**.

Al analizar la vista de **Virtual Switches** del host `sa-esxi-01.vclass.local`, se extraen los siguientes datos técnicos que responden a las preguntas del manual:

***Q1. ¿Qué adaptadores físicos están conectados a vSwitch0?***
*   **Respuesta:** `vmnic0`, `vmnic4`, `vmnic5` y `vmnic6`.
*   **Justificación:** En el panel de la derecha (**Physical Adapters**), se listan estos cuatro adaptadores con un estado de "10000 Full" (10 Gbps). Esto indica que el switch tiene un **NIC Teaming** de cuatro uplinks, lo que proporciona tanto agregación de ancho de banda como redundancia ante fallos de cableado físico o de puertos de switch de acceso.

***Q2. ¿Qué grupos de puertos (Port Groups) están conectados a vSwitch0?***
*   **Respuesta:** `IP Storage 1`, `IP Storage 2`, `Management Network` y `VM Network`.
*   **Justificación:** El diagrama muestra cuatro etiquetas lógicas en el lado izquierdo.
    *   **IP Storage 1 y 2:** Son puertos de tipo **VMkernel (vmk1 y vmk2)**, utilizados para tráfico de almacenamiento (probablemente iSCSI o NFS).
    *   **Management Network:** Es el puerto **VMkernel (vmk0)** que permite que vCenter gestione el host.
    *   **VM Network:** Es un **Virtual Machine Port Group**, destinado al tráfico de datos de las máquinas virtuales.

***Q3. ¿Qué máquinas virtuales y plantillas están conectadas al grupo de puertos "VM Network"?***
*   **Respuesta:** `Linux-02`, `Linux-04`, `Linux-06`, `Linux-Template`, `Photon-Base` y `Photon-HW`.
*   **Justificación:** Bajo la sección "VM Network", la interfaz muestra explícitamente **Virtual Machines (6)**. Al expandir el listado, se observan estas 6 entidades. Esto confirma que sus tarjetas de red virtuales (vNICs) están conmutando tráfico a través de este port group específico.

##### Notas importantes hasta aquí

>Lo más importante que esta tarea pone en evidencia es el concepto de **Multi-Homing y Segmentación en un Switch Estándar**:
>
>1.  **Convergencia de Red:** La captura demuestra un diseño donde el tráfico de gestión, el de almacenamiento y el de las VMs conviven en el mismo switch físico virtualizado. 
>2.  **Importancia del Teaming:** Al ver 4 vmnics (Q1), aprendes que vSphere puede balancear carga. Si desconectaras el cable de `vmnic0`, las VMs y la gestión seguirían funcionando a través de las otras tres, sin caída de servicio.
>3.  **Diferenciación de Servicios:** El aprendizaje vital aquí es distinguir entre un **Port Group de VM** (donde "viven" las máquinas) y un **Puerto VMkernel** (donde el host ESXi "habla" para gestionarse o buscar discos). Sin un puerto VMkernel correctamente configurado (como el `Management Network`), el host aparecería como *Disconnected* en tu vCenter.

**Conclusión:** el host `sa-esxi-01` tiene una configuración de red robusta y con alta densidad de máquinas ya operativas en el switch por defecto.

---

### Tarea 2: Creación de vSwitch1 y Port Group "Production"
*   **Acción:** En ambos hosts (`sa-esxi-01` y `sa-esxi-02`), añadimos networking de tipo **Virtual Machine Port Group** creando un **New Standard Switch**.
*   **Configuración de Uplinks:** Se asigna el adaptador físico **vmnic2** como *Active Adapter*. 
*   **Etiquetado (Labeling):** Se nombra el Port Group como `Production`.
*   **Importancia de la Simetría:** Es crítico que el nombre "Production" sea idéntico (case-sensitive) en ambos hosts para permitir futuras migraciones de VMs sin pérdida de conectividad.

### Tarea 3: Migración de VMs y Verificación de Capa 3
*   **Acción:** Cambiamos la configuración de hardware de `Linux-02` y `Linux-04`, moviendo su adaptador de red de "VM Network" a **"Production"**.
*   **Prueba de Conectividad:**
    1. Encendido de la VM.
    2. Verificación de IP vía consola: Se obtiene una dirección en el rango `172.20.11.x`.
    3. **Ping Test:** Éxito al pinguear la puerta de enlace `172.20.11.2`.
*   **Resultado:** Se confirma que el tráfico fluye correctamente a través del nuevo `vSwitch1` hacia el segmento de red físico asociado a `vmnic2`.

---

### Finalidad y Aprendizaje Clave (The "VCP" Takeaway)

Lo más importante que este laboratorio pone en evidencia es la **Arquitectura de Tres Capas del Networking Virtual**:

1.  **El Port Group (Capa Lógica):** Es donde definimos las políticas (VLANs, Seguridad). Las VMs no se conectan al Switch, se conectan al *Port Group*. La finalidad es etiquetar el tráfico.
2.  **El Virtual Switch (Capa de Conmutación):** Es el puente de software que decide hacia dónde van los frames internos. No tiene inteligencia de capa 3 (IP), trabaja puramente con MAC addresses.
3.  **El Uplink / vmnic (Capa Física):** Es el cable de red real. El aprendizaje clave aquí es que **una vmnic solo puede pertenecer a un vSwitch a la vez**, pero un vSwitch puede tener múltiples vmnics (NIC Teaming).

#### ¿Por qué creamos un segundo Switch (`vSwitch1`)?
Una justificación para esta configuración aplicada, es el **Aislamiento de Tráfico**. En entornos reales, separamos el tráfico de gestión (vSwitch0) del tráfico de datos de las VMs (vSwitch1). Esto evita que una tormenta de broadcast en las máquinas virtuales sature la gestión del host, y permite dedicar tarjetas físicas exclusivas (vmnic2) para el rendimiento de las aplicaciones.

**Estado del Entorno:** Hemos segmentado la red. Las máquinas Linux ahora operan en un entorno de "Producción" dedicado, preparadas para pruebas de alta disponibilidad.
