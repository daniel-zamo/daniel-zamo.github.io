# Lección de Mentoría: Desbloqueando el Almacenamiento iSCSI

¡Excelente trabajo! La primera captura confirma que has nivelado el terreno: **los adaptadores VMkernel (`vmk1` y `vmk2`) ya existen en el host 02**. Eso es el 50% de la batalla.

Ahora, entiendo perfectamente tu confusión en el Paso 2. Como Arquitecto, te explico el "por qué" de lo que ves: **El botón de "Add iSCSI adapter" está deshabilitado porque YA tienes uno creado (`vmhba65`)**. En vSphere, solo se permite un adaptador iSCSI por software por host. No necesitas crear uno nuevo; lo que necesitamos es **configurar el que ya tienes** para que "hable" con la cabina de discos.

Mira tus capturas: en la columna **Targets, Devices y Paths sale "0"**. El adaptador está encendido (Online), pero está "sordo": no sabe a dónde mirar ni por qué cable salir.

---

## 1. Guía Operativa: Configuración del Adaptador vmhba65

Sigue estos pasos exactos en la pantalla de tu segunda captura (donde tienes seleccionado `vmhba65`):

### A. Identificar el "Target" (¿A dónde llamamos?)
1.  Con `vmhba65` seleccionado, mira las pestañas de abajo y haz clic en **Dynamic Discovery**.
2.  Haz clic en **ADD**.
3.  Introduce la IP del servidor de almacenamiento: `172.20.10.15`.
4.  Haz clic en **OK**. 
    *   *Nota:* Te saldrá un aviso diciendo que se recomienda un "Rescan". **No lo hagas todavía**, falta el siguiente paso vital.

### B. Configurar el "Network Port Binding" (¿Por qué cable salimos?)
Esta es la parte más importante para la certificación VCP. Tenemos que decirle al adaptador iSCSI que use los VMkernels que creaste en el Paso 1.
1.  Haz clic en la pestaña **Network Port Binding** (está al lado de Dynamic Discovery).
2.  Haz clic en el botón **ADD**.
3.  Selecciona ambos adaptadores: **IP Storage 1 (`vmk1`)** e **IP Storage 2 (`vmk2`)**.
4.  Haz clic en **OK**. Ahora verás que ambos aparecen en la lista con estado "Active" o "Last Active".

### C. El "Rescan" Final (El momento de la verdad)
1.  Ahora sí, arriba en la barra de herramientas, haz clic en el botón **RESCAN ADAPTER**.
2.  Observa el panel de "Recent Tasks" abajo. Espera a que termine "Rescan all HBAs" y "Compute Datastore Discovery".

---

## 2. Justificación de Diseño: El "Ojo Clínico"

*   **¿Por qué estaban en 0 los dispositivos?** El iSCSI por software no es "Plug & Play" automático. Sin el *Dynamic Discovery*, el host no sabe que existe un servidor de discos. Sin el *Port Binding*, el host intentaría salir por la red de Gestión (`vmk0`), lo cual suele estar bloqueado por firewalls o por diseño de seguridad.
*   **La importancia del Port Binding:** Al añadir `vmk1` y `vmk2`, estamos habilitando el **Multipathing**. Si el `vmk1` (que va por la `vmnic5`) se desconecta, el almacenamiento seguirá funcionando por el `vmk2` (`vmnic6`) instantáneamente.

---

## 3. Conceptos Clave para Examen y Producción

*   **IQN (iSCSI Qualified Name):** En tu segunda captura lo ves bajo "iSCSI Name": `iqn.1998-01.com.vmware:sa-esxi-02...`. Este es el "DNI" de tu servidor. En un entorno real, tendrías que copiar este nombre y pegarlo en la consola de tu cabina de discos (NetApp, Dell EMC, PureStorage) para darle permiso de acceso. En este laboratorio, el servidor ya está pre-configurado para aceptar cualquier IQN del rango de la clase.
*   **Dynamic vs Static Discovery:** 
    *   *Dynamic:* El host le pregunta al servidor: "¿Qué discos tienes para mí?". El servidor le responde con la lista completa. (Es lo que usamos el 99% de las veces).
    *   *Static:* Tú escribes manualmente el nombre IQN de cada disco. Solo se usa en redes de seguridad extrema.

---

## 4. Expansión de Terminología

1.  **LUN (Logical Unit Number):** Una vez que termines el Rescan, verás que la columna "Devices" pasa de 0 a 4. Esas son las LUNs. Cada LUN se convertirá después en un Datastore (VMFS).
2.  **Paths (Caminos):** Si configuraste bien el Port Binding, verás que por cada Device tienes al menos 2 Paths. Esto indica que hay redundancia física.
3.  **Target (Destino):** Es el servidor de almacenamiento (el "Portal"). En tu caso, es la entidad en la IP `172.20.10.15` que ofrece discos a la red.

**¿Qué sigue?**
Una vez que veas **Devices: 4** y **Paths: 8** (o similar) en la línea de `vmhba65`, ve al icono de **Storage** (el cilindro). Verás que los Datastores `ICM-Datastore` e `iSCSI-Datastore` ahora deberían mostrarse como conectados para ambos hosts. 

Si el `sa-esxi-02` sigue sin verlos, haz clic derecho sobre el Datastore -> **Mount Datastore**. ¡Adelante, ingeniero!
