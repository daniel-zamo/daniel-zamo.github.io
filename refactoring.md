```

---

### 3. Ajuste en `astro.config.mjs` (Sidebar)
Para que el menú lateral funcione correctamente con la redirección de idioma automática:

```javascript
// astro.config.mjs
sidebar: [
    {
        label: 'Tech Notes',
        translations: { es: 'Notas Técnicas' },
        // IMPORTANTE: Deja que Starlight maneje el prefijo de idioma si usas link relativo o base
        link: 'tech-notes/', 
        badge: { text: 'Blog', variant: 'note' }
    },
    // ... resto
]
```

---

### 4. Ajuste en el Layout de Notas (`TechNoteLayout.astro`)
Asegúrate de que el layout sea un "wrapper" limpio, ya que `StarlightPage` ya proporciona el encabezado, footer y sidebar del sitio.

```astro
---
// src/layouts/TechNoteLayout.astro
const { entry } = Astro.props;
---
<article class="prose">
  <slot />
  
  <footer class="note-footer">
    <hr />
    <div class="metadata">
        <p><strong>Autor:</strong> {entry.data.author}</p>
        <p><strong>Dificultad:</strong> {entry.data.difficulty}</p>
        {entry.data.systems && (
            <p><strong>Sistemas:</strong> {entry.data.systems.join(', ')}</p>
        )}
    </div>
  </footer>
</article>

<style>
  .note-footer { margin-top: 3rem; font-size: 0.9rem; color: var(--sl-color-gray-3); }
  .prose { max-width: 100%; }
</style>
```

---

### Resumen de cambios realizados:

1.  **Nueva Página Dinámica:** Se creó `src/pages/[lang]/tech-notes/[...slug].astro`. Esta es la "pieza del puzzle" que faltaba para que Astro generara las páginas de los artículos y resolva el 404.
2.  **Lógica de URLs:** Se estandarizó el formato a `/[lang]/tech-notes/sub-categoria/nombre-archivo`.
3.  **Uso de `render()`:** Se migró al nuevo motor de renderizado de Astro 5 para la colección `tech-notes`, asegurando que los componentes MDX y Mermaid funcionen perfectamente.
4.  **Limpieza de Índice:** Se recomienda borrar `src/pages/tech-notes/index.astro` para evitar que la ruta `/tech-notes/` (sin idioma) intente renderizar algo fuera del sistema de `locales` de Starlight.

**Siguiente paso:** Ejecuta `npm run dev` y navega a `/es/tech-notes/`. Los enlaces ahora deberían llevarte a las notas correspondientes sin errores.