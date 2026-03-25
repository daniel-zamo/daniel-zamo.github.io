---
id: favicon-architecture
sidebar_position: 10
title: "Web Asset Architecture: Favicon Strategy"
sidebar_label: "Favicon Architecture"
slug: /kb-management/favicon-architecture
description: "Estándares de implementación para iconos de sitio multi-resolución y optimización de carga en Docusaurus."
---

import Admonition from '@theme/Admonition';

# Estrategia de Favicons Multi-capa

Para alcanzar un rendimiento de élite y compatibilidad total, la arquitectura de `dz.log` no depende de un solo archivo, sino de un ecosistema de activos optimizados.

## 1. Matriz de Formatos y Prioridades

No todos los navegadores consumen el mismo recurso. Implementamos una jerarquía de carga para maximizar la nitidez y minimizar el ancho de banda.

| Recurso | Dimensión | Uso Principal | Formato |
| :--- | :--- | :--- | :--- |
| **Standard Favicon** | 32x32 px | Navegadores modernos (Desktop) | PNG (Optimizado) |
| **Legacy Fallback** | Multi-layer | Marcadores antiguos / Windows | ICO Container |
| **Apple Touch** | 180x180 px | iOS / Pantallas Retina / Navbar | PNG (High DPI) |

## 2. Implementación en `docusaurus.config.ts`

:::tip[Prioridad de Carga]
Utilizamos `headTags` para forzar al navegador a preferir el archivo PNG optimizado sobre el archivo ICO, reduciendo el peso de la carga inicial.
:::

```typescript
const config: Config = {
  // Fallback universal para buscadores
  favicon: 'img/favicon.ico', 

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    },
  ],
  // ...
};
```

## 3. Workflow de Optimización (CLI)

Para asegurar que estos archivos cumplan con los estándares de peso, aplicamos compresión *lossless* tras la generación:

```bash
# Optimización de activos individuales
optipng -o7 static/img/favicon-32x32.png
optipng -o7 static/img/apple-touch-icon.png
```

---

<details>
<summary>¿Por qué evitar el uso exclusivo de .ico?</summary>
<div>

El formato `.ico` es un contenedor. Un archivo que incluya capas de 16, 32 y 48 píxeles puede pesar hasta 10 veces más que un PNG de 32x32 bien optimizado. Al declarar explícitamente el PNG en las cabeceras, mejoramos el **Largest Contentful Paint (LCP)**.

</div>
</details>
