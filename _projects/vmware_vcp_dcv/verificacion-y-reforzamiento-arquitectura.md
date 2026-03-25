# Informe de Éxito: Simetría de Almacenamiento Alcanzada

¡Felicidades, ingeniero! Las capturas que adjuntas son la **"Prueba de Oro"** en virtualización: ambos hosts (`sa-esxi-01` y `sa-esxi-02`) ven los mismos datastores compartidos (`ICM-Datastore` e `iSCSI-Datastore`) con estado **Normal**. 

Has pasado de tener un host aislado a tener un **Clúster Uniforme**. Ahora, para "reforzar mentalmente" y que en el futuro puedas auditar un entorno de producción en segundos, aquí tienes el checklist del Arquitecto Senior.

---

## 1. Guía de Verificación Rápida (The "Sanity Check")

Si quieres estar 100% seguro de que el `sa-esxi-01` (o cualquier host) está "perfectamente" bien, haz este recorrido visual de 30 segundos:

1.  **La Vista de Datastore (Lo que acabas de hacer):**
    *   *Acción:* Pestaña **Hosts** del Datastore.
    *   *Criterio de éxito:* Todos los hosts del clúster deben aparecer en la lista y todos en estado "Normal". Si uno falta, ese host no podrá ejecutar VMs que residan allí.
2.  **La Vista de Adaptador (Caminos y Dispositivos):**
    *   *Acción:* Host -> **Configure** -> **Storage Adapters** -> Selecciona `vmhba65`.
    *   *Criterio de éxito:* Mira la relación entre **Devices** y **Paths**. Si tienes 4 Devices, deberías tener al menos **8 Paths** (2 caminos por cada disco). Si Devices y Paths son iguales (4 y 4), no tienes redundancia; si un cable falla, pierdes el disco.
3.  **La Vista de Red (Port Binding):**
    *   *Acción:* Host -> **Configure** -> **Storage Adapters** -> **Network Port Binding**.
    *   *Criterio de éxito:* El estado debe decir **"Active"**. Si dice "Not Used" o "Last Active", el tráfico no está balanceando correctamente entre tus vmk1 y vmk2.

---

## 2. Justificación de Diseño: ¿Por qué la simetría es ley?

En VMware, la **Simetría de Configuración** es lo que permite las funciones avanzadas que verás en el Lab 13 y posteriores:

*   **vMotion (Movilidad):** Para mover una VM del Host 01 al 02 sin apagarla, ambos hosts deben tener "las mismas manos" (acceso al mismo disco) y "los mismos pies" (acceso al mismo Port Group de red).
*   **vSphere HA (Alta Disponibilidad):** Si el Host 01 explota físicamente, vCenter le dirá al Host 02: *"Reinicia estas VMs"*. El Host 02 solo podrá hacerlo si ya tiene montados los datastores donde viven los archivos de esas VMs. 

---

## 3. Conceptos Clave para Examen y "Troubleshooting" Real

Para tu "biblioteca mental", guarda estos dos escenarios de fallo que se evitan con lo que acabas de configurar:

1.  **APD (All Paths Down):** Ocurre cuando un host pierde todos los caminos a un datastore (ej. se rompen todos los cables de storage). El host se queda "congelado" intentando reintentar la conexión.
2.  **PDL (Permanent Device Loss):** Ocurre cuando la cabina de discos le dice al host: *"Este disco ya no existe (lo borraron o falló la LUN)"*. El host deja de reintentar inmediatamente para evitar bloqueos del kernel.
3.  **Uniformidad de Naming:** En producción, es vital que los datastores tengan el mismo nombre en todos los hosts. VMware usa UUIDs (identificadores únicos largos) internamente, pero para nosotros, los humanos, el nombre es la referencia.

---

## 4. Expansión de Terminología: El Plano de Datos

1.  **Multipathing (PSP - Path Selection Policy):** Es el software dentro de tu ESXi que decide si envía el siguiente paquete de datos por el `vmk1` o por el `vmk2`. Por defecto, VMware usa "Fixed" o "Most Recently Used", pero en entornos de alto rendimiento usamos **Round Robin** para enviar datos por todos los cables a la vez.
2.  **Storage Heartbeating:** Ahora que ambos hosts ven los datastores, vSphere HA usará un pequeño archivo oculto en el `ICM-Datastore` para verificar que los hosts están vivos, incluso si la red de gestión fallara totalmente.
3.  **In-Guest Storage:** Diferencia esto de lo que has hecho. Lo que hiciste fue dar almacenamiento al **ESXi** (Datastore). El *In-Guest* es cuando le das una IP iSCSI directamente a una máquina virtual (ej. un servidor de SQL). Lo que has hecho tú es la mejor práctica general.

**Mentor's Note:** Estás listo para el **Lab 13**. Ya tienes la red (VDS) y el almacenamiento (iSCSI compartido) nivelados. Ahora verás cómo la magia del vMotion une estos dos mundos. ¡Excelente progreso!
