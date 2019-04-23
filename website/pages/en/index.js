/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/docusaurus.svg`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('getting-started.html')}>Getting Started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          className={props.className}
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Large Data Storage</h2>
        <MarkdownBlock>Storage node can store users' data up to **50 TB**.</MarkdownBlock>
      </div>
    );

    const Status = () => (
      <Block id="try">
        {[
          {
            content: `Watch system running status, try now: [cluster status](${siteConfig.extraUrl.status})`,
            image: `${baseUrl}img/undraw_data_trends.svg`,
            imageAlign: 'left',
            title: 'Cluster Status',
          },
        ]}
      </Block>
    );

    const Support = () => (
      <Block background="dark">
        {[
          {
            content: 'By contact the cluster system administrators, you can always get your technical support.',
            image: `${baseUrl}img/undraw_contact_us.svg`,
            imageAlign: 'right',
            title: 'Get Technical Support',
          },
        ]}
      </Block>
    );

    const BlogLearn = () => (
      <Block background="light">
        {[
          {
            content: 'Learn on HPCer Blog about **Performance Analysis** and **Debug** skills.',
            image: `${baseUrl}img/undraw_blogging.svg`,
            imageAlign: 'right',
            title: 'HPCer Blog',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn" className="productShowcaseSection">
        {[
          {
            content: 'Submit your job, [SLURM](https://slurm.schedmd.com) system will schedule and run you job.',
            // image: `${baseUrl}img/docusaurus.svg`,
            // imageAlign: 'top',
            title: 'Jobs manager based on SLURM',
          },
          {
            content: 'GPUs, x86 CPUs, phytium CPUs are included in our computing system.',
            // image: `${baseUrl}img/docusaurus.svg`,
            // imageAlign: 'top',
            title: 'Various of computing resource',
          },
        ]}
      </Block>
    );

    const JoinUs = () => {
      // if ((siteConfig.admins || []).length === 0) {
      //   return null;
      // }

      // const showcase = siteConfig.admins
      //   .filter(user => user.pinned)
      //   .map(user => (
      //     <a href={user.infoLink} key={user.infoLink}>
      //       <img src={user.image} alt={user.caption} title={user.caption} />
      //     </a>
      //   ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Join us!</h2>
          <p>
            Join us to <b>maintain the cluster</b> togather 
            and <b>contribute technical support</b>
            if you a great interest in Linux and Networking.</p>
          {/* <p>Current administrators </p> */}
          {/* <div className="logos">{showcase}</div> */}
          <img
            src={`${this.props.config.baseUrl}img/undraw_operating_system.svg`}
            alt="Join us"
            width="240"
            height="200"
          />
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              Join us!
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <BlogLearn />
          <Status />
          <Support />
          <JoinUs />
        </div>
      </div>
    );
  }
}

module.exports = Index;
