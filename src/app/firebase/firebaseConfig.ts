import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "",
    authDomain: "anggiprayoga-test.firebaseapp.com",
    projectId: "anggiprayoga-test",
    storageBucket: "anggiprayoga-test.firebasestorage.app",
    messagingSenderId: "655758329065",
    appId: "1:655758329065:web:c5791d0c39ea901f1ddc78",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
