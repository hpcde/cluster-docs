/**
 * Copyright (c) 2017-present, HPCDE lab.
 *
 */

import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface SiteConfig {
  users: [],
  repoUrl: string,
}

function Users () {
  const context = useDocusaurusContext();
  const {siteConfig} = context;

  if ((siteConfig.users || []).length === 0) {
    return null;
  }

  const editUrl = `${siteConfig.repoUrl}/edit/master/website/siteConfig.js`;
  const showcase = siteConfig.users.map(user => (
    <a href={user.infoLink} key={user.infoLink}>
      <img src={user.image} alt={user.caption} title={user.caption} />
    </a>
  ));

  return (
    <div className="mainContainer">
      <Container padding={['bottom', 'top']}>
        <div className="showcaseSection">
          <div className="prose">
            <h1>Who is Using This?</h1>
            <p>This project is used by many folks</p>
          </div>
          <div className="logos">{showcase}</div>
          <p>Are you using this project?</p>
          <a href={editUrl} className="button">
            Add your company
          </a>
        </div>
      </Container>
    </div>
  );
}

export default Users;
