// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

// ============================================
// COLECCIÓN: docs (Documentación Principal)
// ============================================
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

// ============================================
// COLECCIÓN: tech-notes (Notas Técnicas / Blog)
// ============================================
const techNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/tech-notes' }),
  schema: z.object({
    // Metadatos básicos del artículo
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    
    // Clasificación y contexto
    tags: z.array(z.string()).default([]),
    category: z.enum([
      'sop',
      'troubleshooting',
      'howto',
      'quickref',
      'case-study',
      'automation'
    ]).default('sop'),
    
    // Metadatos técnicos
    systems: z.array(z.enum([
      'linux', 'windows', 'azure', 'aws', 'gcp',
      'kubernetes', 'docker', 'ansible', 'terraform'
    ])).optional(),
    
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    
    // Información del autor y estado
    author: z.string().default('Daniel Zamo'),
    draft: z.boolean().default(false),
    
    // SEO y búsqueda
    keywords: z.array(z.string()).optional(),
    
    // Idioma (importante para i18n)
    lang: z.enum(['es', 'en']).default('es'),
  }),
});

// ============================================
// EXPORTACIÓN DE COLECCIONES
// ============================================
export const collections = { 
  docs,
  'tech-notes': techNotes,
};
