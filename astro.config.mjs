// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

export default defineConfig({
    site: 'https://daniel-zamo.github.io',
    redirects: {
        '/': '/es/',
    },

    integrations: [
        // 1. Integración de Mermaid para diagramas (Cargada antes de Starlight)
        mermaid(),
        
        starlight({
            title: 'DZ | SysAdmin & DevOps',
            favicon: '/favicon.png',
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/daniel-zamo/daniel-zamo.github.io' },
                { icon: 'linkedin', label: 'Linkedin', href: 'https://www.linkedin.com/in/danielzamo/' }
            ],

            customCss: ['./src/styles/custom.css'],

            defaultLocale: 'es',
            locales: {
                en: { label: 'English', lang: 'en' },
                es: { label: 'Español', lang: 'es' }
            },

            // Script persistente para forzar el tema oscuro y Metadatos de RSS
            head: [
                // Autodetección de RSS para navegadores
                {
                    tag: 'link',
                    attrs: {
                        rel: 'alternate',
                        type: 'application/rss+xml',
                        title: 'DZ | Tech Notes RSS Feed',
                        href: '/rss.xml',
                    },
                },
                {
                    tag: 'script',
                    content: `
                        const storedTheme = localStorage.getItem('starlight-theme');
                        if (!storedTheme) {
                            document.documentElement.setAttribute('data-theme', 'dark');
                            localStorage.setItem('starlight-theme', 'dark');
                        }
                    `,
                },
            ],

            sidebar: [
                // --- SECCIÓN: NOTAS TÉCNICAS (NATIVA Y ESTABLE) ---
                {
                    label: 'Tech Notes',
                    translations: { es: 'Notas Técnicas' },
                    autogenerate: { directory: 'notes' },
                    collapsed: true,
                },

                // --- SECCIÓN: OPERACIONES CLOUD AZURE ---
                {
                    label: 'Azure Cloud Ops.', 
                    translations: { es: 'Operaciones Cloud Azure' },
                    items: [
                        { 
                            label: 'Introduction', 
                            link: 'az-cloud-ops/', 
                            translations: { es: 'Introducción' } 
                        },
                        { 
                            label: 'Compute', 
                            translations: { es: 'Cómputo' }, 
                            autogenerate: { directory: 'az-cloud-ops/compute' }, 
                            collapsed: true 
                        },
                        { 
                            label: 'Networking', 
                            translations: { es: 'Redes' }, 
                            autogenerate: { directory: 'az-cloud-ops/networking' }, 
                            collapsed: true 
                        },
                    ],
                },

                // --- SECCIÓN: PROYECTOS (PORTFOLIO) ---
                {
                    label: 'Projects',
                    translations: { es: 'Proyectos' },
                    items: [
                         { label: 'Introduction', link: 'projects/', translations: { es: 'Introducción' } },
                         { label: 'Automation', translations: { es: 'Automatización' }, autogenerate: { directory: 'projects/automation' }, collapsed: true },
                         { label: 'Middleware', translations: { es: 'Middleware' }, autogenerate: { directory: 'projects/middleware' }, collapsed: true },
                    ]
                }
            ],
        }),
    ],
});