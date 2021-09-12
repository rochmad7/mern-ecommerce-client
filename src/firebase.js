import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyChOZTkKGXBidpU_TJnDBQVEQxbCumFj24",
    authDomain: "mern-ecommerce-fd4e3.firebaseapp.com",
    projectId: "mern-ecommerce-fd4e3",
    storageBucket: "mern-ecommerce-fd4e3.appspot.com",
    messagingSenderId: "184821156783",
    appId: "1:184821156783:web:860b442ddb1a332688bd5a",
    measurementId: "G-FME4906V6S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();