/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl('getting-started.html', this.props.language)}>
              Getting Started
            </a>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
            {/* <a href={this.docUrl('admin-guide.html', this.props.language)}> */}
              {/* Admin Guides */}
            {/* </a> */}
            {/* <a href={this.docUrl('doc3.html', this.props.language)}> */}
              {/* API Reference (or other categories) */}
            {/* </a> */}
          </div>
          <div>
            <h5>Community</h5>
            <a 
            href={this.props.config.extraUrl.git}
            target="_blank"
            rel="noreferrer noopener">
              HPCer Git
            </a>
            <a
              href={this.props.config.extraUrl.hub}
              target="_blank"
              rel="noreferrer noopener">
              HPCer Hub
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a
            href={this.props.config.extraUrl.status}
            target="_blank"
            rel="noreferrer noopener">
            Cluster Status
            </a>
            <a
            href={this.props.config.repoUrl}
            target="_blank"
            rel="noreferrer noopener">
            Doc Source on Git
            </a>
            <a
              className="github-button"
              href={this.props.config.repoUrl}
              data-icon="octicon-star"
              data-count-href="/facebook/docusaurus/stargazers"
              data-show-count="flase"
              data-count-aria-label="# stargazers on Git"
              aria-label="Star this project on Git">
              Star
            </a>
          </div>
        </section>

        <a
          href="https://opensource.facebook.com/"
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource">
          <img
            src={`${this.props.config.baseUrl}img/oss_logo.svg`}
            alt="Facebook Open Source"
            width="170"
            height="96"
          />
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
