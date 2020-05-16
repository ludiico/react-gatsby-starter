import React, {useMemo, useEffect} from 'react';
import {RouteComponentProps} from '@reach/router';
import {gql, useQuery} from '@apollo/client';
import Layout from '../components/layout';

const QUERY_WATCHLIST = gql`
  query Watchlist($id: Int!) {
    playlist_by_pk(id: $id) {
      id
      title
      description
      playlist_movies {
        movie {
          id
          poster_path
          popularity
          overview
          title
          release_date
          backdrop_path
        }
      }
    }
  }
`;

export default function (props: RouteComponentProps) {
  const params = useMemo(() => new URLSearchParams(props.location.search), [
    props.location.search,
  ]);

  const id = params.get('id');

  useEffect(() => {
    if (!id) props.navigate('/');
  }, [id]);

  const {data, loading} = useQuery(QUERY_WATCHLIST, {
    skip: !id,
    variables: {
      id,
    },
  });

  if (loading) return <Layout>..</Layout>;

  if (!data?.playlist_by_pk) {
    return (
      <Layout>
        <div>Não encontrado</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex relative md:w-1/2 min-h-full self-center flex-col flex-grow">
        <span className="text-4xl font-sans py-4 ">
          {data.playlist_by_pk.title}
        </span>
        <span className="text-xl font-sans py-4 ">
          {data.playlist_by_pk.description}
        </span>
        <div className="divide-y">
          {data.playlist_by_pk.playlist_movies.map(({movie: item}) => (
            <div className="flex flex-row py-4" key={`selected-${item.id}`}>
              <img
                className="flex"
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
              />
              <span className="flex flex-col px-4">
                <div className="text-2xl font-sans font-semibold">
                  {item.title}
                </div>
                <div className="font-sans text-gray-600 font-light">
                  {item.release_date}
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
