import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig ={
	apiKey: "AIzaSyBhu5qApLVhq9XNUOWCuWROkstZDdzcE8w",
	authDomain: "microcontentdevlopment.firebaseapp.com",
	databaseURL: "https://microcontentdevlopment-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "microcontentdevlopment",
	storageBucket: "microcontentdevlopment.appspot.com",
	messagingSenderId: "12134570353",
	appId: "1:12134570353:web:64e77eef37a99cb990fed0"
  };

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
// scope to export more firebase functions !