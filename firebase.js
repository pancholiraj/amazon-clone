import * as firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { firestore, getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBhKRr0eSUeLM29MBr7tMjG_6tGxwTseN8",
  authDomain: "clone-b6749.firebaseapp.com",
  projectId: "clone-b6749",
  storageBucket: "clone-b6749.appspot.com",
  messagingSenderId: "91550855292",
  appId: "1:91550855292:web:77ec590d3f78a2c67259f9",
  measurementId: "G-MWY3W9JHZ8",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

export default db;
