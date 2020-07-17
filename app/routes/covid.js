var express = require('express');
var router = express.Router();



router.get('/maps', async (req, res) => {
    try{

        return res.render('covid/maps', { title: 'Covid-19'});

    }catch(err){
        console.log(err)
    }
});







module.exports = router;