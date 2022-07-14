import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDrd3CmqvgV7dCcTRjMj3Va-7xzzWOAm-k",
	authDomain: "microcontentdev-64a05.firebaseapp.com",
	projectId: "microcontentdev-64a05",
	storageBucket: "microcontentdev-64a05.appspot.com",
	messagingSenderId: "398987090119",
	appId: "1:398987090119:web:33f319021fbe9fcfa106e2",
	measurementId: "G-ZKXDQ4SBVL"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
// scope to export more firebase functions !
