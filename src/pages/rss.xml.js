// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context) {
  // Obtenemos todos los documentos de la colección 'docs'
  const docs = await getCollection('docs');
  // Filtramos para incluir solo las notas técnicas (Tech Notes)
  // y las ordenamos por fecha (asumiendo que añadimos el campo 'date' en el frontmatter)
  const techNotes = docs
    .filter((post) => post.id.includes('/notes/')) // Solo lo que esté en carpetas /notes/
    .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0));
  return rss({
    title: 'DZ | Tech Notes RSS',
    description: 'Procedimientos operativos, SOPs y notas de infraestructura SysAdmin/DevOps.',
    site: context.site,
    items: techNotes.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date || new Date(),
      description: post.data.description,
      // Generamos el link basado en el ID de Starlight
      link: `/${post.id}/`,
    })),
    customData: `<language>es-es</language>`,
  });
}
