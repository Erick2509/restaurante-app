import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDQHxZxLFnE0BbLA_cycCJcymN6wSI5ymA",
  authDomain: "restaurante-4db03.firebaseapp.com",
  projectId: "restaurante-4db03",
  storageBucket: "restaurante-4db03.firebasestorage.app",
  messagingSenderId: "91377087104",
  appId: "1:91377087104:web:52d5a6dff7a8c52b8cac65",
  measurementId: "G-FFQV8GPJ0T"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);