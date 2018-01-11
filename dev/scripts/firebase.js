import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDf6BY-QMaWLlMrJbUUOaTgQiImzP0AT_k",
    authDomain: "budget-app-39c98.firebaseapp.com",
    databaseURL: "https://budget-app-39c98.firebaseio.com",
    projectId: "budget-app-39c98",
    storageBucket: "",
    messagingSenderId: "307083289705"
};
firebase.initializeApp(config);

export default firebase;