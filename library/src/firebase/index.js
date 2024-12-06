import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import {getStorage} from "firebase/storage"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZpJnKmn8MAyXL9yOA35uOw5d1zePlLHQ",
    authDomain: "library-app-7f44d.firebaseapp.com",
    projectId: "library-app-7f44d",
    storageBucket: "library-app-7f44d.appspot.com",
    messagingSenderId: "937554383286",
    appId: "1:937554383286:web:5627aeb5cc5818b0b07117",
    measurementId: "G-DH97PDSYEL"
};
  
const app = initializeApp(firebaseConfig);

let db = getFirestore(app);
let auth = getAuth(app);
let storage = getStorage(app);

export {db, auth, storage}