// astro.config.mjs - Configuración con sidebar totalmente manual
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

export default defineConfig({
    site: 'https://daniel-zamo.github.io',
    redirects: {
        '/': '/es/',
    },

    integrations: [
        starlight({
            title: 'Daniel Zamo | SysAdmin & DevOps',
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

            head: [
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
                {
                    label: 'Cloud Ops', translations: { es: 'Operaciones Cloud Azure' },
                    items: [
                        { label: 'Introduction', link: 'cloud-ops/', translations: { es: 'Introducción' } },
                        { label: 'Compute', translations: { es: 'Cómputo' }, autogenerate: { directory: 'cloud-ops/compute' }, collapsed: true },
                    ],
                },
            ],

            // --- SIDEBAR CON ESTRUCTURA SIMPLE ---
            // Opción 1: Solo autogenerate (sin control de click al index)
            /*     
            sidebar: [
                {
                    label: 'Home',
                    translations: { es: 'Inicio' },
                    link: '/'
                },
                {
                    label: 'Engineering Projects',
                    translations: { es: 'Proyectos de Ingeniería' },
                    collapsed: true,
                    autogenerate: { directory: 'projects' }
                },
                {
                    label: 'Azure Cloud Operations',
                    translations: { es: 'Operaciones Cloud Azure' },
                    collapsed: true,
                    autogenerate: { directory: 'cloud-ops' }
                },
                {
                    label: 'Linux Systems Engineering',
                    translations: { es: 'Ingeniería de Sistemas Linux' },
                    collapsed: true,
                    autogenerate: { directory: 'linux-ops' }
                },
            ],
            */

            // --- ALTERNATIVA: SIDEBAR COMPLETAMENTE MANUAL ---
            // Descomenta esto y comenta el sidebar de arriba si quieres control total
            /*
            sidebar: [
                {
                    label: 'Home',
                    translations: { es: 'Inicio' },
                    link: '/'
                },
                {
                    label: 'Engineering Projects',
                    translations: { es: 'Proyectos de Ingeniería' },
                    collapsed: true,
                    items: [
                        { 
                            label: 'Overview', 
                            translations: { es: 'Visión General' },
                            link: '/es/projects/' 
                        },
                        {
                            label: 'Automation & AI-Ops',
                            translations: { es: 'Automatización y AI-Ops' },
                            collapsed: true,
                            items: [
                                { slug: 'projects/automation/index' },
                                { slug: 'projects/automation/ia-processor-az104' },
                                // Agrega aquí manualmente cada archivo
                            ]
                        },
                        {
                            label: 'Middleware Solutions',
                            translations: { es: 'Soluciones Middleware' },
                            collapsed: true,
                            items: [
                                { slug: 'projects/middleware/index' },
                                // Agrega aquí manualmente cada archivo
                            ]
                        }
                    ]
                },
                {
                    label: 'Azure Cloud Operations',
                    translations: { es: 'Operaciones Cloud Azure' },
                    collapsed: true,
                    items: [
                        { 
                            label: 'Overview', 
                            translations: { es: 'Visión General' },
                            slug: 'cloud-ops/index' 
                        },
                        { slug: 'cloud-ops/compute/vision-general' },
                        // Agrega aquí manualmente cada archivo
                    ]
                },
                {
                    label: 'Linux Systems Engineering',
                    translations: { es: 'Ingeniería de Sistemas Linux' },
                    collapsed: true,
                    items: [
                        { 
                            label: 'Overview', 
                            translations: { es: 'Visión General' },
                            slug: 'linux-ops/index' 
                        },
                        { slug: 'linux-ops/vision-general' },
                        { slug: 'linux-ops/scenarios/escenarios-practicos' },
                        // Agrega aquí manualmente cada archivo
                    ]
                },
            ],
            */
        }),
        mermaid(),
    ],
});
