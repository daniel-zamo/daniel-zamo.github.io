---
id: "VMW-202405201839"
title: 
type: Lab_Report
status: Validated
priority: High
certification: "VCP-DCV"
course: "vSphere ICM v8"
module: ""
lab_id: "Lab 9"
domain: Storage
technology: [, ]
environment: Lab
mentor_tips: true
exam_relevant: true
related_notes: 
  - ""
created: 2026-03-20
---

# Informe Técnico: Configuración de Almacenamiento iSCSI y Multipathing


> Configurar el almacenamiento **iSCSI** no es solo "conectar un disco"; es diseñar la red de almacenamiento para que sea redundante y eficiente.
>
>Este **Laboratorio 9** se centra en la técnica de **Multipathing (MPIO)** y el **Port Binding**, que es donde la mayoría de los administradores junior suelen fallar.


El almacenamiento compartido es el corazón de vSphere; sin él, funciones como vMotion, HA o DRS no son posibles. En este laboratorio, configuraremos el host `sa-esxi-02` para que "vea" el almacenamiento que ya tiene el host `01`.

## 1. Fase de Auditoría: Entendiendo el Estándar (Tarea 1)
*   **Acción:** Inspeccionar `sa-esxi-01.vclass.local`.
*   **Observación Clave:** Notamos que el adaptador `vmhba65` ya ve 4 LUNs (0, 2, 5 y 6).
*   **Justificación Profesional:** Antes de configurar un nuevo host, un VCP debe entender la infraestructura existente. Aquí vemos que el direccionamiento IP de almacenamiento está en el rango `172.20.10.x`.

## 2. Configuración de Red para Almacenamiento (Tareas 2 y 3)
Esta es la parte más crítica del diseño. Para iSCSI, no queremos "Teaming" de red tradicional; queremos **Multipathing**.

*   **Paso A (vmk1):** Creamos un nuevo Standard Switch (`vSwitch2`) con las tarjetas físicas `vmnic5` y `vmnic6`. Creamos el port group `IP Storage 1` con la IP `172.20.10.62`.
*   **Paso B (vmk2):** En el mismo `vSwitch2`, añadimos otro VMkernel (`vmk2`) llamado `IP Storage 2` con la IP `172.20.10.72`.
*   **El "Truco" del Experto (Teaming & Failover):**
    *   Para **vmk1**: Forzamos a que **vmnic5** sea la única *Active* y movemos `vmnic6` a *Unused*.
    *   Para **vmk2**: Forzamos a que **vmnic6** sea la única *Active* y movemos `vmnic5` a *Unused*.
*   **Justificación:** iSCSI **Port Binding** requiere una relación 1:1 entre un adaptador VMkernel y un adaptador físico (Uplink). Esto permite que el stack de VMware gestione el balanceo de carga y el failover a nivel de protocolo SCSI, no de red.

## 3. Activación del Adaptador de Software (Tarea 4)
*   **Acción:** Añadir el "iSCSI Software Adapter" en el host `sa-esxi-02`.
*   **Justificación:** Al no tener una tarjeta HBA física dedicada, ESXi utiliza los ciclos de la CPU para encapsular las instrucciones SCSI en paquetes TCP/IP. Al activarlo, se genera el nombre IQN único del host.

## 4. Descubrimiento y Vinculación (Tarea 5)
*   **Dynamic Discovery:** Apuntamos al "Target" (la cabina de discos) en la IP `172.20.10.15`.
*   **Network Port Binding:** Es el paso final donde "casamos" la red con el almacenamiento. Añadimos `vmk1` y `vmk2` al adaptador `vmhba65`.
*   **Rescan:** Al terminar, el host descubre las LUNs.
*   **Resultado esperado:** Veremos las LUNs 0, 2, 5 y 6. El estado de los caminos (Paths) debe aparecer como **Active**.

---

### Finalidad y Aprendizaje Clave (The "VCP" Takeaway)

Lo más importante que este laboratorio pone en evidencia es la **Arquitectura de Red para IP Storage**:

1.  **Network Port Binding (MPIO):** Aprendemos que para iSCSI no basta con tener red; necesitamos que vCenter sepa exactamente por qué puerto físico debe salir cada petición para maximizar el ancho de banda (usando ambos uplinks simultáneamente).
2.  **Aislamiento de Tráfico:** El uso de un switch dedicado (`vSwitch2`) y subredes específicas evidencia que el tráfico de almacenamiento debe estar aislado del tráfico de gestión o de las máquinas virtuales para evitar latencias.
3.  **Identificación Unívoca:** El uso de IPs estáticas (`172.20.10.62/72`) y nombres IQN es lo que permite que la cabina de discos (Target) autorice al host (Initiator) a montar los volúmenes.

**Conclusión:** Se ha pasado de tener dos servidores aislados a tener un entorno listo para el **Clúster**. Ahora que ambos hosts ven el mismo almacenamiento, las máquinas virtuales pueden "vivir" en los discos compartidos, permitiendo que un host asuma la carga del otro en caso de fallo.

