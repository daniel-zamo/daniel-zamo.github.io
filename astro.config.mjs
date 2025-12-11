// astro.config.mjs - Configuración con soporte inglés/español
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

            // ... (Sección head se mantiene igual) ...
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
                // ... (resto de metas) ...
            ],

            // --- ACTUALIZACIÓN DEL SIDEBAR ---
            sidebar: [
                {
                    label: 'Home',
                    translations: { es: 'Inicio' },
                    link: '/'
                },
                {
                    label: 'Engineering Projects',
                    translations: { es: 'Proyectos de Ingeniería' },
                    collapsed: false,
                    autogenerate: { directory: 'projects' }
                },
                {
                    label: 'Azure Cloud Operations', // <--- NUEVA SECCIÓN
                    translations: { es: 'Operaciones Cloud Azure' },
                    collapsed: true, // Colapsado para no saturar
                    autogenerate: { directory: 'cloud-ops' }
                },
                {
                    label: 'Linux Systems Engineering',
                    translations: { es: 'Ingeniería de Sistemas Linux' },
                    collapsed: true,
                    autogenerate: { directory: 'linux-ops' }
                },
            ],
        }),
        mermaid(),
    ],
});
