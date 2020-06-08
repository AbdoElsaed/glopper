const fetch = require('node-fetch');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const { getLatLonfromName } = require('./getLatLon');

//initialize admin SDK using serviceAcountKey
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://glopper-f830f.firebaseio.com"
});


// const db = admin.firestore();
const dbRef = admin.database();
const newsRef = dbRef.ref('news');

const updatalatLon = async url => {
    try{

        const response = await fetch(url);
        const json = await response.json();
        const keys = Object.keys(json);
        keys.map((item, i) => {
            newsRef.child(`${keys[i]}`).on('value', async snapshot => {
                if(snapshot.val().location !== 'general'){
                    let {latitude, longitude, countryCode} = await getLatLonfromName(snapshot.val().location);
                    newsRef.child(`${keys[i]}`).update({latitude, longitude, countryCode});
                }
            })
        })

    } catch (err) {
        console.log(err);
    }
}


updatalatLon('https://glopper-f830f.firebaseio.com/news.json');
