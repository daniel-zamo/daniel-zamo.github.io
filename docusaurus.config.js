// docusaurus.config.js
const devServerPlugin = require("./src/plugins/devServer/index.js");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "dz.log",
  tagline: "Documentación técnica y notas de IT",
  url: "https://daniel-zamo.github.io",
  baseUrl: "/kb/", 
  organizationName: "daniel-zamo",
  projectName: "daniel-zamo.github.io",
  trailingSlash: true, 
  i18n: { defaultLocale: "es", locales: ["es"] },
  onBrokenLinks: "throw", 

  // Configuración de Markdown (Docusaurus 3.10)
  markdown: {
    format: "detect", // Detecta .md vs .mdx
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],
  favicon: 'img/favicon.ico',
  future: { v4: true },

  themeConfig: {
    colorMode: { defaultMode: "dark", respectPrefersColorScheme: false, disableSwitch: false },
    announcementBar: {
      id: "announcement_it_v3",
      content: "🚀 Bienvenido a dz.log | Knowledge Engineering Hub",
      backgroundColor: "#4368E3",
      textColor: "#ffffff",
      isCloseable: true,
    },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
    navbar: {
      title: "dz.log", 
      logo: {
        href: "/", 
        alt: "dz.log Logo",
        src: "img/docs_logo.svg",
        srcDark: "img/docs_logo_dark.svg",
        width: 120,
      },
      items: [
        { type: "search", position: "right" },
        {
          href: "https://github.com/daniel-zamo/daniel-zamo.github.io",
          label: "GitHub",
          position: "right",
          className: "header-github-link",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Daniel Zamo. Construido con Docusaurus.`,
    },
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/", 
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          // highlight-start
          // En Docusaurus 3.10, Admonitions se activa aquí:
          admonitions: true, 
          // highlight-end
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  plugins: [
    devServerPlugin,
    "plugin-image-zoom",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      ({
        hashed: true,
        language: ["es"],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],
    function rawLoaderPlugin(context, options) {
      return {
        name: 'raw-loader-plugin',
        configureWebpack(config, isServer) {
          return {
            module: {
              rules: [
                { test: /\.(sh|ps1|txt|yml|yaml|cmd|ini|cfg)$/, type: 'asset/source' },
              ],
            },
          };
        },
      };
    },
  ],
};
