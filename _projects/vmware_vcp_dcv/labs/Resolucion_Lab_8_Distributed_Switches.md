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

# Informe Técnico: Implementación de vSphere Distributed Switch (vDS)

> En el laboratorio anterior trabajamos con **Standard Switches (VSS)** —que se gestionan host por host—, en este **Laboratorio 8** entramos en el mundo de los **vSphere Distributed Switches (vDS)**.
>
> El vDS es la piedra angular para infraestructuras de alto rendimiento y gran escala, permitiendo centralizar la administración de red en el vCenter. Aquí tienes la resolución y el análisis técnico.

## Laboratorio

- ![[Attachments/ICM8_U1_LAB-MANUAL_v09-2023_Help-IT.pdf]] - páginas 39 - 43

## Resolución/aprendizaje

Este laboratorio marca la transición de una gestión de red individualizada a una gestión centralizada y distribuida. El vDS actúa como un único interruptor virtual que abarca múltiples hosts, garantizando la consistencia de la configuración en todo el Datacenter.

## 1. Resolución de Tareas

### Tarea 1: Creación del vDS y Configuración de Teaming
*   **Acción:** En la vista de **Networking**, creamos el `vds-Lab` (versión 8.0.0) con el port group inicial `pg-SA-Production`.
*   **Ajuste de Teaming (Uplink 3):** Se ha modificado el Port Group para que solo utilice el **Uplink 3** como activo, moviendo el resto a *Unused*.
*   **Justificación:** Al forzar el uso de un único Uplink específico en el port group, estamos dirigiendo de forma determinística el tráfico de las VMs hacia una tarjeta física concreta (`vmnic3`), lo cual es vital para aislar tipos de tráfico o realizar diagnósticos.
*  En [[Resolucion_Lab_8_Task_1_Step_by_Step]] se detalla el paso a paso de esta tarea mas especificamente!**

### Tarea 2: Adición de Hosts y Migración de Networking
*   **Acción:** Usamos el asistente **Add and Manage Hosts**.
*   **Asignación Física:** Se mapean las tarjetas físicas `vmnic3` de ambos hosts (`sa-esxi-01` y `sa-esxi-02`) al objeto lógico **Uplink 3** del switch distribuido.
*   **Migración de VMs:** Se realiza la migración en caliente de las interfaces de red de las máquinas virtuales desde el Standard Switch hacia el nuevo Port Group distribuido (`pg-SA-Production`).
*   **Resultado:** vCenter reasigna los puertos lógicos sin interrumpir la ejecución de las VMs, manteniendo la conectividad en el nuevo plano de datos.

### Tarea 3: Verificación de la Infraestructura
*   **Topología:** La vista de **Topology** confirma visualmente que ambos hosts están "conectados" al mismo objeto lógico y que sus `vmnic3` están activas.
*   **Propiedades Avanzadas:** 
    *   **MTU 1500:** Tamaño de trama estándar.
    *   **CDP (Cisco Discovery Protocol):** Configurado en modo *Listen*, permitiendo a ESXi identificar a qué puerto del switch físico de Cisco está conectado realmente.
    *   **Static Binding:** Asegura que una VM mantenga su puerto asignado incluso si se apaga, facilitando el seguimiento de estadísticas y seguridad.

---

### Finalidad y Aprendizaje Clave (The "VCP" Takeaway)

Lo más importante que pone en evidencia esta práctica es la **Abstracción Total de la Red**:

1.  **Administración Centralizada:** En el Lab 7, si hubieras tenido 100 hosts, habrías tenido que crear 100 switches manualmente. Con el vDS del Lab 8, creas el switch **una sola vez** en vCenter y "extiendes" sus beneficios a todos los hosts.
2.  **Consistencia de Configuración:** El vDS elimina el error humano. No hay riesgo de que un administrador escriba "Produccion" (sin tilde) en un host y "Producción" en otro, lo que rompería el vMotion. En el vDS, el nombre es global.
3.  **Separación del Plano de Control y de Datos:** 
    *   El **Plano de Control** reside en el vCenter (donde tú creas el switch).
    *   El **Plano de Datos** reside en los hosts (donde los frames se conmutan realmente).
    *   *Dato VCP:* Si el vCenter se cae, las VMs siguen teniendo red porque el plano de datos en los hosts ya tiene la configuración "impresa".
4.  **Visibilidad de Red Física (CDP/LLDP):** La práctica introduce la capacidad de vCenter para "ver" más allá de lo virtual, permitiendo al administrador de virtualización hablar el mismo idioma que el administrador de redes físicas al identificar puertos reales.

**Estado del Entorno:** Tu centro de datos ahora cuenta con una red de clase empresarial, escalable y con visibilidad avanzada. Estás listo para configurar el almacenamiento compartido sobre esta red.






