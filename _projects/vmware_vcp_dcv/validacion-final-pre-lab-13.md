---
note_type: theory
---

# Informe de Salida: Luz Verde para el Laboratorio 13

¡Afirmativo, ingeniero! Tienes **Luz Verde** para proceder al **Laboratorio 13**. 

Como tu mentor, he revisado la "telemetría" de tus capturas y el estado actual de tu infraestructura. Has logrado lo más difícil en la ingeniería de virtualización: **la simetría perfecta de un clúster**. Sin el almacenamiento compartido que acabas de arreglar, el Lab 13 habría sido un fracaso inmediato.

---

## 1. Guía Operativa: El "Pre-Flight Check" para el Lab 13

El Laboratorio 13 trata habitualmente sobre **vMotion** (migración en vivo de VMs). Para que este laboratorio no te dé errores, antes de empezar, haz esta última comprobación rápida en el vSphere Client:

1.  **Servicio vMotion en VMkernel:**
    *   Ve a cada host (`01` y `02`) -> **Configure** -> **Networking** -> **VMkernel adapters**.
    *   Busca el adaptador de **Management** (`vmk0`). Haz clic en **Edit**.
    *   Asegúrate de que el checkbox **vMotion** esté marcado en ambos hosts. 
    *   *Lógica:* vMotion es un protocolo que necesita "permiso" para viajar por un adaptador VMkernel. Si no está marcado, la migración fallará al 10%.
2.  **Visibilidad del Port Group:**
    *   Asegúrate de que la VM que vas a migrar esté conectada a un Port Group que **ambos hosts vean** (preferiblemente el `pg-SA-Production` del switch distribuido que creamos en el Lab 8).

---

## 2. Justificación de Diseño: Por qué ahora sí funcionará

¿Por qué era imposible pasar al Lab 13 antes?

*   **El "Aterrizaje" de la VM:** vMotion mueve la CPU y la RAM de una VM de un host a otro, pero **no mueve los archivos de disco** (eso sería *Storage vMotion*). 
*   **La Dependencia:** Para que la VM "vuele" del Host 01 al Host 02, el Host 02 tiene que estar leyendo el mismo disco exactamente al mismo tiempo. Al haber arreglado el acceso iSCSI en el `sa-esxi-02`, ahora el Host 02 tiene "permiso" para tomar el control de los archivos de la VM cuando esta llegue.

---

## 3. Conceptos Clave para vMotion (Examen VCP)

En el Lab 13, pon mucha atención a estos tres pilares que suelen ser preguntas de certificación:

1.  **Migración de Estado:** vMotion transfiere el *estado activo* de la memoria y la conectividad de red. La VM nunca se entera de que cambió de servidor físico.
2.  **Requisitos de Red:** Se recomienda una red de **1 Gbps dedicado** (mínimo) para vMotion. En entornos de producción modernos, usamos **10 Gbps o más**, ya que cuanto más lenta sea la red, más tiempo tarda la migración y más riesgo hay de que la VM se "congele" un instante.
3.  **Compatibilidad de CPU (EVC):** Si tus hosts tuvieran procesadores muy distintos (ej. un Intel antiguo y un Intel nuevo), vMotion fallaría. En tu laboratorio, los hosts son idénticos, por lo que no tendrás este problema.

---

## 4. Expansión de Terminología para el Lab 13

1.  **vMotion Dirty Page Index:** Durante la migración, la VM sigue escribiendo en RAM. vMotion copia la memoria en "iteraciones". Si la VM escribe muy rápido, vMotion tiene que ser más rápido aún. Esto es tecnología de punta en el kernel de ESXi.
2.  **vMotion Network:** Es el tráfico que viaja por el puerto VMkernel que habilitamos. Es un tráfico **no cifrado por defecto** (aunque en versiones 7.0+ se puede activar *Encrypted vMotion*). Por eso, en producción, esta red SIEMPRE debe estar en una VLAN privada y aislada.
3.  **Migration Threshold:** Es una configuración del clúster (DRS) que determina qué tan "agresivo" es vCenter para mover VMs entre hosts para balancear la carga.

**Consejo Final:** Cuando realices el Lab 13, fíjate en la tarea de vCenter. Verás que pasa de "0% a 100%" muy rápido. Si se queda clavado en el **14%**, suele ser un problema de red (VMkernel); si se queda en el **65%**, suele ser un problema de almacenamiento (Datastore). Pero con el trabajo que hemos hecho hoy, ¡debería deslizarse como seda!

**¡Adelante con el Laboratorio 13, Ingeniero!**
