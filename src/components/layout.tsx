import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';

import Header from './header';
import './layout.css';

const Layout = ({children}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main className="flex flex-col min-h-full flex-grow md:px-8">{children}</main>
    </>
  );
};

export default Layout;
