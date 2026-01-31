# SOLUCIÓN AL PROBLEMA: 404 en /es/tech-notes/ y /en/tech-notes/

## 🔴 Diagnóstico del Problema

El error que estás viendo:

```
[WARN] [router] A `getStaticPaths()` route pattern was matched, 
but no matching static path was found for requested path `/es/tech-notes/`.
Entry docs → 404 was not found.
```

**Causa raíz:**
Astro/Starlight está buscando una entrada llamada `tech-notes` en la colección `docs`, pero no existe. El problema es que **falta el archivo de página** que debe manejar la ruta `/[lang]/tech-notes/`.

## ✅ SOLUCIÓN (Paso a Paso)

### PASO 1: Verificar y Actualizar content.config.ts

Reemplaza el contenido de `src/content.config.ts` con:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/docs' }),
  schema: docsSchema({
    extend: z.object({
      source: z.string().optional(),
      domain: z.enum([
        'compute', 'storage', 'networking', 'security', 
        'virtualization', 'containers', 'automation', 
        'monitoring', 'cloud'
      ]).optional(),
      type: z.enum([
        'lab', 'theory', 'cheatsheet', 'scenario', 
        'configuration', 'project'
      ]).default('theory'),
    }),
  }),
});

const techNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/tech-notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum([
      'sop', 'troubleshooting', 'howto', 'quickref', 'case-study', 'automation'
    ]).default('sop'),
    systems: z.array(z.enum([
      'linux', 'windows', 'azure', 'aws', 'gcp',
      'kubernetes', 'docker', 'ansible', 'terraform'
    ])).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    author: z.string().default('Daniel Zamo'),
    draft: z.boolean().default(false),
    keywords: z.array(z.string()).optional(),
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

export const collections = { 
  docs,
  'tech-notes': techNotes,
};
```

**¿Qué hemos eliminado?**
- ❌ Colección `questions` (eliminada por completo)
- ❌ Warning sobre directorio no existente

---

### PASO 2: Eliminar Directorio questions

```bash
# Eliminar directorio de questions
rm -rf src/content/questions/
```

---

### PASO 3: Crear Archivo de Página para Tech Notes

**LA CLAVE DEL PROBLEMA:** Necesitas crear el archivo que maneje las rutas `/es/tech-notes/` y `/en/tech-notes/`.

Crea el archivo: `src/pages/[lang]/tech-notes/index.astro`

```bash
# Crear directorio
mkdir -p src/pages/\[lang\]/tech-notes/

# Nota: Los corchetes [ ] son parte del nombre del directorio (dynamic route)
```

Contenido del archivo `src/pages/[lang]/tech-notes/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import StarlightPage from '@astrojs/starlight/components/StarlightPage.astro';

export function getStaticPaths() {
  return [
    { params: { lang: 'es' } },
    { params: { lang: 'en' } }
  ];
}

const { lang } = Astro.params;

const allNotes = await getCollection('tech-notes', ({ data }) => {
  return import.meta.env.PROD ? !data.draft : true;
});

const notes = allNotes
  .filter(note => note.data.lang === lang)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const translations = {
  es: {
    pageTitle: 'Notas Técnicas',
    pageDescription: 'Procedimientos operativos y SOPs',
    publishedOn: 'Publicado el',
    tags: 'Etiquetas',
    noNotes: 'No hay notas publicadas aún.'
  },
  en: {
    pageTitle: 'Technical Notes',
    pageDescription: 'Operational procedures and SOPs',
    publishedOn: 'Published on',
    tags: 'Tags',
    noNotes: 'No published notes yet.'
  }
};

const t = translations[lang] || translations.es;

function formatDate(date, locale) {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
---

<StarlightPage frontmatter={{ title: t.pageTitle, description: t.pageDescription }}>
  <div class="tech-notes-index">
    {notes.length === 0 ? (
      <p>{t.noNotes}</p>
    ) : (
      <div class="notes-grid">
        {notes.map((note) => {
          const formattedDate = formatDate(note.data.date, lang);
          const noteSlug = note.id.replace(/^(es|en)\//, '');
          const noteUrl = `/${lang}/tech-notes/${noteSlug.replace(/\.mdx?$/, '')}`;

          return (
            <article class="note-card">
              <h2><a href={noteUrl}>{note.data.title}</a></h2>
              <time datetime={note.data.date.toISOString()}>
                {t.publishedOn} {formattedDate}
              </time>
              <p>{note.data.description}</p>
              {note.data.tags && note.data.tags.length > 0 && (
                <div class="tags">
                  {note.data.tags.map(tag => <span class="tag">#{tag}</span>)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    )}
  </div>
</StarlightPage>

<style>
  .tech-notes-index { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
  .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
  .note-card { background: var(--sl-color-gray-6); border: 1px solid var(--sl-color-gray-5); border-radius: 8px; padding: 1.5rem; }
  .note-card h2 { margin: 0 0 0.5rem; font-size: 1.5rem; }
  .note-card h2 a { color: var(--sl-color-white); text-decoration: none; }
  .note-card h2 a:hover { color: var(--sl-color-accent); }
  .note-card time { color: var(--sl-color-gray-3); font-size: 0.875rem; }
  .note-card p { color: var(--sl-color-gray-2); margin: 1rem 0; }
  .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; }
  .tag { background: var(--sl-color-gray-5); color: var(--sl-color-accent); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; }
</style>
```

---

### PASO 4: Verificar Estructura de Directorios

Tu estructura debe quedar así:

```
src/
├── content/
│   ├── docs/              ← Documentación (ya existe)
│   │   ├── en/
│   │   └── es/
│   └── tech-notes/        ← Notas técnicas (NUEVO)
│       ├── en/
│       │   ├── sop/
│       │   ├── troubleshooting/
│       │   └── howto/
│       └── es/
│           ├── sop/
│           ├── troubleshooting/
│           └── howto/
├── pages/
│   └── [lang]/            ← Carpeta con corchetes (NUEVO)
│       └── tech-notes/
│           └── index.astro
└── content.config.ts
```

**IMPORTANTE:** El nombre del directorio es literalmente `[lang]` (con corchetes). Esto es una "dynamic route" de Astro.

---

### PASO 5: Crear Notas de Ejemplo (si no existen)

Si no tienes notas aún, crea una de prueba:

`src/content/tech-notes/es/sop/ejemplo.md`:

```markdown
---
title: "Nota de Ejemplo"
description: "Esta es una nota de prueba"
date: 2026-01-31
tags: ['ejemplo', 'test']
category: 'sop'
difficulty: 'beginner'
lang: 'es'
---

## Contenido de Ejemplo

Esta es una nota técnica de prueba.
```

---

### PASO 6: Actualizar astro.config.mjs

Verifica que el enlace en el sidebar use `link` y no `autogenerate`:

```javascript
sidebar: [
  {
    label: 'Tech Notes',
    translations: { es: 'Notas Técnicas' },
    link: '/tech-notes/',  // ← IMPORTANTE: Esto apunta a /[lang]/tech-notes/index.astro
    badge: { text: 'Blog', variant: 'note' }
  },
  // ... resto de secciones
]
```

**NO uses:**
```javascript
// ❌ INCORRECTO
autogenerate: { directory: 'tech-notes' }
```

---

### PASO 7: Limpiar y Reconstruir

```bash
# Limpiar caché
rm -rf .astro/ dist/

# Reiniciar servidor de desarrollo
npm run dev
```

---

## 🧪 Pruebas

Después de aplicar los cambios, verifica:

1. **Visita:** `http://localhost:4321/es/tech-notes/`
   - Debería mostrar el índice de notas en español

2. **Visita:** `http://localhost:4321/en/tech-notes/`
   - Debería mostrar el índice de notas en inglés

3. **Consola del servidor:**
   - No debería haber más warnings de `[router]`
   - No debería haber warnings de `[glob-loader]` sobre `questions/`

---

## 🔍 Si Sigue Sin Funcionar

### Debugging Checklist:

```bash
# 1. Verificar que el directorio [lang] existe
ls -la src/pages/

# Debe mostrar un directorio llamado literalmente: [lang]

# 2. Verificar contenido de tech-notes
find src/content/tech-notes -name "*.md" -o -name "*.mdx"

# Debe listar al menos un archivo

# 3. Verificar colección en content.config.ts
grep -A 5 "tech-notes" src/content.config.ts

# Debe mostrar la definición de la colección

# 4. Probar build completo
npm run build

# Si hay errores, te dirá exactamente qué falta
```

---

## 📋 Resumen de Archivos Críticos

### Archivos que DEBEN existir:

1. ✅ `src/content.config.ts` - Con colección `tech-notes`
2. ✅ `src/pages/[lang]/tech-notes/index.astro` - Página de índice
3. ✅ `src/content/tech-notes/es/` - Al menos una nota
4. ✅ `src/content/tech-notes/en/` - Al menos una nota (o vacío)

### Archivos que NO deben existir:

1. ❌ `src/content/questions/` - Debe estar eliminado
2. ❌ `src/content/docs/es/notes/` - Migrado a tech-notes
3. ❌ `src/content/docs/en/notes/` - Migrado a tech-notes

---

## 🆘 Solución Rápida

Si quieres una solución rápida de emergencia, puedes usar este enfoque alternativo:

### Crear página de índice simple en docs:

`src/content/docs/es/tech-notes.mdx`:

```mdx
---
title: Notas Técnicas
description: Índice de notas técnicas
---

import { getCollection } from 'astro:content';

export const notes = await getCollection('tech-notes', ({ data }) => data.lang === 'es');

{notes.map(note => (
  <div>
    <a href={`/es/tech-notes/${note.id.replace('es/', '')}`}>{note.data.title}</a>
  </div>
))}
```

Pero esta **NO es la solución recomendada** porque mezcla el sistema de blog con la documentación.

---

## 💡 Próximos Pasos

Una vez que funcione:

1. Migrar tus notas existentes desde `docs/notes/` a `tech-notes/`
2. Actualizar el frontmatter de cada nota con los campos requeridos
3. Añadir más estilos al índice si lo deseas
4. Configurar el RSS feed

---

**Autor:** Claude (Anthropic)  
**Fecha:** 31 de enero de 2026  
**Tipo:** Guía de corrección de errores
