+++
author = "Daniel O. Zamo"
title = "Instalación de Hugo sobre Debian y/o derivados"
date = "2025-06-11"
#description = "Instalación de Hugo sobre Debian y/o derivados (equivalentes)."
tags = [
    "hugo",
    "go",
    "markdown",
]
categories = [
    "SSG",
    "documentación",
    "sitios estáticos",
]
series = ["Sitios de contenido estático"]
aliases = ["ubuntu-install-hugo"]
image = "/images/go-hugo-featured.png"
draft = false
+++

## Supuestos cumplidos

El sistema con que se realizan estas tareas cumple con los supuestos siguientes. Estos son:

- Sistema operativo: Debian 12 o superior o derivado (Ejemplo Ubuntu 24.04 LTS, Linux Mint 22, etc).
- Utilidad de instalación/gestión de paquetes: `nala` (o similar).
- El usuario que realiza las tareas debe poder escalar a tareas de superusuario del sistema con por ejemplo el comando `sudo`.

## Dependecias/prerequisitos

Aunque depende de cada escenario, los siguiente no son obligatorios en todos los casos, pero si muy recomendados.
Los paquetes/utilidades recomendadas de tener en el sistema son:

_**`Git` es necesario para:**_

- Construir Hugo desde los fuentes (sources).
- Utilizar la función Módulos de Hugo.
- Instalar un tema como un submódulo de Git
- Acceder a la información de confirmación desde un repositorio Git local.
- Alojar el sitio con servicios como CloudCannon , Cloudflare Pages , GitHub Pages , GitLab Pages, Netlify, etc.

_**`Go` es necesario para:**_

- Construir Hugo desde los fuentes (sources).
- Utilizar la función Módulos de Hugo.

_**Se requiere `Dart Sass` para:**_ transpilar _Sass_ a _CSS_ cuando se utilizan las últimas características del lenguaje _Sass_.


### Instalación de git

```bash
sudo nala update
sudo nala install git
git version
```

### Instalación de Go

```bash
# Revisar la versión actual/estable según corresponda
wget https://go.dev/dl/go1.24.4.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.24.4.linux-amd64.tar.gz && rm -fv go1.24.4.linux-amd64.tar.gz
echo -e '\n#\nexport PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc && go version
```

### Instalación de Dart Sass

```bash
# Revisar la versión mas actual y estable al momento de la instalación
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Aceptar/finalizar el asistente, y proceguir con los siguientes comandos (el asistente anterior al finalizar imprime los comandos a ejecutar)
echo >> ~/.bashrc
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.bashrc
#eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
source ~/.bashrc
brew -v
sudo apt-get install build-essential
brew install gcc
```

### Instalación de Hugo

Hay binarios prediseñados disponibles para diversos sistemas operativos y arquitecturas. Visite la [página de la última versión](https://github.com/gohugoio/hugo/releases/). Para escenarios como el de este sistema se recomienda la versión de _**Hugo extended**_ (y sistema Linux amd 64, que es la base que tiene). Estas tareas se realizan a continuación, estas son:

```bash
wget https://github.com/gohugoio/hugo/releases/download/v0.147.9/hugo_extended_0.147.9_linux-amd64.tar.gz
sudo tar -C /usr/local/bin -xzf hugo_extended_0.147.9_linux-amd64.tar.gz && rm -fv hugo_extended_0.147.9_linux-amd64.tar.gz
which hugo
hugo version
```

## Referencias

- [Install Hugo on Linux](https://gohugo.io/installation/linux/) - referencia principal consultada, para instalar Hugo (los pre requisitos y/o dependencias).
- [Dart Sass](https://gohugo.io/functions/css/sass/#dart-sass)
- [Homebrew](https://brew.sh/) - The Missing Package Manager for macOS (or Linux).
- [Go](https://go.dev/doc/install).
- 
