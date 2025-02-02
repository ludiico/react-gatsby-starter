import React from 'react';
import {RecoilRoot} from 'recoil';
import ApolloProvider from './src/util/apollo';
import './src/tailwind.css';

export const wrapRootElement = ({element}) => {
  return (
    <RecoilRoot>
      <ApolloProvider>{element}</ApolloProvider>
    </RecoilRoot>
  );
};
