import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/docs' }),
  schema: docsSchema({
    extend: z.object({
      source: z.string().optional(),
      type: z.enum(['lab', 'theory', 'cheatsheet', 'scenario', 'configuration', 'project']).default('theory'),
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
    category: z.enum(['sop', 'troubleshooting', 'howto', 'quickref', 'case-study', 'automation']).default('sop'),
    systems: z.array(z.string()).optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    author: z.string().default('Daniel Zamo'),
    draft: z.boolean().default(false),
    lang: z.enum(['es', 'en']).default('es'),
    // Agregamos un campo slug opcional por si quieres forzar una URL distinta en el futuro
    slug: z.string().optional(), 
  }),
});

export const collections = { docs, 'tech-notes': techNotes };
