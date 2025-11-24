// astro.config.mjs - Solución simple y escalable con customCss + Open Graph
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://dzamo.gitlab.io',
    integrations: [
        starlight({
            title: 'Daniel Zamo | SysAdmin & Cloud Engineering',
            favicon: '/favicon.png',
            social: [{ icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/dzamo/dzamo.gitlab.io' }],

            // CSS personalizado para modo claro por defecto
            customCss: [
                './src/styles/custom.css'
            ],

            defaultLocale: 'root',
            locales: {
                root: { label: 'English', lang: 'en' },
                //                es: { label: 'Español', lang: 'es' },
            },

            // Meta tags globales para Open Graph y Twitter Cards
            head: [
                {
                    tag: 'script',
                    content: `
                        // Comprobar si el usuario ya guardó una preferencia
                        const storedTheme = localStorage.getItem('starlight-theme');
                        
                        // Si NO hay preferencia guardada (es la primera visita), forzamos DARK
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
                        content: 'Daniel Zamo | SysAdmin & Cloud Engineering',
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
                        name: 'twitter:card',
                        content: 'summary_large_image',
                    },
                },
                /*                {
                                    tag: 'meta',
                                    attrs: {
                                        name: 'twitter:site',
                                        content: '@tu_usuario_twitter', // Cambia por tu usuario de Twitter si lo tienes
                                    },
                                },*/

                {
                    tag: 'meta',
                    attrs: {
                        name: 'author',
                        content: 'Daniel O. Zamo',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        property: 'article:author',
                        content: 'Daniel O. Zamo',
                    },
                },
                // Para LinkedIn específicamente
                {
                    tag: 'meta',
                    attrs: {
                        property: 'profile:first_name',
                        content: 'Daniel Oscar',
                    },
                },
                {
                    tag: 'meta',
                    attrs: {
                        property: 'profile:last_name',
                        content: 'Zamo',
                    },
                },

            ],

            sidebar: [
                { label: 'Home', link: '/' },
                { label: 'LFCS Certification', collapsed: false, autogenerate: { directory: 'lfcs' } },
            ],
        }),
    ],
});
