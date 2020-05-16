import React, {useEffect} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Layout from '../components/layout';
import {firebase} from '../util/firebase';
import {RouteComponentProps, useNavigate, useLocation} from '@reach/router';
import {atom, useRecoilState, useRecoilValue} from 'recoil';

export const authState = atom({
  key: 'auth',
  default: firebase?.auth()?.currentUser?.toJSON(),
});

export const AuthGate = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useRecoilValue(authState);

  useEffect(() => {
    if (!user?.uid)
      navigate('/login', {
        replace: true,
        state: {
          pathname: location.pathname,
        },
      });
  }, [user]);

  if (!user?.uid) return null;
  return children;
};

export default function Login(props: RouteComponentProps) {
  const auth = firebase?.auth();
  const [user, setUser] = useRecoilState(authState);

  useEffect(() => {
    const check = (next: firebase.User) => {
      if (next?.uid) {
        setUser(next.toJSON());
        const {pathname = '/'} = (props.location.state as any) || {};
        props.navigate(pathname, {replace: true});
        return next;
      }
    };

    if (check(user)) return;

    const unsubscribe = auth.onAuthStateChanged(check);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Layout>
      <StyledFirebaseAuth
        firebaseAuth={auth}
        uiConfig={{
          signInFlow: 'popup',
          signInSuccessUrl: '/login',
          signInOptions: ['google.com', 'password'],
          credentialHelper: 'none',
          callbacks: {
            signInSuccessWithAuthResult: () => {
              return false;
            },
          },
        }}
      />
    </Layout>
  );
}
