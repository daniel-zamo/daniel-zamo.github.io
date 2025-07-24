// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'http://localhost:4321',
    integrations: [
        starlight({
            title: 'D@cz | IT Notes',
            social: [{ icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/dzamo.gitlab.io' }],
            
            defaultLocale: 'root',
            locales: {
                root: { label: 'English', lang: 'en' },
                es: { label: 'Español', lang: 'es' },
            },
            
            // --- SIDEBAR MANUAL (AHORA SÍ FUNCIONARÁ) ---
            sidebar: [
                // Es buena idea tener un enlace a la página de inicio.
                { label: 'Welcome', link: '/' },
                {
                    label: 'Certifications',
                    collapsed: false, // Lo pongo abierto para que se vea al cargar
                    items: [
                        { label: 'Linux', autogenerate: { directory: 'certifications/linux' } },
                        { label: 'Azure', autogenerate: { directory: 'certifications/azure' } }
                    ]
                },
                {
                    label: 'Articles',
                    collapsed: true,
                    autogenerate: { directory: 'articles' },
                },
            ],
        }),
    ],
});
