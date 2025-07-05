# README.md

## [2025-07-01] Validación nuevo SSG y theme

### SSG Zola

- Sitio generado con SSG [Zola]().
- Themes por evaluar/definir:

  1. [Deepthought](https://www.getzola.org/themes/deepthought/)
  1. [Even](https://www.getzola.org/themes/even/)
  1. [Tabi](https://welpo.github.io/tabi/)

### SSG Hugo (por ver)

- Theme por revisar (bastantes minimalistas, interesantes)

  1. [Stack](https://themes.gohugo.io/themes/hugo-theme-stack/)
  
    - [Theme Stack - documentación](https://stack.jimmycai.com) -> Documentación, aprender cómo instalar, configurar y usar el theme.
    - [Theme Stack - demo](https://demo.stack.jimmycai.com) -> Demostración	Ver y probar cómo se ve y funciona el theme en un sitio real.
  
  1. [Congo](https://themes.gohugo.io/themes/congo/)
  1. [Seven](https://themes.gohugo.io/themes/seven/)
  1. [Papermod](https://themes.gohugo.io/themes/hugo-papermod/)

#### Theme Stack

***¿Qué es Hugo Theme Stack?***

En pocas palabras, Stack es un theme para Hugo enfocado en la simplicidad, el contenido y una fuerte identidad visual basada en "tarjetas" (cards) y una barra lateral (sidebar).

Su nombre, "Stack" (apilar/pila), refleja su diseño: el contenido principal y la barra lateral se sienten como dos "pilas" de información organizadas una al lado de la otra, creando un layout muy estructurado y fácil de navegar.
Concepto y Filosofía de Diseño

Mientras que themes como PaperMod o Congo apuestan por un minimalismo más "tradicional" (una sola columna de texto con pocos elementos visuales), Stack apuesta por un minimalismo estructurado.

- Diseño de Tarjetas: En lugar de una simple lista de títulos de posts, la página de inicio y las páginas de archivo muestran los artículos como tarjetas visuales, a menudo con una imagen de cabecera, título y un breve resumen. Esto lo hace ideal para blogs que tienen un componente visual (proyectos, tutoriales con imágenes, etc.).
- La Barra Lateral como Centro de Navegación: La barra lateral es una parte fundamental del diseño, no un añadido. Contiene el perfil del autor, el menú principal y las taxonomías (tags/categorías). Le da al sitio una sensación de "dashboard" o panel de control personal. Esto es muy similar a la barra lateral izquierda de Chirpy, lo cual podría resultarte familiar.

**Características Clave**

Stack viene cargado de funcionalidades modernas y muy bien implementadas:

- Diseño en Tarjetas: Como ya mencioné, es su seña de identidad visual. Es atractivo y organiza bien la información.
- Barra Lateral Configurable: Puedes ponerla a la izquierda o a la derecha y personalizar completamente lo que aparece en ella.
- Tabla de Contenidos (ToC) Flotante: ¡Sí! Al igual que Chirpy y PaperMod, cuando estás dentro de un post, muestra una ToC en el lado derecho que se desplaza contigo, facilitando la navegación en artículos largos.
- Búsqueda Integrada: Una funcionalidad de búsqueda rápida y eficaz.
- Modo Oscuro/Claro: Un interruptor de tema bien integrado y con transiciones suaves.
- Excelente Manejo de Imágenes: Incluye soporte para "lightbox" (al hacer clic en una imagen, se amplía y oscurece el fondo) y carga perezosa (lazy loading) para un rendimiento óptimo.
- Muy Personalizable: A pesar de tener una identidad visual fuerte, permite configurar colores, fuentes y muchos otros aspectos a través del archivo config.toml de Hugo.
- Estructura de Archivos Simple: Al igual que PaperMod, no te obliga a usar la estructura de directorios por post (Page Bundles). Puedes tener todos tus archivos .md en una sola carpeta (content/posts/) sin ningún problema.

_¿Para quién es este theme?_

Stack es ideal para alguien que:

- Quiere un blog o portafolio con una identidad visual más fuerte que un simple blog de texto.
- Valora tener una barra lateral persistente con su perfil y navegación, muy al estilo de Chirpy.
- Publica contenido que se beneficia de una presentación visual (tarjetas con imágenes).
- Busca todas las funcionalidades modernas (ToC, modo oscuro, búsqueda) en un paquete cohesivo y bien diseñado.

_Stack vs. PaperMod vs. Chirpy_

- Stack vs. PaperMod: PaperMod es más minimalista y se centra en el flujo de texto. Stack es más estructurado y visual. Si PaperMod es un libro elegante, Stack es una revista de diseño moderno.
- Stack vs. Chirpy: Esta es la comparación más interesante para ti. Ambos comparten la filosofía de una barra lateral prominente como ancla de navegación. Si eso es lo que más te gusta de Chirpy, Stack es probablemente el análogo más cercano en Hugo en cuanto a sensación de navegación, aunque la presentación del contenido (tarjetas vs. lista) es diferente.

En resumen, Stack es una opción fantástica en el mundo Hugo. Es la prueba de la madurez y diversidad del ecosistema.

## [2025-01-27] Docusaurus

### Especificación/dependencias cumplidas para despliegue de Docusaurus

- Desktop o CLI de Linux
- nodejs (`node -v`)
- npm (`npm -v`)

#### Instalación del cliente Docusaurus

##### Instalación/actualización de npx

```bash
# Si ya existe ya una version de npx anterior, se recomienda desinstalar
sudo npm uninstall -g npx
# Verificar
which npx
# Si aun existe
sudo rm -f /usr/bin/npx
# Actualizacion de npm
sudo npm install -g npm@latest
# Reinstalar/instalar npx
sudo npm install -g npx
# Verificar versión
npx -v
```

##### Crear proyecto Docusaurus

```bash
npx create-docusaurus@latest site-static classic
cd site-static
```

##### Iniciar servidor de desarrollo

```bash
npm run start
```

Esto debería haber arrancado el servidor en nuestro `http://localhost:3000`.

## [2025-01-02] Desarrollo y publicación sitio estático basado en SSG Hugo, con theme Toha

En [./ssg-hugo-theme-toha](./ssg-hugo-theme-toha) comparto el código fuente del sitio de contenido estático publicado en [dzamo.gitlab.io](https://dzamo.gitlab.io), generado con ***Hugo*** y theme ***Toha***.

### Especificación inicial/supuestos cumplidos

A continuación resumo como descargo y despliego en mi local (sis. op. de distribución Linux basada en Ubuntu 24.04 LTS) para dejar el Desktop Plasma KDE 6.2 como estación de desarrollo del sittio web estático desplegado en GitLab Static Page.

En mi Desktop local doy por supuesto cumplido tener las siguientes dependencias necesarias para el Theme Toha utilizado por Hugo para la generación del sitio estático. Estos son:

- Hugo Version 0.128.0 (extended) or higher
- Go language 1.18 or higher (require for hugo modules)
- Node version v18.x or later and npm 8.x or later.

### Ejecutar el sitio en mi localhost para desarrollo/actualización del sitio dzamo.gitlab.io

#### Generar configuración de dependencia de node

Generar la configuración de dependencia de `node` (esto creará el `package.json` en el repositorio local).

```bash
hugo mod npm pack
```

#### Instalar dependencias

Instalar las dependencias de `node`, ejecutando:

```
npm install
```

Si es necesario actualizar.

```bash
npm audit fix --force
npm fund
```

#### Ejecutar el sitio

Ejecutar el sitio localmente. Ejecutar:

```bash
hugo server -w
```

---


## [2024-01-10]

Repositorio del código fuente del sitio de contenido estático publicado en [dzamo.gitlab.io](https://dzamo.gitlab.io).

## Especificación inicial/supuestos cumplidos

Para la actualización de este sitio web se ha utilizado las siguientes tecnologías. Estas son:

- Sistema operativo: Fedora 40.
- Generador de sitio estático. ???
- Desktop inicial de desarrollo: KDE Plasma 6.2.
- Gestión de versiones: Git.

## Instalación del generador de sitio estático

```bash
sudo dnf -y update --refresh
sudo dnf copr enable onkoe/zola
sudo dnf -y install zola
```

## Referencias consultadas

- [https://copr.fedorainfracloud.org/coprs/onkoe/zola](https://copr.fedorainfracloud.org/coprs/onkoe/zola)
- [Jekyll in sitio developer.fedoraproject.org](https://developer.fedoraproject.org/start/sw/web-app/jekyll.html).
