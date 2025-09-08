// astro.config.mjs - Solución simple y escalable con customCss
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://dzamo.gitlab.io',
    integrations: [
        starlight({
            title: 'D@cz | IT Notes',
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

            sidebar: [
                { label: 'Welcome', link: '/' },
                {
                    label: 'DevOps Tools',
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
                        { label: 'LFCS Labs Set I', autogenerate: { directory: 'lfcs-labs-set-i' } },
                    ]
                },
            ],
        }),
    ],
});