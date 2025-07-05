# Artículos Markdown - Fuente del Sitio dzamo.gitlab.io

![Pipeline Status](https://gitlab.com/dzamo/dzamo.gitlab.io/badges/main/pipeline.svg)

Este repositorio contiene todo el código fuente de mi sitio personal/blog, **[dzamo.gitlab.io](https://dzamo.gitlab.io)**. El sitio está construido con el generador de sitios estáticos [Hugo](https://gohugo.io/) y el tema [Stack](https://github.com/CaiJimmy/hugo-theme-stack).

El contenido se escribe en formato Markdown y se despliega automáticamente en GitLab Pages a través de un pipeline de CI/CD.

## Objetivo del Repositorio

El propósito principal de este repositorio es servir como la **única fuente de verdad** para todo el contenido y la configuración de mi sitio web. Almacena:

*   Artículos y páginas en formato Markdown.
*   La configuración de Hugo (`hugo.yaml`).
*   Personalizaciones del tema (widgets, shortcodes, etc.).
*   La configuración de despliegue automático (`.gitlab-ci.yml`).

## Requisitos para Desarrollo Local

Para ejecutar el sitio en un entorno de desarrollo local, necesitas tener instalado lo siguiente:

1.  **Git:** Para clonar el repositorio.
2.  **Hugo (versión Extended):** Es fundamental que sea la versión "extended" para que el tema, que usa SASS/SCSS, funcione correctamente. Puedes verificar tu versión con `hugo version`.

## Cómo Empezar (Desarrollo Local)

1.  **Clonar el repositorio:**
    ```bash
    git clone git@gitlab.com:dzamo/dzamo.gitlab.io.git
    cd dzamo.gitlab.io
    ```

2.  **Iniciar el servidor de desarrollo de Hugo:**
    Este comando iniciará un servidor web local, generalmente en `http://localhost:1313/`. El sitio se reconstruirá automáticamente cada vez que guardes un cambio en un fichero.
    ```bash
    hugo server -D
    ```
    *   La opción `-D` (o `--buildDrafts`) es útil para visualizar los borradores (`draft: true`) mientras trabajas en ellos.

## Proceso de Despliegue

El despliegue en producción es **totalmente automático** gracias a **GitLab CI/CD**.

El flujo de trabajo es el siguiente:
1.  Se realizan cambios en el código fuente (por ejemplo, se escribe un nuevo artículo).
2.  Los cambios se suben (`push`) a la rama `main` de este repositorio.
3.  GitLab detecta el `push` y activa automáticamente un pipeline definido en el fichero `.gitlab-ci.yml`.
4.  El pipeline ejecuta un trabajo que:
    *   Utiliza una imagen de Docker con Hugo preinstalado.
    *   Construye el sitio estático en una carpeta `public`.
    *   Publica el contenido de esa carpeta en GitLab Pages.

No se requiere ninguna intervención manual para publicar el sitio.

---
