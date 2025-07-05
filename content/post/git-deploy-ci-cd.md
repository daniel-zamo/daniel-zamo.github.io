+++
author = "Daniel O. Zamo"
title = "Automatización con Git"
date = "2025-07-05"
description = "Automatización de despliegues con Git (CI/CD)"
tags = [
    "markdown",
    "git",
]
categories = [
    "sitios estáticos",
    "CI/CD",
    "Gitlab Page",
]
series = ["CI/CD"]
image = "/images/devops-001.png"
draft = false
+++

# Automatización de Despliegues con Git (CI/CD)

La automatización de despliegues con Git <!--more-->es una práctica fundamental en el desarrollo de software moderno conocida como **CI/CD**, que significa **Integración Continua y Despliegue Continuo** (o Entrega Continua).

## ¿Qué es CI/CD?

* **Integración Continua (CI - Continuous Integration):** Es la práctica de fusionar los cambios de código de todos los desarrolladores en una rama principal de forma automática y frecuente. Cada vez que alguien sube (`push`) su código, se ejecutan procesos automáticos (como compilar o pasar tests) para verificar que los nuevos cambios no rompen nada.

* **Despliegue Continuo (CD - Continuous Deployment):** Es el siguiente paso. Si la fase de CI tiene éxito, el código se despliega automáticamente en un entorno (como un servidor de producción). En nuestro caso, "desplegar" significa generar el sitio estático y publicarlo en GitLab Pages.

En resumen, **CI/CD es un flujo de trabajo automático (`pipeline`) que se activa con un `git push` para construir, probar y desplegar tu aplicación.**

## ¿Cómo se llama esta tecnología en cada plataforma?

La funcionalidad de CI/CD es una característica de las **plataformas de alojamiento de repositorios Git** (como GitLab, GitHub, Bitbucket, etc.), no del propio `git`. `git` es solo la herramienta de control de versiones; estas plataformas añaden capas de funcionalidades sobre ella.

| Plataforma | Nombre de la Tecnología | Fichero de Configuración |
| :--- | :--- | :--- |
| **GitLab** | **GitLab CI/CD** | `.gitlab-ci.yml` |
| **GitHub** | **GitHub Actions** | `.github/workflows/*.yml` |
| **Bitbucket**| **Bitbucket Pipelines**| `bitbucket-pipelines.yml`|

* **Tu intuición era correcta:** Lo que para GitHub se llama **GitHub Actions**, para GitLab se llama **GitLab CI/CD**.
*   Ambas son herramientas de CI/CD, pero cada una tiene su propia sintaxis y forma de configurar los flujos de trabajo (`pipelines` en GitLab, `workflows` en GitHub).
* El concepto subyacente es el mismo: defines una serie de pasos (`jobs` o `steps`) en un fichero YAML que se ejecutan en un servidor temporal (`runner`) cuando ocurre un evento en tu repositorio (como un `push`).

## ¿Es una tecnología propia de `git`?

**No, no es de `git`**. `git` es un sistema de control de versiones distribuido. Su única responsabilidad es rastrear los cambios en los ficheros, gestionar ramas, fusiones, etc. Funciona de forma local en tu máquina y no sabe nada sobre servidores, despliegues o automatización.

La magia del CI/CD ocurre en las **plataformas como GitLab y GitHub**, que monitorizan los eventos de `git` (como `push` o `merge request`) y usan esa información para activar sus propios sistemas de automatización.

