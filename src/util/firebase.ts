export const isBrowser = () => typeof window !== 'undefined';

let firebase;

if (isBrowser()) {
  firebase = require('firebase/app');
  require('firebase/auth');
  require('firebase/analytics');
}

if (firebase) {
  firebase.initializeApp(JSON.parse(process.env.GATSBY_FIREBASE_CONFIG));
  firebase.analytics();
}

export {firebase};
