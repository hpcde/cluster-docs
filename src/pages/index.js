import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Jobs manager based on SLURM</>,
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed
        and used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: <>Various of computing resource</>,
    imageUrl: 'img/undraw_blogging.svg',
    description: (
      <>
        GPUs, x86 CPUs, phytium CPUs are included in our computing system.
      </>
    ),
  },
  {
    title: <>Large Data Storage</>,
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        Storage node can store users' data up to 50 TB.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/**
 *  const Status = () => (
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
      <Block background="light">
        {[
          {
            content: 'By contacting the cluster system administrators, you can always get your technical support.',
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
 */
function JoinUs () {
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

  // const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>Join us!</h2>
      <p>
        Join us to <b>maintain the cluster</b> togather 
        and <b>contribute technical support </b>
        if you have a great interest in Linux and Networking.</p>
      {/* <p>Current administrators </p> */}
      {/* <div className="logos">{showcase}</div> */}
      <img
        src={useBaseUrl('img/undraw_operating_system.svg')}
        alt="Join us"
        width="240"
        height="200"
      />
      <div className="more-users">
        <a className="button" >
          Join us!
        </a>
      </div>
    </div>
  );
};

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;

  // const Status = () => (
  //   <Block id="try">
  //     {[
  //       {
  //         content: `Watch system running status, try now: [cluster status](${siteConfig.customFields.extraUrl.status})`,
  //         image: `${useBaseUrl}img/undraw_data_trends.svg`,
  //         imageAlign: 'left',
  //         title: 'Cluster Status',
  //       },
  //     ]}
  //   </Block>
  // );


  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/users/getting-started')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="container">
          <div className="row">
            <JoinUs/>
          </div>
        </div>
        {/* <Status/> */}
      </main>
    </Layout>
  );
}

export default Home;
