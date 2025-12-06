// astro.config.mjs - Configuración con soporte inglés/español
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid'; // <--- 1. IMPORTAR MOTOR astro-mermaid (1/2 - ver 'integrations')

export default defineConfig({
    site: 'https://dzamo.gitlab.io',

    // Redirección automática de la raíz al idioma por defecto
    redirects: {
        '/': '/es/',
    },

    integrations: [
        starlight({
            //                        title: 'Daniel Zamo | SysAdmin & Cloud Engineering',
            title: 'Daniel Zamo | SysAdmin & DevOps',
            favicon: '/favicon.png',
            social: [
                { icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/dzamo/dzamo.gitlab.io' },
                { icon: 'linkedin', label: 'Linkedin', href: 'https://www.linkedin.com/in/danielzamo/' }
            ],

            customCss: ['./src/styles/custom.css'],

            // Configuración de idiomas
            defaultLocale: 'en', // Inglés como idioma por defecto
            locales: {
                en: {
                    label: 'English',
                    lang: 'en'
                },
                es: {
                    label: 'Español',
                    lang: 'es'
                }
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
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:site_name',
                        content: 'Daniel Zamo | SysAdmin & DevOps',
                        //                        content: 'Daniel Zamo | SysAdmin & Cloud Engineering',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:type',
                        content: 'website',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        name: 'author',
                        content: 'Daniel O. Zamo',
                    },
                },
            ],

            // Sidebar por idioma
            sidebar: [
                {
                    label: 'Home',
                    translations: {
                        es: 'Inicio'
                    },
                    link: '/'
                },
                {
                    label: 'Engineering Projects',
                    translations: {
                        es: 'Proyectos de Ingeniería'
                    },
                    collapsed: false,
                    autogenerate: { directory: 'projects' }
                },
                {
                    label: 'Linux Systems Engineering',
                    translations: {
                        es: 'Ingeniería de Sistemas Linux'
                    },
                    collapsed: true,
                    autogenerate: { directory: 'linux-ops' }
                },
            ],
        }),
        mermaid(), //  <--- 2. AGREGADO AL FINAL DEL ARRAY DE 'integrations' (2/2 - MOTOR astro-mermaid)
    ],
});
