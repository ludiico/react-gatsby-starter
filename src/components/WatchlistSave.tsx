import React, {useEffect, useRef} from 'react';
import {useRecoilState, atom} from 'recoil';
import {RouteComponentProps} from '@reach/router';
import {Link, navigate} from 'gatsby';
import {gql, useMutation} from '@apollo/client';
import {playlistState} from '../components/MoviesExplorer';

const formState = atom({
  key: 'watchlist-form',
  default: {
    title: '',
    description: '',
  },
});

const MUTATION_CREATE_WATCHLIST = gql`
  mutation AddMovieToPlaylist(
    $list: [playlist_movie_insert_input!]!
    $title: String!
    $description: String!
  ) {
    insert_playlist(
      objects: {
        title: $title
        description: $description
        playlist_movies: {data: $list}
      }
    ) {
      affected_rows
      returning {
        id
        description
        title
        playlist_movies {
          movie {
            id
            title
            poster_path
          }
        }
      }
    }
  }
`;

export default function WatchlistSave(props: RouteComponentProps) {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const titleRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLTextAreaElement>();

  const [create, createRequest] = useMutation(MUTATION_CREATE_WATCHLIST);
  const [form, setForm] = useRecoilState(formState);

  useEffect(() => {
    if (
      !playlist.length &&
      !createRequest.data?.insert_playlist?.affected_rows
    ) {
      props.navigate('/');
    }
  }, [playlist]);

  const onChangeField = event => {
    const {name, value} = event.target;
    setForm(current => ({...current, [name]: value}));
  };

  const onSubmit = () => {
    if (!form.title) {
      titleRef.current.focus();
      titleRef.current!.scrollIntoView({behavior: 'smooth'});
      return;
    } else if (!form.description) {
      descriptionRef.current!.scrollIntoView({behavior: 'smooth'});
      descriptionRef.current!.focus();
      return;
    }

    create({
      variables: {
        title: form.title,
        description: form.description,
        list: playlist.map(({__typename, ...movieData}) => ({
          movie: {
            on_conflict: {
              constraint: 'movie_pkey',
              update_columns: ['overview'],
            },
            data: movieData,
          },
        })),
      },
    }).then(async result => {
      const {returning} = result.data?.insert_playlist || {};
      if (returning?.length) {
        const [created] = returning;
        await navigate(`/watchlist?id=${created.id}`, {replace: true});

        setPlaylist([]);
        setForm({title: '', description: ''});
      }
    });
  };

  return (
    <>
      <div className="flex relative md:w-3/4 lg:w-1/2 min-h-full self-center flex-col flex-grow">
        <input
          autoFocus
          value={form.title}
          name="title"
          maxLength={20}
          onChange={onChangeField}
          placeholder="Título"
          className="outline-none border-black text-4xl font-sans p-2 text-md"
          type="text"
          ref={titleRef}
        />
        <textarea
          value={form.description}
          onChange={onChangeField}
          maxLength={200}
          ref={descriptionRef}
          name="description"
          placeholder="Descrição"
          className="outline-none border-black text-2xl font-sans p-2 mt-4"
        />

        <div className="divide-y">
          {playlist.map(item => (
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
        <div className="h-16 sticky bottom-0 bg-white flex flex-row items-center justify-between">
          <Link
            to="/"
            className="p-2 w-32 font-sans bg-white font-semibold rounded text-md">
            VOLTAR
          </Link>
          <button
            disabled={createRequest.loading}
            onClick={onSubmit}
            className="p-2 w-32 font-sans bg-green-700 text-white font-semibold rounded text-md">
            SALVAR
          </button>
        </div>
      </div>
    </>
  );
}
