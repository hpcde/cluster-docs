/**
 * Copyright (c) 2017-present,  HPCDE lab.
 *
 */

import React, {useEffect} from 'react';
import classnames from 'classnames';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// const supportLinks = [
//   {
//     content: `Learn more using the [documentation on this site.](${docUrl(
//       'getting-started.html',
//     )})`,
//     title: 'Browse Docs',
//   },
//   {
//     content: 'Ask questions about the documentation and project',
//     title: 'Join the community',
//   },
//   {
//     content: "Find out what's new with this project",
//     title: 'Stay up to date',
//   },
// ];

function Help() {
  return (
    <Layout permalink="/help" description="Docusaurus 2 Help page">
      <div className="container margin-vert--xl">
        <div className="text--center margin-bottom--xl">
          <h1>Need Help?</h1>
          <p>
          If you need help with the cluster, you can try one of the mechanisms below.
          </p>
        </div>
        <div className="row">
          <div className="col">
            <h2>Browse the docs</h2>
            <p>
              Learn more about Docusaurus using the{' '}
              <Link to={useBaseUrl('docs/users/getting-started')}>
                User Documentation
              </Link>
            </p>
          </div>
          <div className="col">
            <h2>Contact Administraters</h2>
            <p>
              You can join the conversation on{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://discord.gg/docusaurus">
                Discord
              </a>{' '}
              on one of our two text channels:{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://discord.gg/7wjJ9yH">
                #docusaurus-2-dogfooding
              </a>{' '}
              for user help and{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://discord.gg/6g6ASPA">
                #docusaurus-2-dev
              </a>{' '}
              for contributing help.
            </p>
          </div>
          <div className="col">
            <h2>Twitter</h2>
            <p>
              You can follow and contact us on{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://twitter.com/docusaurus">
                Twitter
              </a>
              .
            </p>
          </div>
          <div className="col">
            <h2>GitHub</h2>
            <p>
              At our{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/facebook/docusaurus">
                GitHub repo
              </a>{' '}
              Browse and submit{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/facebook/docusaurus/issues">
                issues
              </a>{' '}
              or{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/facebook/docusaurus/pulls">
                pull requests
              </a>{' '}
              for bugs you find or any new features you may want implemented. Be
              sure to also check out our{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/facebook/docusaurus/blob/master/CONTRIBUTING.md">
                contributing guide
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Help;
