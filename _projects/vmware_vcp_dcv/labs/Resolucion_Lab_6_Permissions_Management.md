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

# Informe Técnico: Implementación de Control de Acceso Basado en Roles (RBAC)

> Este laboratorio representa la culminación de la seguridad y el control de acceso en vSphere. La gestión de **RBAC (Role-Based Access Control)** es lo que separa a un administrador básico de un arquitecto de virtualización. 
>
> Aquí se detalla la resolución técnica y el análisis de la **Tarea 6**, adaptada a la integración con Active Directory que realizamos en el paso anterior.

## Laboratorio

- ![[Attachments/ICM8_U1_LAB-MANUAL_v09-2023_Help-IT.pdf]] - páginas 25-30

## Resolución/aprendizaje

En este laboratorio, aplicamos el principio de **"Mínimo Privilegio"**. Ya no usamos la cuenta raíz; ahora delegamos funciones específicas a usuarios del dominio `vclass.local` basándonos en sus responsabilidades.

## 1. Procedimiento de Ejecución

### Tarea 1: Verificación de Identidades
*   **Acción:** Navegamos a **Administration** > **Users and Groups**.
*   **Filtro:** Cambiamos el dominio a `vclass.local`.
*   **Resultado:** Confirmamos que vCenter "ve" correctamente a los usuarios del Directorio Activo: `cladmin` (Content Library Admin) y `studentadmin`.

### Tarea 2: Asignación de Permisos Globales (Usuario `cladmin`)
*   **Ubicación:** **Administration** > **Global Permissions**.
*   **Configuración:** 
    *   Usuario: `cladmin@vclass.local`.
    *   Rol: **Content library administrator (sample)**.
    *   Opción: **Propagate to children** (marcado).
*   **Justificación:** Los Permisos Globales se aplican a objetos que están "fuera" del árbol jerárquico estándar, como las Bibliotecas de Contenido (Content Libraries).

### Tarea 3: Asignación de Permisos de Objeto (Usuario `studentadmin`)
*   **Ubicación:** Vista **Hosts and Clusters** > Seleccionar el vCenter (`sa-vcsa-01.vclass.local`) > Pestaña **Permissions**.
*   **Configuración:**
    *   Usuario: `studentadmin@vclass.local`.
    *   Rol: **Administrator**.
    *   Opción: **Propagate to children** (marcado).
*   **Justificación:** Al asignar el permiso en la raíz (vCenter) con propagación, el usuario tendrá control total sobre todo lo que cuelga de él (Datacenters, Clusters, Hosts y VMs).

### Tareas 4 y 5: Validación de Roles
*   **Prueba cladmin:** Al loguearse, puede crear bibliotecas de contenido, pero en la vista de inventario (Hosts/VMs), la mayoría de las acciones (como "New VM") aparecen en gris (**read-only**).
*   **Prueba studentadmin:** Tiene acceso total. Puede iniciar el asistente de "New Virtual Machine", evidenciando que ha heredado el rol de Administrador correctamente.

---

### Finalidad y Aprendizaje Clave (The "VCP" Takeaway)

Lo más importante que pone en evidencia esta práctica es la **Arquitectura de Permisos de vSphere**, basada en tres componentes:

1.  **La Tríada de Seguridad:** 
    *   **Usuario/Grupo:** "¿Quién eres?" (autenticado por AD).
    *   **Rol:** "¿Qué puedes hacer?" (colección de privilegios).
    *   **Objeto:** "¿Dónde puedes hacerlo?" (vCenter, Datacenter, Carpeta).
2.  **Permisos Globales vs. Permisos de Inventario:** 
    *   Es vital entender que un usuario puede ser "Dios" en el inventario (Hosts/VMs) pero no tener permiso para ver las Content Libraries si no se le asigna un **Global Permission**. Este laboratorio fuerza esta distinción.
3.  **Herencia y Propagación:** 
    *   La opción **"Propagate to children"** es una herramienta poderosa pero peligrosa. Permite una administración ágil (asignas una vez arriba y se aplica a todo), pero un error en la raíz puede comprometer la seguridad de todo el Datacenter.
4.  **Segregación de Funciones:** 
    *   El éxito de la Tarea 4 (ver acciones en gris para `cladmin`) demuestra que vCenter aplica correctamente las restricciones. Esto es esencial para entornos donde el equipo de Storage no debe tocar las VMs, o el equipo de Backup solo debe tener permisos de lectura.

**Conclusión Profesional:** Se ha configurado un entorno **Enterprise-Ready**. Ahora se tiene una estructura jerárquica (Lab 4), integrada con identidad corporativa (Lab 5) y con políticas de acceso granulares (Lab 6).
