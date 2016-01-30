var express = require('express');
var router = express.Router();

// Login check
router.get('/', function(req, res, next) {
    if(req.session.login){
        next();   
    }else{
        console.log('redirecting user');
        res.redirect('/login');
    }
});

// GET categories from database
router.get('/', function(req, res, next) {
    req.getConnection(function(err, connection){
    	if(err) return next(err);
    	connection.query('SELECT * FROM categories', function(err, result){
    		if(err) return next(err);
    		
    		res.locals.title = "Categories";
    		res.locals.categories = result;
    		res.render('categories/index');
    	});
    });
});

// Login check
router.get('/:index', function(req, res, next) {
    if(req.session.login){
        next();   
    }else{
        console.log('redirecting user');
        res.redirect('/login');
    }
});


// GET 1 off list
router.get('/:index', function(req, res, next) {
    req.getConnection(function(err, connection){
    	if(err) return next(err);
    	connection.query('SELECT * FROM photos LEFT JOIN categories ON photos.category_id=categories.id WHERE category_id = ? ORDER BY photos.date DESC', [req.params.index], function(err, result){
    		if(err) return next(err);
    		res.locals.photos = result;
    		res.locals.title = result[0].category_name;
    		res.render('categories/show');
    	});
    });
});

module.exports = router;