import React from 'react';
import {RouteComponentProps} from '@reach/router';

import Layout from '../components/layout';
import SEO from '../components/seo';
import WatchlistSave from '../components/WatchlistSave';

export default function Save(props: RouteComponentProps) {
  return (
    <Layout>
      <SEO title="Create Watchlist" />
      <WatchlistSave {...props} />
    </Layout>
  );
}
