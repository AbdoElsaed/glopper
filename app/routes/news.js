var express = require('express');
var router = express.Router();
const admin = require("firebase-admin");



const serviceAccount = require("../serviceAccountKey.json");

const { getRecentnews } = require('../services/getNewsService');
const { filterRecentNews } = require('../services/getNewsService');
const { getSingleNew } = require('../services/getNewsService');
const { getLocalNews } = require('../services/getNewsService');



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

router.get("/saved", function (req, res) {
    try{
        const userId = req.query.userid;
        console.log(userId);
        const sessionCookie = req.cookies.session || "";
  
        const savedNews = [];

        return res.render('news/savedList', { title: 'Saved News', blogs: savedNews });


        // admin.auth().getUser(`pJo6Tx6oWOVB9q4inxnRmuXi9XB3`)
        //     .then(function(userRecord) {
        //         // See the UserRecord reference doc for the contents of userRecord.
        //         console.log('Successfully fetched user data:', userRecord.toJSON());
        //     })
        //     .catch(function(error) {
        //         console.log('Error fetching user data:', error);
        //     });

    }catch(err){
        console.log(err)
    }
    

    
});

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