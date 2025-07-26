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
            
            sidebar: [
                { label: 'Welcome', link: '/' },
                {
                    label: 'Certifications',
                    collapsed: false,
                    items: [
                        { label: 'Linux', autogenerate: { directory: 'certifications/linux' } },
                        
                        // --- ESTA ES LA SECCIÓN MANUAL Y DEFINITIVA ---
                        { 
                          label: 'Azure', 
                          items: [
                            // Define manualmente los enlaces a tus páginas de Azure existentes
                            { label: 'Azure Certifications', link: '/certifications/azure/' },
                            { label: 'AI-900: Azure AI Fundamentals', link: '/certifications/azure/ai-900' },
                            
                            // Y ahora, añade tu enlace de práctica
                            { label: 'Practice AI-900', link: '/practice/' }
                          ]
                        },
                        // --- FIN DE LA SECCIÓN MANUAL ---
                    ]
                },
            ],
        }),
    ],
});
