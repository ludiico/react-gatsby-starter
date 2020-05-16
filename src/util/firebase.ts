export const isBrowser = () => typeof window !== 'undefined';

let firebase;

const {GATSBY_FIREBASE_CONFIG} = process.env;

if (isBrowser() && GATSBY_FIREBASE_CONFIG) {
  firebase = require('firebase/app');
  require('firebase/auth');
  require('firebase/analytics');
}

if (firebase && GATSBY_FIREBASE_CONFIG) {
  firebase.initializeApp(JSON.parse(GATSBY_FIREBASE_CONFIG));
  firebase.analytics();
}

export {firebase};
