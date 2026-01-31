// astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";

export default defineConfig({
  site: "https://daniel-zamo.github.io",
  redirects: {
    "/": "/es/",
  },

  integrations: [
    mermaid(),

    starlight({
      title: "dz.log",
      favicon: "/favicon.png",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/daniel-zamo/daniel-zamo.github.io",
        },
        {
          icon: "linkedin",
          label: "Linkedin",
          href: "https://www.linkedin.com/in/danielzamo/",
        },
      ],

      customCss: ["./src/styles/custom.css"],

      defaultLocale: "es",
      locales: {
        en: { label: "English", lang: "en" },
        es: { label: "Español", lang: "es" },
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "alternate",
            type: "application/rss+xml",
            title: "DZ | Tech Notes RSS Feed",
            href: "/rss.xml",
          },
        },
        {
          tag: "script",
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
          label: "Engineering Standards",
          translations: { es: "Estándares de Ingeniería" },
          autogenerate: { directory: "standards/" },
          badge: { text: "Core", variant: "success" },
        },
        {
          label: "Tech Notes",
          translations: { es: "Notas Técnicas" },
          link: "tech-notes/",
          badge: { text: "Blog", variant: "note" },
        },
        {
          label: "Azure Cloud Ops.",
          translations: { es: "Operaciones Cloud Azure" },
          items: [
            {
              label: "Introduction",
              link: "az-cloud-ops/",
              translations: { es: "Introducción" },
            },
            {
              label: "Compute",
              translations: { es: "Cómputo" },
              autogenerate: { directory: "az-cloud-ops/compute" },
              collapsed: true,
            },
            {
              label: "Networking",
              translations: { es: "Redes" },
              autogenerate: { directory: "az-cloud-ops/networking" },
              collapsed: true,
            },
          ],
        },

        {
          label: "Projects",
          translations: { es: "Proyectos" },
          items: [
            {
              label: "Introduction",
              link: "projects/",
              translations: { es: "Introducción" },
            },
            {
              label: "Automation",
              translations: { es: "Automatización" },
              autogenerate: { directory: "projects/automation" },
              collapsed: true,
            },
            {
              label: "Middleware",
              translations: { es: "Middleware" },
              autogenerate: { directory: "projects/middleware" },
              collapsed: true,
            },
          ],
        },
      ],
    }),
  ],
});
