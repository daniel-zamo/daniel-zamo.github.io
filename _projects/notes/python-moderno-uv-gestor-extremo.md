---
created: 2024-05-22 10:30
updated: 2024-05-22 10:30
type: note
status: 🟡 seedling
tags:
  - python
  - devtools
  - linux-cli
  - workflow
  - uv
---

# uv: El Nuevo Estándar en la Gestión de Python

**uv** es un gestor de paquetes y entornos de Python extremadamente rápido, escrito en **Rust**. No es solo un reemplazo de `pip`, sino una herramienta "todo en uno" que unifica flujos de trabajo que antes requerían múltiples utilidades.

### ¿Por qué supera a `pip` y `venv`?

1. **Velocidad Radical:** Es entre 10 y 100 veces más rápido que `pip`. Instala librerías en milisegundos gracias a su implementación en Rust y un sistema de caché global inteligente.
2. **Unificación de Herramientas:** Reemplaza y supera a:
   - `pip` (instalación de paquetes).
   - `venv` (creación de entornos virtuales).
   - `pip-tools` (gestión de dependencias bloqueadas/lockfiles).
   - `pyenv` (gestión de versiones de Python).
3. **Gestión de Versiones de Python:** `uv` puede descargar e instalar versiones específicas de Python automáticamente sin depender del gestor de paquetes de tu distro Linux.
4. **Determinismo (Lockfiles):** Genera automáticamente un archivo de bloqueo (similar a `package-lock.json` en Node.js), garantizando que tu entorno sea idéntico en cualquier máquina.
5. **Ejecución Efímera:** Con `uv run`, puedes ejecutar scripts que requieren librerías específicas sin necesidad de crear y activar manualmente un entorno virtual; `uv` lo gestiona en segundo plano.

### Comparativa Rápida

| Característica | Stack Tradicional | Stack Moderno (uv) |
| :--- | :--- | :--- |
| **Instalación** | `pip install` | `uv pip install` o `uv add` |
| **Entornos** | `python -m venv .venv` | `uv venv` |
| **Velocidad** | Lenta (basada en red/disco) | Instantánea (basada en hardlinks/copy-on-write) |
| **Dependencias** | `requirements.txt` | `pyproject.toml` + `uv.lock` |

- **Utilización en mis proyectos de videos y/o traducción:** Al usar uv, me aseguro de que librerías pesadas como faster-whisper (que tiene dependencias de GPU/Cuda complejas) se instalen de forma correcta y aislada, evitando romper el Python del sistema Linux Desktop.