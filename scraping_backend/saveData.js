const fetch = require('node-fetch');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

//initialize admin SDK using serviceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://glopper-f830f.firebaseio.com"
});

// const db = admin.firestore();
const dbRef = admin.database();


const saveNews =async news => {
    try {
        const newsRef = dbRef.ref('news');
        for(let i=0; i<news.length; i++){
            let newRef = newsRef.push();
            newRef.set(news[i]);
        }
    } catch (err) {
        console.error(err);
    }
}


module.exports = { saveNews };