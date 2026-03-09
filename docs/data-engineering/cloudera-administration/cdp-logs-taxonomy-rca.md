---
id: cdp-logs-rca
title: "Taxonomía de Logs y Análisis de Causa Raíz (RCA)"
sidebar_label: "Inspección de Logs (RCA)"
sidebar_position: 20
description: "Gestión forense de registros y metodologías de troubleshooting en Cloudera Manager."
tags: [Troubleshooting, Logs, RCA, CDP]
---

# Taxonomía y Metodologías de Inspección de Logs en Cloudera Data Platform (CDP)

En la arquitectura de **Cloudera Data Platform (CDP)**, la gestión y el análisis de registros (logs) constituyen la infraestructura crítica para la observabilidad. El presente reporte establece el marco teórico y procedimental para la inspección forense de logs.

:::info Fuente Técnica
Contenido educido del módulo **ADMIN-230: Administrating Cloudera Data Platform**, orientado a la certificación de administrador.
:::

## 1. Taxonomía de los Registros del Sistema

La telemetría en CDP se organiza en categorías fundamentales, cada una cumpliendo un rol específico en la gobernanza:

| Categoría | Función Principal | Detalle Técnico |
| :--- | :--- | :--- |
| **Hadoop Daemons** | Base del ecosistema | `.log` (runtime) vs `.out` (boot-time/startup). |
| **CM Server Logs** | Orquestación central | Documenta la coordinación de configuraciones y salud global. |
| **CM Agent Logs** | Ejecución en nodos | Seguimiento de comandos a nivel de host y *health checks*. |
| **Audit Logs** | Gobernanza Administrativa | Rastrean cambios de configuración y acciones de usuarios en CM. |
| **Audit Event Logs** | Seguridad de Datos | Documentan acceso a HDFS y cumplimiento de políticas (*compliance*). |
| **Service Daemons** | Roles críticos | Visibilidad interna de NameNode, ResourceManager, etc. |
| **Application Logs** | Capa de Usuario | Logs activos en Web UI e históricos persistidos en HDFS. |

:::tip Diferencia Crítica: .log vs .out
Los archivos **.out** capturan la salida estándar durante el arranque y son truncados. Si un servicio falla al iniciar y no llega a escribir en el `.log`, el archivo `.out` es su única fuente de verdad.
:::

## 2. Estándares de Nomenclatura y Rutas

| Tipo de Log | Estándar de Ruta / Nomenclatura |
| :--- | :--- |
| **CM Server** | `/var/log/cloudera-scm-server/cloudera-scm-server.log` |
| **CM Agent** | `/var/log/cloudera-scm-agent/cloudera-scm-agent.log` |
| **Audit HDFS** | `/var/log/hadoop-hdfs/hdfs-audit.log` |
| **Service Logs** | `/var/log/<service-name>/` |

## 3. Metodologías de Inspección

### A. Vía Web UI (Cloudera Manager)
Ideal para **monitoreo visual y correlación rápida**.
* **Ruta:** `Diagnostics` > `Logs`.
* **Ventajas:** Filtrado multi-host, búsqueda por palabras clave (`ERROR`, `FATAL`) y salto rápido entre roles de un mismo host.

### B. Vía CLI (Línea de Comandos)
Protocolo estándar para **Análisis de Causa Raíz (RCA) profundo**.
* **Requerimiento:** Conexión SSH y privilegios de `root`.
* **Herramientas:** `less`, `grep`, `tail -f`, `vi`.
* **Artefactos extra:** Acceso a directorios `jstacks*` (thread dumps) para diagnosticar procesos colgados (*hung processes*).

## 4. Procedimiento Operativo de RCA (Ejemplo: Spark3)

Ante un fallo en el **Spark3 History Server**, siga este flujo lógico:

1. **Aislamiento:** En Cloudera Manager, localice la instancia del History Server con salud degradada.
2. **Localización:** Use `Log Files` > `Role Log File` en la UI para identificar la **ruta física** en el host.
3. **Acceso:** Conéctese vía SSH al host identificado (ej. `edge.example.com`).
4. **Escalamiento:** Ejecute `sudo su -l`.
5. **Exploración:** 
   ```bash
   cd /var/log/spark3
   ls -la
   ```
6. **Diagnóstico:** Busque excepciones de Java o errores de configuración:
   ```bash
   less spark3-history-server-edge.example.com.log
   ```

## 5. Conclusiones para el Administrador Senior

* **Dicotomía de Diagnóstico:** Diferenciar `.log` de `.out` ahorra horas en incidentes de arranque.
* **Correlación:** Use la Web UI para localizar el error y la CLI para el análisis técnico definitivo.
* **Persistencia:** La jerarquía en `/var/log/` es el último recurso de recuperación ante caídas de los servicios de monitoreo.
