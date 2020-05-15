import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

const Header = ({siteTitle}) => (
  <header className="flex flex-row flex-grow pt-6 pb-12">
    <div className="flex flex-row flex-grow items-center justify-center">
      <Link to="/" className="text-2xl">
        {siteTitle}
      </Link>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
