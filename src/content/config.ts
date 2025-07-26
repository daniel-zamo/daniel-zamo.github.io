// RUTA: src/content/config.ts

// Importaciones originales de Starlight
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Importaciones necesarias para nuestra colección de preguntas
import { defineCollection, z } from 'astro:content';

// 1. Tu colección 'docs' original de Starlight (sin cambios)
const docsCollection = defineCollection({ 
  loader: docsLoader(), 
  schema: docsSchema() 
});

// 2. Nuestra colección 'questions' (versión 100% en inglés)
const questionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    exam: z.string(),
    topic: z.string(), // Simplificado de 'topic_en' a 'topic'
    difficulty: z.enum(['easy', 'medium', 'hard']),
    question: z.object({
      scenario: z.string().optional(), // Simplificado
      prompt: z.string(), // Simplificado
    }),
    options: z.array(
      z.object({
        id: z.string(),
        text: z.string(), // Simplificado
      })
    ),
    correctAnswerId: z.string(),
    explanation: z.object({ // Simplificado
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

// 3. Exportamos AMBAS colecciones
export const collections = {
	docs: docsCollection,
  	questions: questionsCollection,
};
