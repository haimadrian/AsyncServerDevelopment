import firebase from "firebase/compat";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvrxAASgMVdVJ9yoq_BS3DqAknyXy0ZIY",
    authDomain: "expenseapphit.firebaseapp.com",
    projectId: "expenseapphit",
    storageBucket: "expenseapphit.appspot.com",
    messagingSenderId: "300397356959",
    appId: "1:300397356959:web:527b4fcc60b647d0f97faa",
    measurementId: "G-2D2XPSJ53G"
};


const app = firebase.initializeApp(firebaseConfig, 'ExpenseManagement');
export const auth = app.auth();