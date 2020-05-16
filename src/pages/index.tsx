import React from 'react';
import MoviesExplorer from '../components/MoviesExplorer';
import Layout from '../components/layout';
import SEO from '../components/seo';

export default function IndexPage() {
  return (
    <Layout>
      <SEO title="Home" />
      <MoviesExplorer enableSearch={false} />
    </Layout>
  );
}
