/**
 * Copyright (c) 2017-present, HPCDE lab.
 * 
 */

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
const docGitRepo = process.env.DOC_GIT_REPO? process.env.DOC_GIT_REPO : defaultGitRepo
// for document edit url, fallback is the same for github and gitlab.
const docEditUrl = process.env.DOC_EDIT_URL? process.env.DOC_EDIT_URL : docGitRepo + '/blob/master/'
// note: if set process.env.DEPLOY_PATH, it must start and end with '/'.
const siteBaseUrl = process.env.NODE_ENV === 'production'? (process.env.DEPLOY_PATH? process.env.DEPLOY_PATH : '/clusters/') : '/'

const extraUrl = {
  git: 'https://git.hpcer.dev',
  hub: 'https://hub.hpcer.dev',
  status: 'http://status.hpc.hpcer.dev/zabbix/',
  hpcde: 'https://hpcde.github.io',
}

module.exports = {
  title: 'HPCer Clusters Document',
  tagline: '高性能计算与数据工程实验室集群系统用户手册',
  url: 'https://hpcdoc.pages.hpcer.dev/cluster',
  baseUrl: siteBaseUrl,
  onBrokenLinks: 'log',
  favicon: 'img/favicon.ico',
  organizationName: 'HPCDE lab', // Usually your GitHub org/user name.
  projectName: 'cluster-doc', // Usually your repo name.
  customFields: {extraUrl: extraUrl},
  themeConfig: {
    navbar: {
      title: 'HPCer Clusters Document',
      logo: {
        alt: 'HPCer Clusters Document Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: 'docs/users/getting-started', label: 'User Manual', position: 'left'},
        {to: 'blog', label: 'Blog', position: 'left'},
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
              to: 'docs/users/getting-started',
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
              to: 'blog',
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
      logo: {
        alt: 'HPCer cluster',
        src: `img/oss_logo.svg`,
        href: 'https://hpcde.github.io/',
      },
      copyright: `Copyright © ${new Date().getFullYear()} HPCDE lab. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'getting-started',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: docEditUrl,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
