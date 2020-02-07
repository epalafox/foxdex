import * as firebase from 'firebase'

//require("firebase/firestore");
const config = {
    apiKey: "AIzaSyDNXsDW6HL54JKOrl-1Nu3Ii8VXXVnkI2Q",
    authDomain: "foxdex-2441a.firebaseapp.com",
    databaseURL: "https://foxdex-2441a.firebaseio.com",
    projectId: "foxdex-2441a",
    storageBucket: "foxdex-2441a.appspot.com",
    messagingSenderId: "804087767703",
    appId: "1:804087767703:web:1e9f8bb3acbede40d7ffd2"
  };
const Firebase = firebase.initializeApp(config);
export default Firebase
