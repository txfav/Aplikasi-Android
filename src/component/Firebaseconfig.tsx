import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

const Firebaseconfig = {
    apiKey: "AIzaSyBsOVO4N4ZOdw3KjfzwgzoduvKOR-Yg80o",
    authDomain: "status-kunci-pintu.firebaseapp.com",
    databaseURL: "https://status-kunci-pintu-default-rtdb.firebaseio.com",
    projectId: "status-kunci-pintu",
    storageBucket: "status-kunci-pintu.appspot.com",
    messagingSenderId: "692108309026",
    appId: "1:692108309026:web:930f1edb8e562dc50c507b",
    measurementId: "G-J2GBYXK941"
}

const firebaseApp = firebase.initializeApp(Firebaseconfig);
const database = firebase.database();

export default database;