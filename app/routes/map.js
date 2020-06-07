var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('maps/default', { title: 'Glopper - Map' });
});



module.exports = router;
