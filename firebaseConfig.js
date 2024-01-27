// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {getAuth} from  "firebase/auth"

// TODO: Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDdsUcXq9fn17ZpZP1DopdihvTShJuD12M",
//   authDomain: "fir-react-1daa1.firebaseapp.com",
//   projectId: "fir-react-1daa1",
//   storageBucket: "fir-react-1daa1.appspot.com",
//   messagingSenderId: "335085843522",
//   appId: "1:335085843522:web:e745aea35959d8d61be9db"
// };
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_VYD9OP1A3jENCo2JHqZvQlPpkPCuXfY",
    authDomain: "vehiclesapp-141d0.firebaseapp.com",
    projectId: "vehiclesapp-141d0",
    storageBucket: "vehiclesapp-141d0.appspot.com",
    messagingSenderId: "901818577962",
    appId: "1:901818577962:web:89a26560e0183b1f8fff53"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Services (database, auth, etc)
const db = getFirestore(app);
const auth = getAuth(app)
export {db,auth}