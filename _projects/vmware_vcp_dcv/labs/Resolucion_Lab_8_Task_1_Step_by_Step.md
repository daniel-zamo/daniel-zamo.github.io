---
created: 2026-03-17 00:48
updated: 2026-03-17 00:48
up: "[[Getafe - Curso 1453]]"
type: laboratory
status: 🔴 draft
tags:
  - learn
  - curso
  - vmware
  - esxi
---

# Guía Paso a Paso: Tarea 1 - Creación del vSphere Distributed Switch (vDS)

## Laboratorio

- ![[Attachments/ICM8_U1_LAB-MANUAL_v09-2023_Help-IT.pdf]] - páginas 39 -40

Estos son los pasos exactos para cumplir con la **Tarea 1** del Laboratorio 8:

## 1. Configuración del Asistente (Wizard)
*   **Paso 1 (Name and location):**
    *   En el cuadro **Name**, borra `DSwitch` y escribe: `dvs-Lab`.
    *   Asegúrate de que la localización sea `ICM-Datacenter`.
    *   Haz clic en **NEXT**.
*   **Paso 2 (Select version):**
    *   Selecciona la versión: **8.0.0 - ESXi 8.0 and later**.
    *   Haz clic en **NEXT**.
*   **Paso 3 (Configure settings):**
    *   **Number of uplinks:** Deja el valor por defecto (normalmente 4).
    *   **Network I/O Control:** Enabled (por defecto).
    *   **Port group name:** Borra el nombre genérico y escribe: `pg-SA-Production`.
    *   Haz clic en **NEXT**.
*   **Paso 4 (Ready to complete):**
    *   Revisa el resumen y haz clic en **FINISH**.

## 2. Configuración de Políticas de Tráfico (Teaming and Failover)
Una vez creado el switch, debemos restringir el tráfico para que use únicamente un camino físico específico (Uplink 3), tal como pide el manual:

1.  En el panel de navegación izquierdo (vista de Networking), expande `dvs-Lab`.
2.  Haz clic derecho sobre el port group recién creado: `pg-SA-Production` y selecciona **Edit Settings**.
3.  En la ventana emergente, selecciona la opción **Teaming and failover**.
4.  Bajo la sección **Failover order**, verás los uplinks del 1 al 4.
5.  Selecciona **Uplink 1, Uplink 2 y Uplink 4** (puedes seleccionarlos uno a uno o en grupo).
6.  Utiliza el botón **MOVE DOWN** repetidamente hasta que estos tres se encuentren en la sección **Unused uplinks**.
7.  **Resultado esperado:** Solo el **Uplink 3** debe permanecer en la sección **Active uplinks**.
8.  Haz clic en **OK**.

---

### Finalidad y Aprendizaje Clave (Justificación del Experto)

La finalidad de este proceso "paso a paso" es que adquieras dos competencias críticas para la certificación VCP:

1.  **Estandarización de Nombres:** En infraestructuras distribuidas, el nombre del Port Group (`pg-SA-Production`) es lo que identifica la red para las máquinas virtuales. Si el nombre no es idéntico en todos lados, las funciones de automatización fallan.
2.  **Control de Determinismo de Red:** Al mover los uplinks sobrantes a "Unused", estás obligando a vSphere a usar una tarjeta física específica. Esto se hace en producción para:
    *   Separar físicamente el tráfico (ej. que el tráfico de almacenamiento no comparta cable con el tráfico de usuarios).
    *   Garantizar que, si hay un problema en un switch físico, sepamos exactamente qué camino está tomando la información.

**Estado sugerido:** Corrige el nombre a `dvs-Lab` en tu pantalla actual y prosigue con el flujo indicado para asegurar el éxito de los laboratorios posteriores de migración de hosts.
