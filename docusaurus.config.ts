import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Copyright (c) 2017-present, HPCDE lab.
 * 
 */

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// See https://docusaurus.io/ for all the possible site configuration options.
const admins = [
  {
    caption: 'Wang An',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: 'https://git.hpcer.dev/uploads/-/system/user/avatar/10/avatar.png',
    infoLink: 'https://git.hpcer.dev/one',
    pinned: true,
  },
  {
    caption: 'Genshen Chu',
    image: 'https://secure.gravatar.com/avatar/15520bc606e6177300abacab337a5dc6?s=72&d=identicon',
    infoLink: 'https://github.com/genshen',
    pinned: true,
  },
];

const defaultGitRepo = 'https://git.hpcer.dev/HPCDoc/clusters'
const docGitRepo = process.env.DOC_GIT_REPO ? process.env.DOC_GIT_REPO : defaultGitRepo
// for document edit url, fallback is the same for github and gitlab.
const docEditUrl = process.env.DOC_EDIT_URL ? process.env.DOC_EDIT_URL : docGitRepo + '/blob/master/'
// note: if set process.env.DEPLOY_PATH, it must start and end with '/'.
const siteBaseUrl = process.env.NODE_ENV === 'production' ? (process.env.DEPLOY_PATH ? process.env.DEPLOY_PATH : '/clusters/') : '/'

// config algolia search
const algoliaConfig = process.env.USE_ALGOLIA_SEARCH ? {
  appId: "BH4D9OD16A",
  apiKey: '0aad5efb2b743c35baf62e3f733d4823',
  indexName: 'cluster',
  // contextualSearch: true
  searchParameters: { 'facetFilters': ['type:content'] }
} : null

const localSearchConfig = process.env.USE_LOCAL_SEARCH ? [
  require.resolve("@easyops-cn/docusaurus-search-local"),
  {
    // ... Your options.
    // `hashed` is recommended as long-term-cache of index file is possible.
    hashed: true,
    // For Docs using Chinese, The `language` is recommended to set to:
    // ```
    language: ["en", "zh"],
    // ```
    // When applying `zh` in language, please install `nodejieba` in your project.
  },
] : null

const extraUrl = {
  git: 'https://git.hpcer.dev',
  hub: 'https://hub.hpcer.dev',
  status: 'http://status.hpc.hpcer.dev/zabbix/',
  hpcde: 'https://hpcde.github.io',
}

const config: Config = {
  title: 'HPCer Clusters Document',
  tagline: '高性能计算与数据工程实验室集群系统用户手册',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://hpcdoc.pages.hpcer.dev',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: siteBaseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'HPCDE lab', // Usually your GitHub org/user name.
  projectName: 'cluster-doc', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: { extraUrl: extraUrl },
  scripts: [
    {
      src: "https://buttons.github.io/buttons.js",
      async: true,
      defer: true,
    }
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: docEditUrl,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: docEditUrl,
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'HPCer Clusters Document',
      logo: {
        alt: 'HPCer Clusters Document Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'users/getting-started',
          position: 'left',
          label: 'User Manual',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: docGitRepo,
          label: 'Source on Git',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'User Manual',
              to: '/docs/users/getting-started',
            },
              // {
              //   label: 'Admin Manual',
              //   to: 'docs/doc2',
              // },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'HPCer Git',
              href: extraUrl.git,
            },
            {
              label: 'HPCer Hub',
              href: extraUrl.hub,
            },
            {
              label: "Cluster Status",
              href: extraUrl.status,
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Doc Source on Git',
              href: docGitRepo,
            },
            {
              label: 'HPCDE lab',
              href: extraUrl.hpcde,
            },
            {
              label: 'Help',
              to: 'help',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} HPCDE lab. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
