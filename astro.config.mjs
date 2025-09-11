// astro.config.mjs - Solución simple y escalable con customCss + Open Graph
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://dzamo.gitlab.io',
    integrations: [
        starlight({
            title: 'D@cz | IT Notes',
            favicon: '/favicon.ico',
            social: [{ icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/dzamo/dzamo.gitlab.io' }],

            // CSS personalizado para modo claro por defecto
            customCss: [
                './src/styles/custom.css'
            ],

            defaultLocale: 'root',
            locales: {
                root: { label: 'English', lang: 'en' },
                es: { label: 'Español', lang: 'es' },
            },

            // Meta tags globales para Open Graph y Twitter Cards
            head: [
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:site_name',
                        content: 'D@cz | IT Notes',
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
                {
                    tag: 'meta',
                    attrs: {
                        name: 'twitter:site',
                        content: '@tu_usuario_twitter', // Cambia por tu usuario de Twitter si lo tienes
                    },
                },

    {
        tag: 'meta',
        attrs: {
            name: 'author',
            content: 'Daniel Oscar Zamo',
        },
    },
    {
        tag: 'meta',
        attrs: {
            property: 'article:author',
            content: 'Daniel Oscar Zamo',
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
                { label: 'Welcome', link: '/' },
                {
                    label: 'DevOps Tools',
                    collapsed: true,
                    autogenerate: { directory: 'devops' }
                },
                {
                    label: 'Virtualization',
                    collapsed: true,
                    items: [
                        { label: 'Overview', link: '/virtualization/' },
                        { label: 'KVM Post-Clone Setup', link: '/virtualization/kvm-vm-clone-post-config' }
                    ]
                },
                { label: 'CLI Linux', collapsed: true, autogenerate: { directory: 'linux-cli' } },
                {
                    label: 'Certifications',
                    collapsed: true,
                    items: [
                        /* { label: 'Linux', autogenerate: { directory: 'certifications/linux' } },*/
                        /*{
                            label: 'Azure',
                            items: [
                                { label: 'Azure Certifications', link: '/certifications/azure/' },
                                { label: 'AI-900: Azure AI Fundamentals', link: '/certifications/azure/ai-900' },
                                { label: 'Practice AI-900', link: '/practice/' }
                            ]
                        },*/
                        /*{ label: 'ai', autogenerate: { directory: '/ai/'} },*/
                        
                        // Corregir el directorio para que coincida con la estructura
                        { label: 'LFCS Labs Set I', collapsed: true, autogenerate: { directory: 'lfcs-labs' } },
                    ]
                }, 
            ],
        }),
    ],
});
