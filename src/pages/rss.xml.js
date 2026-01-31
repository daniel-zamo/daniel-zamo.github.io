// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // Obtener todas las notas técnicas (sin borradores en producción)
  const techNotes = await getCollection('tech-notes', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  // Ordenar por fecha descendente
  const sortedNotes = techNotes.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: 'dz.log | Tech Feed',
    description: 'Notas de ingeniería, SOPs y logs de infraestructura.',
    site: context.site,
    
    items: sortedNotes.map((note) => {
      // Detectar idioma del path
      const lang = note.id.startsWith('es/') ? 'es' : 'en';
      const slug = note.id.replace(/^(es|en)\//, '');
      
      return {
        title: note.data.title,
        pubDate: note.data.date,
        description: note.data.description,
        link: `/${lang}/tech-notes/${slug}`,
        categories: [note.data.category, ...note.data.tags],
        author: note.data.author,
      };
    }),
    
    customData: `<language>es-es</language>`,
  });
}
