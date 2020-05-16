import React from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider as ReactApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import {onError} from 'apollo-link-error';
import {setContext} from 'apollo-link-context';
import fetch from 'isomorphic-fetch';
import {firebase} from './firebase';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: `https://${process.env.GATSBY_HASURA_ENDPOINT}`,
  fetch,
});

const authLink = setContext(async (_, {headers}) => {
  const token = await firebase.auth()?.currentUser?.getIdToken();
  return {
    headers: {
      ...(headers || {
        ...(token && {authorization: `Bearer ${token}`}),
      }),
    },
  };
});

const onErrorLink = onError(({graphQLErrors, operation, forward}) => {
  if (!graphQLErrors) {
    // TODO: User is not authorized to hit hasura
    return;
  }

  const [hasuraError] = graphQLErrors || [];

  if (hasuraError?.extensions?.code === 'access-denied') {
    // Refresh here
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, onErrorLink, httpLink] as any),
  cache,
});

export default function ApolloProvider(props: {children: React.ReactNode}) {
  return (
    <ReactApolloProvider client={client}>{props.children}</ReactApolloProvider>
  );
}
