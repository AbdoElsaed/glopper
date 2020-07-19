var express = require('express');
var router = express.Router();
// const admin = require("firebase-admin");



const serviceAccount = require("../serviceAccountKey.json");

const { getRecentnews } = require('../services/getNewsService');
const { filterRecentNews } = require('../services/getNewsService');
const { getSingleNew } = require('../services/getNewsService');
const { getLocalNews } = require('../services/getNewsService');
const { saveThisArticle } = require('../services/getNewsService');
const { getUserSavedNews } = require('../services/getNewsService');
const { removeThisNew } = require('../services/getNewsService');



router.get('/local', async (req, res) => {
    try{

        let country = req.query.country.toLowerCase();
        let localNews = await getLocalNews(country);
        return res.render('news/list', { title: 'Local News', blogs: localNews });

    }catch(err){
        console.log(err)
    }
});

router.get('/mapSearch', async (req, res) => {
    try{

        let country = req.query.country.toLowerCase();
        let localNews = await getLocalNews(country);
        return res.render('news/list', { title: `${country} News`, blogs: localNews });

    }catch(err){
        console.log(err)
    }
});

router.get('/recent', async (req, res) => {
    try{

        const recentNews = await getRecentnews();
        return res.render('news/list', { title: 'Recent News', blogs: recentNews });

    }catch(err){
        console.log(err)
    }
});

router.get("/saved", async function (req, res) {
    try{
        const userId = req.query.userid;
        console.log(userId);
  
        const savedNews = await getUserSavedNews(userId);

        return res.render('news/savedList', { title: 'Saved News', blogs: savedNews });

    }catch(err){
        console.log(err)
    }
     
});

router.get('/savedNews/search', async (req, res) => {
    const searchTxt = req.query.searchTxt;
    console.log(searchTxt);

})

router.get('/saveThisNew', async (req, res) => {

    try{

        const articleId = req.query.articleId;
        const userId = req.query.userId;
        console.log('article id: ', articleId )
        console.log('user id: ', userId )

        saveThisArticle(userId, articleId);


    } catch(err){
        console.log(err);
    }

})

router.get('/removeThisNew', async (req, res) => {

    try{

        const articleId = req.query.articleId;
        const userId = req.query.userId;

        return removeThisNew(userId, articleId);


    } catch(err){
        console.log(err);
    }

})

router.get('/deleteThisNew', async (req, res) => {

    try{



    } catch(err){
        console.log(err);
    }

})

router.get('/saved/notloggedin', (req, res) => {
    try{
        return res.render('news/notloggedin', { title: 'Saved News' });
        
    } catch(err){
        console.log(err);
    }
})

router.get('/:id', async (req, res) => {
    try{

        console.log(req.params);
        const singleNew = await getSingleNew(req.params.id);
        res.render('news/blog', {title: 'News', blog: singleNew});

    }catch(err){
        console.log(err)
    }
});

router.get('/recent/filter', async (req, res) => {
    try{

        console.log(req.query)
        console.log(req.query.category)
        let cats = typeof(req.query.category) === 'string' ? [req.query.category] : req.query.category;
        const filteredNews = await filterRecentNews(cats);
        res.render('news/list', { title: 'Recent News', blogs: filteredNews });
    }catch(err){
        console.log(err);
    }
});



module.exports = router;