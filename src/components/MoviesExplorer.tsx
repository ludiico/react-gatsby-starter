import React from 'react';
import {useDebounce} from 'use-debounce';
import {atom, useRecoilState} from 'recoil';
import {useQuery, gql} from '@apollo/client';
import {Link} from 'gatsby';

export const playlistState = atom({
  key: 'playlist',
  default: [],
});

const searchTermState = atom({
  key: 'searchTerm',
  default: '',
});

const QUERY_SEARCH = gql`
  query Search($name: String!) {
    searchMovies(name: $name) {
      id
      poster_path
      release_date
      overview
      title
      popularity
    }
  }
`;

const QUERY_TRENDING = gql`
  query Trending {
    trending {
      id
      poster_path
      release_date
      overview
      title
      popularity
    }
  }
`;

const MoviesExplorer = ({enableSearch = false}) => {
  const [term, setTerm] = useRecoilState(searchTermState);
  const [playlist, setList] = useRecoilState(playlistState);

  const [deboucedTerm] = useDebounce(term, 350, {
    leading: false,
  });

  const {query, variables = {}} = deboucedTerm
    ? {
        query: QUERY_SEARCH,
        variables: {
          name: deboucedTerm,
        },
      }
    : {
        query: QUERY_TRENDING,
      };

  const {data} = useQuery(query, {variables});

  const items = data?.trending ?? data?.searchMovies;

  const toggleItem = item => {
    setList(current => {
      let next = current.filter(({id}) => id !== item.id);
      if (next.length === current.length) {
        next = [...current, item];
      }
      return next;
    });
  };

  const onChange = event => {
    setTerm(event.target.value);
  };

  const isSelected = item => playlist.some(atom => atom.id === item.id);

  return (
    <>
      <div className="flex relative flex-row">
        <div className="w-3/4 flex flex-col">
          {enableSearch && (
            <input
              onChange={onChange}
              className="p-4 mr-4 mb-4 text-4xl font-sans"
              type="text"
              defaultValue={term}
              placeholder="Buscar..."
            />
          )}

          <div className="flex flex-row flex-wrap">
            {items?.map(item => (
              <a
                href=""
                onClick={event => {
                  event.preventDefault();
                  toggleItem(item);
                }}
                className="flex relative flex-row mr-6 mb-6 hover:shadow-xl cursor-pointer transition transition-all ease-in-out duration-150 transform hover:translate-y-1 focus:translate-y-1"
                key={item.id}>
                {isSelected(item) && (
                  <div className="absolute w-full left-0 top-0 z-10 h-full bg-white bg-opacity-50 border-4 rounded-md border-blue-900" />
                )}
                <img
                  loading="lazy"
                  src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
                />
              </a>
            ))}
          </div>
        </div>
        <div
          style={{maxHeight: '80.5vh', top: 92.5}}
          className="sticky h-auto top-0 w-1/4 bg-indigo-100 rounded-lg flex flex-col bg-opacity-50 shadow-2xl">
          <div className="flex overflow-auto  divide-y  flex-col flex-grow">
            {playlist.map(item => (
              <div
                onClick={() => toggleItem(item)}
                className="cursor-pointer flex flex-rowflex-grow py-1 items-center"
                key={`selected-${item.id}`}>
                <img
                  className="flex"
                  loading="lazy"
                  style={{width: 32, height: 'auto'}}
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                />
                <span className="flex font-sans font-light text-sm px-2 items-center">
                  {item.title} ({item.release_date})
                </span>
              </div>
            ))}
          </div>
          {playlist.length > 0 && (
            <div className="flex">
              <Link
                to="/save"
                className="flex rounded-b-lg flex-row bg-blue-800 text-white font-sans p-3 flex-grow items-center justify-center text-xl font-bold">
                CRIAR WATCHLIST
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoviesExplorer;
