import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Jobs manager based on SLURM',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed
         and used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Various of computing resource',
    Svg: require('@site/static/img/undraw_blogging.svg').default,
    description: (
      <>
        GPUs, x86 CPUs, phytium CPUs are included in our computing system.
      </>
    ),
  },
  {
    title: 'Large Data Storage',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
         Storage node can store users' data up to 50 TB.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}


export default function HomepageFeatures(): JSX.Element {
  return FeatureList && FeatureList.length > 0 && (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
