# Reporte de Ingeniería: Implementación y Escalabilidad de vSphere Distributed Switches (VDS)

Como tu mentor y arquitecto, he analizado el manual del **Laboratorio 8**. No lo veas simplemente como una serie de clics; lo que estás haciendo es sentar las bases del "tejido conectivo" de un Centro de Datos Definido por Software (SDDC). 

Operar esto a través de un **túnel inverso** en Windows Server 2019 desde un entorno Linux/Windows añade una capa de complejidad (latencia y refresco de UI). Ten paciencia con la consola de vSphere, ya que los cambios en el plano de control distribuido pueden tardar unos segundos en propagarse a los hosts ESXi.

---

## 1. Guía Operativa Estratégica: Lógica detrás del Despliegue

La creación de un **vSphere Distributed Switch (VDS)** se divide en tres fases críticas que garantizan la continuidad del servicio:

### Fase A: Definición del Plano de Control (Task 1)
*   **Creación del Objeto VDS:** Al crear `dvs-Lab`, vCenter genera una plantilla de configuración. Es vital elegir la versión **8.0.0** porque define qué funciones avanzadas (como NSX-T avanzado o mejoras en offloading) estarán disponibles.
*   **Aislamiento de Tráfico (Teaming Policy):** El manual te pide dejar solo el **Uplink 3** activo para `pg-SA-Production`. 
    *   *Lógica:* Estamos forzando un determinismo físico. Al mover los demás uplinks a "Unused", garantizamos que el tráfico de producción no se mezcle con otros servicios (como vMotion o vSAN) que podrían estar en los otros adaptadores.

### Fase B: Anclaje Físico y Migración (Task 2)
*   **Asignación de vmnic3:** Aquí es donde el mundo virtual toca el cable de cobre/fibra. Al asociar la `vmnic3` de cada host al `Uplink 3` del VDS, estamos creando el puente de datos.
*   **Migración en Caliente:** El asistente "Migrate VM networking" es una herramienta de abstracción potente. Reasigna el "vNIC" de la máquina virtual del switch estándar al distribuido sin perder paquetes (siempre que la VLAN subyacente sea la misma en el switch físico).

### Fase C: Validación de Consistencia (Task 3)
*   **Topología y CDP:** La verificación no es opcional. El uso de **CDP (Cisco Discovery Protocol)** en modo *Listen* es el "ojo clínico" del administrador para ver qué hay del otro lado del cable sin necesidad de pedirle al equipo de Networking que revise los logs del switch físico.

---

## 2. Justificación de Diseño y "Ojo Clínico"

Desde la perspectiva de un Arquitecto VCAP, aquí es donde los errores comunes separan a un novato de un experto:

*   **Versión del VDS (8.0.0):** **¡Cuidado!** Si tienes hosts ESXi en versión 7.0 en tu clúster, un VDS versión 8.0 no podrá ser asociado a ellos. Siempre diseña el VDS basándote en el host más antiguo de tu inventario si planeas interoperabilidad.
*   **Static Binding vs. Ephemeral:** El manual usa **Static Binding** (por defecto). En producción, esto es preferible porque el puerto se asigna a la VM y se mantiene incluso si vCenter cae. El puerto "pertenece" a la VM, lo que facilita la resolución de problemas de conectividad.
*   **Elastic Port Allocation:** Al configurar los puertos como **Elastic**, el VDS puede crecer dinámicamente. En versiones antiguas de VMware, el límite de puertos era fijo, lo que causaba que las VMs no pudieran encenderse si el "pool" de puertos se agotaba. Aquí, el diseño prioriza la escalabilidad automática.

---

## 3. Conceptos Clave para Examen (VCP/VCAP) y Producción

Si te enfrentas al examen de certificación, memoriza estas distinciones:

1.  **Plano de Control vs. Plano de Datos:** El VDS reside lógicamente en vCenter (Plano de Control), pero la ejecución del switching ocurre localmente en cada host ESXi (Plano de Datos). Si vCenter desaparece, el tráfico NO se detiene, pero no puedes hacer cambios de configuración.
2.  **Uplinks vs. vmnics:** Un **Uplink** es una ranura lógica en el VDS. Una **vmnic** es el adaptador físico real en el servidor. La magia del VDS es que puedes llamar "Uplink 1" a la `vmnic0` en el Host A y a la `vmnic4` en el Host B, manteniendo la uniformidad de políticas.
3.  **Discovery Protocols (CDP/LLDP):** Es una pregunta recurrente. Recuerda que VDS soporta ambos. **CDP** es propietario de Cisco, mientras que **LLDP** (Link Layer Discovery Protocol) es el estándar abierto (802.1AB). Saber cuál usar depende de tu hardware de red físico.

---

## 4. Expansión de Terminología Técnica

Para tu crecimiento como ingeniero, profundicemos en estos términos del manual:

1.  **Port Binding (Asociación de Puertos):** Es el mecanismo que determina cuándo y cómo se asigna un puerto de switch a una VM. En **Static Binding**, el puerto se reserva al conectar la VM; en **Ephemeral**, se asigna solo cuando la VM se enciende (útil principalmente para recuperación de desastres cuando vCenter no está disponible).
2.  **MTU (Maximum Transmission Unit):** El manual indica 1500 bytes (estándar Ethernet). En entornos de alto rendimiento (vSAN o iSCSI), solemos subir esto a **9000 (Jumbo Frames)** para reducir la sobrecarga de la CPU al procesar menos paquetes pero más grandes.
3.  **Teaming and Failover:** No es solo redundancia. Es el conjunto de reglas que deciden qué camino toma un paquete. Al mover uplinks a "Unused", estás definiendo una política de **Active/Unused**, eliminando cualquier posibilidad de balanceo de carga para ese Port Group específico, asegurando ancho de banda dedicado.
