// RUTA: src/content/config.ts
import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// 1. Colección 'docs'
// ELIMINADO: loader: docsLoader() -> Esto causaba el error con la imagen
const docsCollection = defineCollection({
  schema: docsSchema({
    extend: z.object({
      // Mapeo de campos personalizados de Obsidian
      source: z.string().optional(),

      // Taxonomía de dominios
      domain: z.enum([
        'compute',
        'storage',
        'networking',
        'security',
        'virtualization',
        'containers',
        'automation',
        'monitoring'
      ]).optional(),

      // Tipo de contenido
      type: z.enum([
        'lab',
        'theory',
        'cheatsheet',
        'scenario',
        'configuration'
      ]).default('theory'),
    }),
  })
});

// 2. Colección 'questions' (Intacta)
const questionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    exam: z.string(),
    topic: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    question: z.object({
      scenario: z.string().optional(),
      prompt: z.string(),
    }),
    options: z.array(
      z.object({
        id: z.string(),
        text: z.string(),
      })
    ),
    correctAnswerId: z.string(),
    explanation: z.object({
      summary: z.string(),
      breakdown: z.array(
        z.object({
          optionId: z.string(),
          reasoning: z.string(),
        })
      ),
    }),
  }),
});

// 3. Exportamos
export const collections = {
  docs: docsCollection,
  questions: questionsCollection,
};