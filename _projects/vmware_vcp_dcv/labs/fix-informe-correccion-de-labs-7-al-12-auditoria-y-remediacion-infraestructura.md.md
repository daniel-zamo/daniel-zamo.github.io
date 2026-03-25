# Informe de Auditoría de Arquitectura: Corrección de Labs 7 al 12

Estimado ingeniero, tras una revisión profunda de los manuales adjuntos y las capturas de tu entorno real, he identificado una **desconexión crítica entre la configuración de red y el almacenamiento** en tu host `sa-esxi-02`.

El "Warning" que ves no es solo un error de un paso; es el resultado de una reacción en cadena. Aquí tienes el desglose técnico y el plan de remediación.

---

## 1. Análisis de Discrepancias (¿Dónde fallamos?)

### El error en el Lab 7 (Networking Estándar)
En el **Lab 7, Task 2**, se te pidió crear el `vSwitch1` con el Port Group `Production` en **ambos** hosts utilizando la `vmnic2`. 
*   **Diagnóstico:** Si olvidaste este paso en el `sa-esxi-02`, el host quedó sin una interfaz física dedicada al tráfico de producción. Aunque el **Lab 8** intenta arreglar esto moviéndote a un switch distribuido (VDS), el VDS usa la `vmnic3`. 
*   **Impacto:** Tienes una inconsistencia en la numeración de adaptadores que confunde al plano de control de vCenter.

### El error en el Lab 9 (iSCSI - El origen del problema de Datastores)
Tus capturas de los datastores (`ICM-Datastore`, `iSCSI-Datastore`) muestran que **solo el sa-esxi-01 los tiene montados**. 
*   **Diagnóstico:** Te saltaste o falló la configuración del **Lab 9, Task 2, 3 y 4** en el `sa-esxi-02`. 
*   **Por qué ocurre:** Para que un host vea un Datastore iSCSI, no basta con "querer montarlo". Necesitas:
    1.  **VMkernel Ports:** `vmk1` y `vmk2` en el `sa-esxi-02` (Lab 9, Task 2).
    2.  **Software iSCSI Adapter:** Activado en el `sa-esxi-02` (Lab 9, Task 4).
    3.  **Network Port Binding:** Asociar esos vmk con el adaptador iSCSI (Lab 9, Task 5).
*   **Sin esto, el ESXi-02 está "ciego" ante el almacenamiento compartido.**

---

## 2. Guía Operativa de Remediación (Paso a Paso)

Sigue este orden estrictamente para limpiar tu entorno antes de intentar el Lab 13:

### Paso 1: Nivelar la Red de Almacenamiento (Repasando Lab 9)
1.  Selecciona `sa-esxi-02` -> **Configure** -> **Networking** -> **VMkernel adapters**.
2.  **Verificación:** ¿Existen `IP Storage 1` e `IP Storage 2` con las IPs `172.20.10.62` y `172.20.10.72`? 
    *   *Si no:* Haz el **Lab 9, Task 2 y 3** ahora mismo. Sin estas IPs, el host no puede hablar con la cabina de discos.

### Paso 2: Activar el Adaptador de Almacenamiento
1.  Selecciona `sa-esxi-02` -> **Configure** -> **Storage** -> **Storage Adapters**.
2.  Haz clic en **ADD SOFTWARE ADAPTER** -> **Add iSCSI adapter**.
3.  En la pestaña **Dynamic Discovery**, añade la IP del servidor iSCSI: `172.20.10.15` (Lab 9, Task 5, paso 3).

### Paso 3: El "Montaje" Real (Network Port Binding)
Esta es la parte que la mayoría olvida y por eso el datastore no aparece:
1.  En el adaptador iSCSI (`vmhba65`), ve a la pestaña **Network Port Binding**.
2.  Haz clic en **ADD** y selecciona los dos port groups de almacenamiento que creaste.
3.  Dale a **RESCAN ADAPTER**. 
4.  *Resultado esperado:* En la pestaña **Devices**, deberían aparecer 4 LUNs (120GB, 11GB, 130GB, 7GB).

### Paso 4: Visibilidad de Datastores (Lab 10)
Una vez que el host "ve" los dispositivos, los datastores VMFS deberían aparecer automáticamente.
1.  Ve al icono de **Storage** (cilindro).
2.  Selecciona `ICM-Datastore` -> Pestaña **Hosts**.
3.  Si el `sa-esxi-02` no aparece, haz clic derecho en el Datastore -> **Mount Datastore** y selecciona el host 02.

---

## 3. Justificación de Diseño y "Ojo Clínico"

*   **¿Por qué usamos dos VMkernel para iSCSI?** En el Lab 9 se configuran dos puertos (`vmk1` y `vmk2`) y se cruzan las `vmnics` (una activa y otra sin usar en cada uno). Esto se llama **MPIO (Multi-Pathing I/O)**. Si una tarjeta de red falla, el almacenamiento sigue vivo por la otra. Si el ESXi-02 solo tiene una, es un punto único de fallo (SPOF).
*   **Provisionamiento Thin (Lab 12):** En el Lab 12 creaste la VM `Photon-Empty` como **Thin Provision**. Esto es vital en laboratorios: el disco solo ocupa espacio real a medida que escribes datos, permitiéndote "sobre-aprovisionar" el almacenamiento limitado que tienes.

---

## 4. Conceptos Clave para Producción

1.  **Uniformidad de Clúster:** En VMware, todos los hosts de un clúster **DEBEN** ver los mismos datastores y las mismas redes. Si el Host 01 ve el `ICM-Datastore` pero el Host 02 no, no puedes hacer vMotion, y si el Host 01 falla, HA (High Availability) no podrá encender las VMs en el Host 02.
2.  **Rescan vs. Refresh:** El *Refresh* solo actualiza la vista de la interfaz. El *Rescan* (Lab 9, Task 5) obliga al kernel del ESXi a escanear los buses físicos y lógicos en busca de nuevos discos. Úsalo siempre después de cambios en iSCSI.
3.  **Port Group "Production":** Asegúrate de que este Port Group tenga el mismo nombre exacto (case-sensitive) en ambos hosts o en el VDS. Si en uno es "Production" y en otro "production", vMotion fallará.

---

## 5. Terminología Expandida

*   **Software iSCSI Initiator:** Es un código dentro del kernel de ESXi que emula una tarjeta de red iSCSI física. Permite usar tarjetas Ethernet comunes para hablar con cabinas de almacenamiento SAN.
*   **Datastore Cluster:** (Visto en tus capturas de Lab 10). Es un agrupamiento lógico de datastores que permite a vSphere balancear el espacio y el rendimiento (I/O) de manera automática mediante una función llamada Storage DRS.
*   **Mounting vs. Registering:** Montar un datastore es conectar el volumen al host. Registrar una VM (Lab 12, Task 3) es buscar el archivo `.vmx` dentro de ese datastore y añadirlo al inventario del vCenter. Son procesos distintos pero dependientes.

**Mentor's Note:** No pases al Lab 13 hasta que el icono de Warning desaparezca del `sa-esxi-02` y veas que en la pestaña "Hosts" de cada Datastore aparecen **ambos** servidores. ¡Ese es tu indicador de éxito!
