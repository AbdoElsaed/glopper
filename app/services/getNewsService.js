const fetch = require('node-fetch');
const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://glopper-f830f.firebaseio.com"
});

const dbRef = admin.database();


const getRecentnews = () => {
    let recentNews = [];
    return new Promise(function(resolve, reject){
        const recentNewsRef = dbRef.ref('news').orderByKey().limitToLast(10);
        recentNewsRef.on('value', async (snapchot) => {
        snapchot.forEach(function(child){
            const childKey = child.key;
            const childData = child.val();
            childData['id'] = childKey;
            recentNews.push(childData);
        })
        if(recentNews.length>0){
            resolve(recentNews)
        } else {
            reject('shiiiittt')
        }
    })}
)}

const getLocalNews = async location => {
    let localNews = [];
    const res = await fetch(`https://glopper-f830f.firebaseio.com/news.json?orderBy="location"&equalTo="${location}"`);
    const data = await res.json();

    for(obj in data){
        data[obj]['id']=obj;
        localNews.push(data[obj]);
    }

    return localNews;
}

const getSingleNew = async id => {
    const res = await fetch(`https://glopper-f830f.firebaseio.com/news/${id}.json`);
    const singlenew =  await res.json();
    //increment the views value
    function updateViews(num){
        dbRef.ref(`news/${id}`).update({views: ++num})
    }
    dbRef.ref(`news/${id}/views`).once('value', snapchot => {
        let oldViewsNum = snapchot.val();
        updateViews(oldViewsNum);
    })

    return singlenew
}

const filterRecentNews = async (cats) => {
    const link = 'https://glopper-f830f.firebaseio.com/news.json?orderBy="category"&equalTo='
    let filteredRecentNews = [];
    for(cat of cats){
        let res = await fetch(`${link}"${cat}"`);
        let catNews = await res.json();
        for(obj in catNews){
            catNews[obj]['id']=obj;
            filteredRecentNews.push(catNews[obj]);
        }
        // console.log(filteredRecentNews)
    }
    return filteredRecentNews
}

module.exports = { getRecentnews, filterRecentNews, getSingleNew, getLocalNews };