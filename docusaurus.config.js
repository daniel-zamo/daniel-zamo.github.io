const devServerPlugin = require("./src/plugins/devServer/index.js");

const isProd = process.env.NODE_ENV === "production";

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "dz.log",
  tagline: "Documentación técnica y notas de IT",

  url: "https://daniel-zamo.github.io",
  baseUrl: "/kb/", 
  organizationName: "daniel-zamo",
  projectName: "daniel-zamo.github.io",
  trailingSlash: true, 

  i18n: {
    defaultLocale: "es",
    locales: ["es"],
  },

  onBrokenLinks: "throw", 

  themes: [ '@docusaurus/theme-mermaid' ],
  markdown: {
    format: "detect",
    mermaid: true,
  },

  favicon: 'img/favicon.ico',
  future: { v4: true },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    },
  ],

  themeConfig: {
    announcementBar: {
      id: "announcement_it_v3",
      content: "🚀 Bienvenido a mi nueva Base de Conocimientos sobre IT",
      backgroundColor: "#4368E3",
      textColor: "#ffffff",
      isCloseable: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
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
        language: ["en", "es"],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }),
    ],

    // --- PLUGIN PARA IMPORTAR ARCHIVOS EXTERNOS COMO TEXTO ---
    function rawLoaderPlugin(context, options) {
      return {
        name: 'raw-loader-plugin',
        configureWebpack(config, isServer) {
          return {
            module: {
              rules: [
                {
                  // Detecta archivos de script, texto o configuración
                  test: /\.(sh|ps1|txt|yml|yaml|cmd)$/,
                  // Webpack 5 Asset Modules: importa el contenido como string
                  type: 'asset/source',
                },
              ],
            },
          };
        },
      };
    },
  ],
};
