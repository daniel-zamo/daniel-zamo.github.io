// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'D@cz',
            // Configuración de idioma
            defaultLocale: 'root', // Define el español como idioma por defecto
            locales: {
            root: {
                label: 'Español',
                lang: 'es-ES', // Opcional, para el atributo lang en el HTML
			    },
		    },
			social: [{ icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/dzamo.gitlab.io' }],
			sidebar: [

				{ label: 'Certificaciones',
                    collapsed: true,
					items: [
				    { label: 'Linux', collapsed: true, autogenerate: { directory: 'certifications/linux' } },
					{ label: 'Azure', collapsed: true, autogenerate: { directory: 'certifications/azure' } }
				   ]
			    },
				{
					label: 'Artículos sueltos',
                    collapsed: true,
					autogenerate: { directory: 'articles' },
				},
			],
		}),
	],
});
