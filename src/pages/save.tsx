import React from 'react';
import {RouteComponentProps} from '@reach/router';

import Layout from '../components/layout';
import SEO from '../components/seo';
import WatchlistSave from '../components/WatchlistSave';
import {AuthGate} from './login';

export default function Save(props: RouteComponentProps) {
  return (
    <Layout>
      <SEO title="Create Watchlist" />
      <AuthGate>
        <WatchlistSave {...props} />
      </AuthGate>
    </Layout>
  );
}
