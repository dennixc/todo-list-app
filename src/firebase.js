import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAh4ECWbFAYEeBFkHRITTnUAH69Gaxxq4A",
  authDomain: "todo-list-app-3b98d.firebaseapp.com",
  projectId: "todo-list-app-3b98d",
  storageBucket: "todo-list-app-3b98d.firebasestorage.app",
  messagingSenderId: "41651141590",
  appId: "1:41651141590:web:7bcc38ad95d43e7a918277"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
