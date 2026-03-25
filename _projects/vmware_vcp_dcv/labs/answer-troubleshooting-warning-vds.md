
![Troubleshooting Warning VDS](media/troubleshooting-warning-vds.png)

Hola de nuevo. Como tu mentor en esta sesión, vamos a realizar un "triage" de esa alerta. En vSphere, un icono de **Warning (triángulo amarillo)** en la pestaña de *Hosts* de un **Distributed Port Group** es la forma que tiene el sistema de decirte que existe una inconsistencia entre la configuración lógica del switch distribuido y el estado físico de ese host específico.

### 1. Diagnóstico Inmediato: ¿Qué significa ese Warning?

En el contexto del **Lab 8** (donde configuramos Teaming y Uplinks), ese aviso en `sa-esxi-02.vclass.local` generalmente apunta a una de estas tres causas críticas:

*   **Pérdida de Redundancia de Uplink (Uplink Redundancy Loss):** Como en el paso 7 del manual configuramos el Port Group para usar **únicamente el Uplink 3** y movimos los demás a "Unused", el host detecta que solo tiene un camino físico hacia la red. Si ese adaptador fallara, el Port Group quedaría incomunicado. vSphere lanza un warning para avisarte que no hay un "failover" configurado.
*   **Inconsistencia de Red (Network Health Check):** Si la función de *Health Check* del VDS está activa, puede estar detectando que la `vmnic3` del `sa-esxi-02` no tiene conectividad con la VLAN configurada o que hay una discrepancia en el MTU (Maximum Transmission Unit) respecto al `sa-esxi-01`.
*   **Fallo de Sincronización:** Debido a que estás operando a través de un **túnel inverso**, es posible que el agente `hostd` del ESXi-02 no haya terminado de reportar la actualización de la configuración del VDS al vCenter.

### 2. "Ojo Clínico": Cómo investigar el error real

No adivinemos; vamos a interrogar al sistema. Sigue estos pasos en tu consola:

1.  **Haz clic sobre el nombre del host** (`sa-esxi-02.vclass.local`) directamente desde esa pantalla.
2.  Ve a la pestaña **Monitor** y luego selecciona **Issues and Alarms** -> **Triggered Alarms**.
    *   *Tip de Arquitecto:* Aquí leerás el mensaje exacto, por ejemplo: *"Network connectivity lost"* o *"vSphere Distributed Switch MTU supported status"*.
3.  **Verificación de Uplink:** Ve a la pestaña **Configure** del host, sección **Networking** -> **Physical adapters**. Asegúrate de que la `vmnic3` esté en estado "Connected" y negociando a la velocidad correcta (1000 Mbps o 10 Gbps).

### 3. Justificación Técnica (Por qué el ESXi-01 está bien y el 02 no)

Es muy común en laboratorios que, al realizar el **Task 2 (Add and Manage Hosts)**, se asigne correctamente la `vmnic` en el primer host pero se omita involuntariamente en el segundo, o que el adaptador físico del segundo host esté "down" en el simulador/entorno real.

Si el error es **"Teaming Policy Mismatch"**, significa que el host todavía cree que debe usar los Uplinks 1, 2 y 4, pero el Port Group le está diciendo que están prohibidos (Unused).

### 4. Acción Recomendada

Antes de seguir con el Laboratorio 13 (que probablemente falle porque depende de que esta red sea estable), haz lo siguiente:

1.  **Re-escaneo de Configuración:** Selecciona el host `sa-esxi-02`, haz clic derecho -> **Connection** -> **Refresh Storage Information** (esto a veces fuerza un refresco de inventario de red también) o simplemente espera 60 segundos debido a la latencia de tu túnel.
2.  **Validación de Paso 4 (Task 2):** Asegúrate de que en el asistente "Add and Manage Hosts", la `vmnic3` de **AMBOS** hosts quedó asignada al **Uplink 3**. Es el error más frecuente.

**¿Qué dice la sección "Triggered Alarms" de ese host?** Si me das el texto exacto de la alarma, te diré exactamente qué cable virtual está desconectado.

#< //END: DIAGNOSTICO_WARNING_VDS.md