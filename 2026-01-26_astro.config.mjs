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
        starlight({
            title: 'Daniel Zamo | SysAdmin & DevOps',
            // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
            components: {
                Sidebar: './src/components/Sidebar.astro',
            },
            // ---------------------------------
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
                // Hemos quitado el script anterior de aquí porque ahora está en el Override
            ],

            sidebar: [
                {
                    label: 'Azure Cloud Ops.', 
                    translations: { es: 'Operaciones Cloud Azure' },
                    items: [
                        // Este es el link al que el script nos llevará al hacer clic en el padre
                        { label: 'Introduction', link: 'az-cloud-ops/', translations: { es: 'Introducción' } },
                        { label: 'Compute', translations: { es: 'Cómputo' }, autogenerate: { directory: 'az-cloud-ops/compute' }, collapsed: true },
                    ],
                },
            ],
        }),
        mermaid(),
    ],
});
