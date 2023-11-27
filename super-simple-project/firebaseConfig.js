// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBM32wirHLbkeqHz3oEGInSt8jHzpxQy0Q",
    authDomain: "redditclient-80ec9.firebaseapp.com",
    projectId: "redditclient-80ec9",
    storageBucket: "redditclient-80ec9.appspot.com",
    messagingSenderId: "108344672343",
    appId: "1:108344672343:web:a107e9bbd01002a0f5a312",
    measurementId: "G-9DZE0NEC9N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

