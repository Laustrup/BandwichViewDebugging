import { initializeApp } from '../node_modules/firebase/app';
import { getFirestore, collection, getDocs } from '../node_modules/firebase/firestore/';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchImage(endpoint) {
    const images = firebase.storage().ref().child('Images'), image = images.child('image1');
}

async function uploadImage(image) {
    const ref = firebase.storage().ref(),
        file = document.querySelector("#photo").files[0],
        name = +new Date() + "-" + file.name,
        metadata = { contentType: file.type };
    const task = ref.child(name).put(file, metadata);
    task.then(snapshot => snapshot.ref.getDownloadURL()).then(url => {
            console.log(url);
            document.querySelector("#image").src = url;
        }).catch(console.error);
}
