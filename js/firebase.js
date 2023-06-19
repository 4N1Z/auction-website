import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyCAYOYDuMKGGjTSJL5uDzG5hjQ6y_vYPiI",
//   authDomain: "auction-website-b12fc.firebaseapp.com",
//   databaseURL: "https://auction-website-b12fc.firebaseio.com",
//   projectId: "auction-website-b12fc",
//   storageBucket: "auction-website-b12fc.appspot.com",
//   messagingSenderId: "791747024664",
//   appId: "1:791747024664:web:215a222a81c6d0c2aeb06d",
// };
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1ITe0x0UhM_HGknrVRW08dRau9vLBY4M",
  authDomain: "auction-website-2e890.firebaseapp.com",
  databaseURL: "https://auction-website-b12fc.firebaseio.com",
  projectId: "auction-website-2e890",
  storageBucket: "auction-website-2e890.appspot.com",
  messagingSenderId: "828406663883",
  appId: "1:828406663883:web:334e550bf253a01386694e"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
