# dz.log | Knowledge Engineering Hub 🚀

[![Deploy to GitHub Pages](https://github.com/daniel-zamo/daniel-zamo.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/daniel-zamo/daniel-zamo.github.io/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docusaurus](https://img.shields.io/badge/Docusaurus-v3.9.2-blue?logo=docusaurus)](https://docusaurus.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![CKA Ready](https://img.shields.io/badge/Kubernetes-CKA--Ready-326CE5?logo=kubernetes)](https://kubernetes.io/)

> **Documentación Técnica de Grado Industrial**: Estándares de Configuración, Procedimientos Operativos (SOP) y Estrategias de Platform Engineering.

Este repositorio contiene el código fuente y los activos de conocimiento de **dz.log**, una base de conocimientos técnica construida con **Docusaurus v3** y desplegada automáticamente en GitHub Pages. El sitio está diseñado bajo una arquitectura de "Single Source of Truth" (SSOT), integrando scripts operativos directamente en la documentación.

---

## 🏛️ Estructura del Conocimiento

El sitio organiza el conocimiento técnico en cuatro pilares fundamentales, visibles a través de una interfaz inspirada en *ToolJet*:

*   **Platform Engineering**: Foco en la certificación **CKA**, hardening de clústeres Kubernetes y automatización de infraestructura.
*   **Data Engineering**: Administración avanzada de **Cloudera Data Platform (CDP)**, gobernanza de HDFS y tuning de servicios.
*   **SysAdmin & Linux**: Estándares de configuración de estaciones de trabajo (Debian/Ubuntu), gestión de dotfiles y runtimes.
*   **Engineering Standards**: Protocolos de IA, semántica de Git (Conventional Commits) y taxonomía de documentación.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **SSG** | [Docusaurus v3](https://docusaurus.io/) | Motor de sitio estático optimizado para docs. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utilidades CSS para componentes UI personalizados. |
| **Icons** | [Lucide React](https://lucide.dev/) | Set de iconos vectoriales para navegación visual. |
| **Diagrams** | [Mermaid.js](https://mermaid.js.org/) | Generación de diagramas de secuencia y flujos vía código. |
| **Search** | [Local Search](https://github.com/cmfcmf/docusaurus-search-local) | Indexación offline para búsqueda instantánea. |
| **Automation** | [GitHub Actions](https://github.com/features/actions) | Pipeline de CI/CD para despliegue automatizado. |

---

## 🚀 Guía de Inicio Rápido

Para levantar el entorno de desarrollo localmente y colaborar con el contenido:

### Prerrequisitos
*   **Node.js**: v18.18.2 (Gestionado vía [NVM](./docs/sysadmin-linux/runtimes/node-runtime-setup.mdx))
*   **NPM**: v9.8.1

### Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/daniel-zamo/daniel-zamo.github.io.git
cd daniel-zamo.github.io

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm start
```

El sitio estará disponible en `http://localhost:3000/kb/`.

---

## 📜 Gobernanza y Commits

Este proyecto sigue estrictamente el estándar de **Conventional Commits**. No se aceptan Pull Requests que no cumplan con la semántica:

- `feat(scope):` para nuevos artículos o funcionalidades.
- `docs(scope):` para correcciones en el contenido.
- `fix(scope):` para errores técnicos en el sitio.

Para más detalles, consulte el [Manual de Semántica de Commits](./docs/engineering-standards/version-control/git-conventional-commits.mdx).

---

## ⚖️ Licencia

Este proyecto está bajo la **Licencia MIT**. Siéntete libre de utilizar los estándares y configuraciones aquí descritos siempre que se mantenga la atribución original.

Copyright © 2024-2026 **Daniel Zamo**.

---
*Referencia Técnica: dz.log SOP-01 - Repository Infrastructure*
