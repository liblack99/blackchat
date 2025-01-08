import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_oH2Rs5ayvoOzj4-6GD2_MHyIj1WQbiY",
  authDomain: "pelagic-earth-407809.firebaseapp.com",
  projectId: "pelagic-earth-407809",
  storageBucket: "pelagic-earth-407809.appspot.com",
  messagingSenderId: "939798843812",
  appId: "1:939798843812:web:ed043e715697f227fdf131",
  measurementId: "G-PQEW2MFNMH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
