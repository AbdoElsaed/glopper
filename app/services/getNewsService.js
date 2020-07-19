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

const saveThisArticle = async (userId, articleId) => {
    admin.auth().getUser(userId)
        .then(async function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            // console.log('Successfully fetched user data:', userRecord.toJSON());
            let userInfo = userRecord.toJSON();

            let articleRes = await fetch(`https://glopper-f830f.firebaseio.com/news/${articleId}.json`);
            let articleData = await articleRes.json();

            console.log(articleData);

            saveThis(userInfo, articleId, articleData);

        })
        .catch(function(error) {
            console.log('Error fetching user data:', error);
        });
}

const saveThis = async (userInfo, articleId, articleData) => {

    try{

        const dbRef = admin.database();
        const savedNewsRef = dbRef.ref(`savedNews/${userInfo.uid}/${articleId}`);
        savedNewsRef.set({
            userId: userInfo.uid,
            ...articleData
        })


    } catch(err){
        console.log(err)
    }

}

const getUserSavedNews = async userId => {
    try{

        let savedNewsArr = [];

        let savedDataRes = await fetch(`https://glopper-f830f.firebaseio.com/savedNews/${userId}.json`);
        let savedNews = await savedDataRes.json();

        // let finalSavedNews = Object.values(savedNews);

        for(obj in savedNews){
            savedNews[obj]['id']=obj;
            savedNewsArr.push(savedNews[obj]);
        }

        return savedNewsArr;

    }catch(err){
        console.log(err)
    }
}

const removeThisNew = async (userId, articleId) => {
    try{

        let removeNewRef = dbRef.ref(`savedNews/${userId}/${articleId}`);
        removeNewRef.remove();


    } catch(err) {
        console.log(err);
    }
}

module.exports = { getRecentnews, filterRecentNews, getSingleNew, getLocalNews, saveThisArticle, getUserSavedNews, removeThisNew };