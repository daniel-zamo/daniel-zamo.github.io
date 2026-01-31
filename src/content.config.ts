// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders'; // <-- Importante para Astro 5

// 1. Colección 'docs' (Documentación y Notas)
const docs = defineCollection({
  // En Astro 5 especificamos explícitamente dónde buscar y qué extensiones
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

// 2. Colección 'questions' (Silenciamos el warning definiendo el loader correctamente)
const questions = defineCollection({
  // Si vas a usar JSON o YAML para los quizzes en el futuro
  loader: glob({ pattern: '**/*.{json,yaml}', base: 'src/content/questions' }),
  schema: z.object({
    exam: z.string(),
    topic: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    question: z.object({
      scenario: z.string().optional(),
      prompt: z.string(),
    }),
    options: z.array(z.object({ id: z.string(), text: z.string() })),
    correctAnswerId: z.string(),
    explanation: z.object({
      summary: z.string(),
      breakdown: z.array(z.object({ optionId: z.string(), reasoning: z.string() })),
    }),
  }),
});

// Nota: No incluimos 'i18n' aquí a menos que tengas archivos en src/content/i18n/
// Starlight lo gestiona internamente si no hay overrides.

export const collections = { docs };