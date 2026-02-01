import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';
/**
 * Colección principal de documentación (Starlight)
 * Ubicación: src/content/docs
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/docs' }),
  schema: docsSchema({
    extend: z.object({
      source: z.string().optional(),
      // 'type' ayuda a clasificar el estilo del documento dentro de la sección de estándares
      type: z.enum(['lab', 'theory', 'cheatsheet', 'scenario', 'configuration', 'project']).default('theory'),
    }),
  }),
});
/**
 * Colección de Notas Técnicas (Blog/Bitácora)
 * Ubicación: src/content/tech-notes
 */
const techNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/tech-notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Se añade 'lab' para dar soporte a las notas de estudio (LFCS/Cloudera). Se añade workflow.
    category: z.enum([
      'sop', 'troubleshooting', 
      'howto', 'quickref', 
      'case-study', 'automation', 
      'lab', 'workflow'
    ]).default('sop'),
    systems: z.array(z.string()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    author: z.string().default('Daniel Zamo'),
    draft: z.boolean().default(false),
    lang: z.enum(['es', 'en']).default('es'),
    slug: z.string().optional(),
    /**
     * Extensión para compatibilidad con componentes de navegación de Starlight
     * Permite definir el texto en el menú lateral y los badges de colores.
     */
    sidebar: z.object({
      label: z.string().optional(),
      badge: z.object({
        text: z.string(),
        variant: z.enum(['note', 'tip', 'caution', 'danger', 'success', 'default']).optional(),
      }).optional(),
    }).optional(),
  }),
});

export const collections = { 
  'docs': docs, 
  'tech-notes': techNotes 
};
