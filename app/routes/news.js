var express = require('express');
var router = express.Router();

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

router.get('/recent', async (req, res) => {
    try{

        const recentNews = await getRecentnews();
        return res.render('news/list', { title: 'Recent News', blogs: recentNews });

    }catch(err){
        console.log(err)
    }
});

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