# Informe Técnico: Integración de vCenter con Active Directory (IWA)

## Enunciado

![[pg_0031.pdf]]

![[pg_0032.pdf]]

![[pg_0033.pdf]]

**Nota:** 
> Este laboratorio es un punto de inflexión crítico en la administración de vSphere. Estamos pasando de una gestión de usuarios locales (`@vsphere.local`) a una integración empresarial con **Directorio Activo**.
>
> Aunque el manual original planteaba el uso de LDAP (tachado), las anotaciones indican que utilizaremos **IWA (Integrated Windows Authentication)**. Como experto **VCP-DCV**, te advierto que este método requiere que el vCenter Server Appliance (VCSA) se convierta en un miembro del dominio de Windows antes de poder autenticar usuarios.

## Respuesta / Solución

Este laboratorio evidencia el proceso de federación de identidades. El objetivo es permitir que los administradores utilicen sus credenciales de dominio (`usuario@vclass.local`) para gestionar la infraestructura, aplicando el principio de identidad única.

## 1. Fase 1: Unión del VCSA al Dominio (Prerrequisito)

A diferencia de LDAP, IWA requiere que el "vCenter" sea un objeto de computadora dentro del Directorio Activo.

1.  **Acceso:** Menú Principal > **Administration** > Single Sign On > **Configuration**.
2.  **Unión al Dominio:** En la pestaña "Active Directory Domain", clic en **JOIN AD**.
    *   **Domain:** `VCLASS.LOCAL`
    *   **User:** `administrator`
    *   **Password:** `VMware1!` (o la misma del RDP).
3.  **El Paso Crítico (Reinicio):** Tras recibir el mensaje de éxito, es **obligatorio** reiniciar el appliance para que los cambios en la pila de autenticación surtan efecto.
    *   Acceso a la VAMI: `https://sa-vcsa-01.vclass.local:5480` (Puerto de gestión).
    *   Credenciales: `root` / `VMware1!`.
    *   Acción: **Reboot**. (Tiempo estimado: 10-15 min).

## 2. Fase 2: Configuración del Identity Source

Una vez reiniciado el sistema y verificado que el nodo es parte del dominio:

1.  Regresar al vSphere Client > **Administration** > SSO > **Configuration**.
2.  Pestaña **Identity Sources** > Clic en **ADD**.
3.  **Tipo de Fuente:** Seleccionar **Active Directory (Integrated Windows Authentication)**.
4.  **Validación:** El sistema reconocerá automáticamente el dominio `vclass.local` al que se unió el appliance. Clic en **ADD**.
5.  **Verificación:** Confirmar que `vclass.local` aparece en la lista de dominios disponibles para el inicio de sesión.

---

### Justificación Técnica y Finalidad (The "VCP" Takeaway)

Lo más importante a adquirir en esta práctica es la comprensión de la **Arquitectura de Single Sign-On (SSO)**:

1.  **IWA vs LDAP:** El manual tacha LDAP porque IWA es el método preferido en entornos Windows por su simplicidad (no requiere configurar URLs de servidor ni certificados manualmente en este paso), permitiendo una integración más "nativa".
2.  **Gestión fuera de banda (VAMI):** La práctica pone en evidencia que el administrador de vSphere no solo usa el vSphere Client (puerto 443), sino que debe dominar la **VAMI (puerto 5480)** para tareas de mantenimiento a nivel de sistema operativo del appliance (reinicio, parches, red).
3.  **Seguridad y Auditoría:** La finalidad última es eliminar el uso de la cuenta genérica `administrator@vsphere.local`. En un entorno real, tras este lab, asignarías permisos a grupos de AD, permitiendo saber **quién** hizo **qué** en el inventario, algo vital para certificaciones de seguridad y auditorías.

**Nota de experto:** Recuerda que tras añadir la fuente de identidad, los usuarios de AD aún no pueden entrar. El siguiente paso lógico (que verás más adelante) es asignarles un **Rol** (Permissions) sobre los objetos del inventario que creamos en el Lab 4.
