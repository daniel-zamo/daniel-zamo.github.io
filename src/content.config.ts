import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

// 1. Colección 'docs' (Tu documentación principal)
const docsCollection = defineCollection({
  schema: docsSchema({
    extend: z.object({
      // Mapeo de campos personalizados
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

      // Tipo de contenido (Añadido 'project' para tu portfolio)
      type: z.enum([
        'lab',
        'theory',
        'cheatsheet',
        'scenario',
        'configuration',
        'project'
      ]).default('theory'),
    }),
  })
});

// 2. Colección 'questions' (Para futuros quizzes)
const questionsCollection = defineCollection({
  loader: async () => [], // Placeholder: Astro 5 pide un loader si no hay archivos físicos aun
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
  // Si aún no tienes archivos .json/.yaml en src/content/questions, 
  // puedes comentar la siguiente línea para evitar warnings de "colección vacía"
  questions: questionsCollection, 
};

