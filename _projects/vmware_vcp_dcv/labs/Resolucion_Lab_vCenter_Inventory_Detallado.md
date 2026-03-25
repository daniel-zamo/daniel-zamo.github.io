# Gestión de Inventario y Salud del Host

##  Laboratorio / Escenario

![[Lab 4 Creating and Managing vCenter Inventory - obj and task.pdf]]

![[Lab 4 Creating and Managing vCenter Inventory - task 1.pdf]]

![[Lab 4 Creating and Managing vCenter Inventory - task 2 part I.pdf]]

![[Lab 4 Creating and Managing vCenter Inventory - task 2 part II.pdf]]

![[Lab 4 Creating and Managing vCenter Inventory - task 3.pdf]]

##  Informe Técnico Final 

Este documento completa la fase de despliegue del inventario, centrándose ahora en la **auditabilidad de recursos** y el **fortalecimiento de la seguridad (Hardening)**.

## 1. Implementación de Objetos y Hosts (Tareas 1 y 2)
*   **Acción:** Creación del Datacenter (`ICM-Datacenter`) e incorporación de los hosts `sa-esxi-01` y `sa-esxi-02`.
*   **Nota de Cumplimiento:** Aunque en la captura inicial se usó un nombre personalizado, para seguir el estándar del manual se recomienda el uso de `ICM-Datacenter`.

## 2. Auditoría de Recursos y Visibilidad (Tarea 3)
Tras la adición de los hosts, se ha procedido a la inspección técnica desde la pestaña **Summary** del host `sa-esxi-01.vclass.local`:

*   **Capacidad de Cómputo (Q1):** El host dispone de **2 Procesadores Lógicos (CPUs)**.
*   **Capacidad de Memoria (Q2):** El host cuenta con **16 GB de RAM** instalados.
*   **Conectividad de Red (Q3):** El host está conectado inicialmente a **1 Red**.
*   **Gestión de Alertas de Seguridad:** Se han detectado avisos sobre la activación de **ESXi Shell** y **SSH**. Siguiendo el manual, se han suprimido (*Suppress Warning*) para limpiar el panel de alarmas, tras entender su implicación.

---

### ¿Qué pone en evidencia esta práctica? (Aprendizajes Clave)

Como experto, esta práctica resalta tres pilares críticos que todo administrador certificado debe dominar:

#### A. La Tríada de Visibilidad (CPU, RAM, Red)
Pone en evidencia que el **vSphere Client es la "Única Fuente de Verdad" (Single Source of Truth)**. Un VCP debe saber localizar instantáneamente los recursos físicos asignados para diagnosticar problemas de rendimiento o planificar el despliegue de nuevas VMs (Capacity Planning).

#### B. Seguridad y Superficie de Ataque (Hardening)
La práctica evidencia que vCenter es proactivo en la seguridad. La aparición de alertas por tener SSH o el Shell activos no es un error de funcionamiento, sino una **advertencia de riesgo**.
*   **Concepto VCP:** En producción, dejar SSH abierto permanentemente aumenta la superficie de ataque. VMware recomienda activarlo solo para tareas de Troubleshooting y desactivarlo inmediatamente después.

#### C. Gestión del "Ruido" en el Monitoreo
Al realizar el "Suppress Warning", la práctica enseña la importancia de mantener un **panel de "Issues and Alarms" limpio**. 
*   **Justificación:** Si un administrador ignora las alertas constantes (ruido), eventualmente ignorará una alerta crítica real. Aprender a gestionar (suprimir o resolver) avisos conocidos es vital para la salud operativa del Datacenter.

#### D. Consistencia en el Inventario
La navegación entre los objetos (`Datacenter` > `Host` > `Summary`) refuerza la comprensión de la **jerarquía de objetos de vSphere**, permitiendo al administrador entender que la configuración de un host individual afecta a la capacidad total del contenedor superior (el Data Center).

**Estado del Laboratorio:** Inventario configurado, recursos auditados y panel de alarmas saneado. Listo para el siguiente módulo de configuración de red o almacenamiento.

---
---

## Informe Técnico (Respuesta 002): Gestión de Inventario y Salud del Host (Lab 4)

Este documento completa la fase de despliegue del inventario, centrándose ahora en la **auditabilidad de recursos** y el **fortalecimiento de la seguridad (Hardening)**.

## 1. Implementación de Objetos y Hosts (Tareas 1 y 2)
*   **Acción:** Creación del Datacenter (`ICM-Datacenter`) e incorporación de los hosts `sa-esxi-01` y `sa-esxi-02`.
*   **Nota de Cumplimiento:** Aunque en la captura inicial se usó un nombre personalizado, para seguir el estándar del manual se recomienda el uso de `ICM-Datacenter`.

## 2. Auditoría de Recursos y Visibilidad (Tarea 3)
Tras la adición de los hosts, se ha procedido a la inspección técnica desde la pestaña **Summary** del host `sa-esxi-01.vclass.local`:

*   **Capacidad de Cómputo (Q1):** El host dispone de **2 Procesadores Lógicos (CPUs)**.
*   **Capacidad de Memoria (Q2):** El host cuenta con **16 GB de RAM** instalados.
*   **Conectividad de Red (Q3):** El host está conectado inicialmente a **1 Red**.
*   **Gestión de Alertas de Seguridad:** Se han detectado avisos sobre la activación de **ESXi Shell** y **SSH**. Siguiendo el manual, se han suprimido (*Suppress Warning*) para limpiar el panel de alarmas, tras entender su implicación.

---

### ¿Qué pone en evidencia esta práctica? (Aprendizajes Clave)

Como experto, esta práctica resalta tres pilares críticos que todo administrador certificado debe dominar:

#### A. La Tríada de Visibilidad (CPU, RAM, Red)
Pone en evidencia que el **vSphere Client es la "Única Fuente de Verdad" (Single Source of Truth)**. Un VCP debe saber localizar instantáneamente los recursos físicos asignados para diagnosticar problemas de rendimiento o planificar el despliegue de nuevas VMs (Capacity Planning).

#### B. Seguridad y Superficie de Ataque (Hardening)
La práctica evidencia que vCenter es proactivo en la seguridad. La aparición de alertas por tener SSH o el Shell activos no es un error de funcionamiento, sino una **advertencia de riesgo**.
*   **Concepto VCP:** En producción, dejar SSH abierto permanentemente aumenta la superficie de ataque. VMware recomienda activarlo solo para tareas de Troubleshooting y desactivarlo inmediatamente después.

#### C. Gestión del "Ruido" en el Monitoreo
Al realizar el "Suppress Warning", la práctica enseña la importancia de mantener un **panel de "Issues and Alarms" limpio**. 
*   **Justificación:** Si un administrador ignora las alertas constantes (ruido), eventualmente ignorará una alerta crítica real. Aprender a gestionar (suprimir o resolver) avisos conocidos es vital para la salud operativa del Datacenter.

#### D. Consistencia en el Inventario
La navegación entre los objetos (`Datacenter` > `Host` > `Summary`) refuerza la comprensión de la **jerarquía de objetos de vSphere**, permitiendo al administrador entender que la configuración de un host individual afecta a la capacidad total del contenedor superior (el Data Center).

**Estado del Laboratorio:** Inventario configurado, recursos auditados y panel de alarmas saneado. Listo para el siguiente módulo de configuración de red o almacenamiento.

---
---

## Informe Técnico (Respuesta inicial/parcial): Gestión de Inventario y Salud del Host (Lab 4)

Este reporte detalla la implementación de la jerarquía lógica del Data Center y la integración de recursos de cómputo, siguiendo los estándares de VMware para entornos vSphere 7.x/8.x.

## 1. Implementación del Objeto Data Center (Tarea 1)
*   **Procedimiento:** 
    1. Acceso al vSphere Client con credenciales administrativas (`administrator@vsphere.local`).
    2. En la vista de **Hosts and Clusters**, se realiza clic derecho sobre el FQDN del vCenter (`sa-vcsa-01.vclass.local`).
    3. Selección de **New Datacenter** con el nombre exacto: `ICM-Datacenter`.
*   **Justificación Técnica:** El Data Center actúa como el contenedor principal de objetos (Hosts, VMs, Redes, Datastores). Es el nivel donde se definen las jerarquías de inventario y es esencial para organizar los recursos físicos y lógicos.

## 2. Incorporación de Hosts ESXi al Inventario (Tarea 2)
*   **Procedimiento para `sa-esxi-01` y `sa-esxi-02`:**
    1. **Asistente Add Host:** Se inicia desde el objeto `ICM-Datacenter`.
    2. **Autenticación:** Uso de credenciales `root` y la contraseña `VMware1!`.
    3. **Lifecycle Management (Paso Crítico):** Según la nota adicional en la página 17, se debe **desmarcar** "Manage host with an image". 
    4. **Licenciamiento:** Selección de la licencia "ESXi Training".
    5. **Lockdown Mode:** Configurado como **Disabled** para permitir la gestión flexible durante el laboratorio.
*   **Justificación Técnica:** Al añadir los hosts, el vCenter toma el control de los mismos instalando el agente `vpxa`. Deshabilitar el modo de gestión por imagen (vLCM) simplifica la gestión inicial al no requerir una imagen de cluster unificada en este nivel del laboratorio.

## 3. Verificación de Estado
*   **Acción:** Una vez finalizadas las tareas, el inventario debe mostrar bajo `ICM-Datacenter` ambos hosts en estado "Connected" y sin alarmas de configuración pendientes.

---

### Lo más importante a adquirir (Learning Outcomes)

Como experto en **VCP-DCV**, la ejecución de estas tareas busca que el administrador asimile tres conceptos fundamentales que son la base de cualquier diseño de Centro de Datos Definido por Software (SDDC):

1.  **La Estructura Lógica vs. Física:** Aprender que la organización en vCenter no tiene por qué reflejar la posición física de los servidores, sino su propósito administrativo (Entornos de Prod, Dev, etc.).
2.  **Gestión de Ciclo de Vida (vLCM):** El paso de desmarcar "Manage host with an image" es clave. vSphere 7 introdujo las "Imágenes de Cluster". Aprender cuándo usar una gestión basada en "Baselines" (VUM) frente a "Imágenes" (vLCM) es una competencia crítica del VCP moderno.
3.  **Modo de Bloqueo (Lockdown Mode):** Entender que en producción, este modo suele activarse para que los hosts solo sean gestionables vía vCenter, aumentando la seguridad. En laboratorios se deja desactivado para permitir el acceso directo vía Host Client o SSH si el vCenter fallara.

**Recomendación:** Si el laboratorio tiene scripts de validación automática al final, asegúrate de que el nombre del Datacenter sea exactamente `ICM-Datacenter` como indica el manual, y no el nombre personalizado de la captura anterior.
