/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
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

const siteBaseUrl = process.env.NODE_ENV === 'production'? '/cluster/' : '/'

const extraUrl = {
   git: 'https://git.hpcer.dev',
   hub: 'https://hub.hpcer.dev',
   status: 'http://status.hpc.hpcer.dev/zabbix/',
}

const siteConfig = {
  title: 'HPCer Clusters Document', // Title for your website.
  tagline: '高性能计算与数据工程实验室集群系统用户手册',
  url: 'http://hpcdoc.pages.hpcer.dev/', // Your website URL
  baseUrl: siteBaseUrl, // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'cluster-doc',
  organizationName: 'HPCDE lab',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'getting-started', label: 'Docs'},
    // {doc: 'doc4', label: 'API'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  ],

  // If you have admins set above, you add it here:
  admins,
  extraUrl,

  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },
  editUrl: 'https://git.hpcer.dev/HPCDoc/clusters/blob/master/docs/',

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} HPCDE lab`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'atom-one-dark',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://git.hpcer.dev/HPCDoc/clusters',
};

module.exports = siteConfig;
