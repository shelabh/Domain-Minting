import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAZa1liidQy7278vQnOFnF5XkjlmsuJIxY",
	authDomain: "solodraft-2b926.firebaseapp.com",
  	projectId: "solodraft-2b926",
  	storageBucket: "solodraft-2b926.appspot.com",
  	messagingSenderId: "253499257182",
  	appId: "1:253499257182:web:1530e7a7ba689ead6b5fcf"
}

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);