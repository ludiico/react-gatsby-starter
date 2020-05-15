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
      <div className="flex flex-col flex-grow">
        <main className="flex flex-col flex-grow md:px-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;
