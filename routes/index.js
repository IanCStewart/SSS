var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

// Should we login or show the sensitive data
router.get('/', function(req, res, next) {
    if(req.session.login){
        next();   
    }else{
        console.log('redirecting user');
        res.redirect(req.baseUrl + '/login');
    }
});

// GET home page
router.get('/', function(req, res, next) {
    req.getConnection(function(err, connection) {
    	if(err) return next(err);
    	
        connection.query('SELECT * FROM `photos` ORDER BY `photos`.`date` DESC;', function(error, result){
            if(err) return next(err);
			
            res.locals.photos = result;
            res.locals.title = "Home";
            res.render('index');
        });
    });
});

// Show the make form
router.get('/make', function(req, res){
    res.locals.title = "create account";
    res.locals.message = "";
    res.render('make');
});

// Handle account creation
router.post('/make', function(req, res){
    console.log('create account attempt for ', req.body.user);
    //check if fields are filled
    if(!req.body.user || !req.body.name || !req.body.password) {
        res.locals.title = "create account";
        res.locals.message = "please fill in all the fields";
		res.render('make');
	} else {
    	// check if they typed the same pass twice, username existence, insert in DB
		if(req.body.password == req.body.passwordCheck) {
    		req.getConnection(function(err, connection) {
                if(err) return next();
                connection.query('SELECT * FROM users WHERE username = ?', [req.body.user], function(err, result) { 
                    if(err) return next();
                    if(result.length) {
                        res.locals.title = "create account";
                        res.locals.message = "username already in use";
                        res.render('make');
                    } else {
                        req.getConnection(function(err, connection) {
                    		if(err) return next("cant connect to sql...");
                    		                        			
                    		connection.query('INSERT INTO users (name, password, username) VALUES (?,?,?)', [req.body.name, bcrypt.hashSync(req.body.password), req.body.user], function(error, records) {
                    			if(err) return next("somthing went wrong with sql...");
                                res.redirect('/login');
                            });
                        });
                    }
                });
            });
		} else {
    		res.locals.title = "create account";
            res.locals.message = "please fill in the same password";
		    res.render('make');
		}
	}
});

// Show the login form
router.get('/login', function(req, res) {
    res.locals.title = "login";
    res.locals.message = "";
    res.render('login');
});

// Handle authentication posted from the form
router.post('/login', function(req, res, next) {
    console.log('login attempt for ', req.body.user);
    req.getConnection(function(err, connection){
        if(err) return next(err);
    
        connection.query('SELECT * FROM users WHERE username=?;', [req.body.user], function(err, records){
            if(err) return next(err);
            // user exists, check pass
            if(records.length != 0) {
					bcrypt.compare(req.body.password, records[0].password, function(err, result){
						if(result) {
							req.session.regenerate(function(){
                                req.session.login = records.length>0 ? true : false;
                                req.session.username = records[0].name;
                                req.session.userId = records[0].id;
                                res.redirect('/');
                            });
						} else {
							res.locals.title = "login";
                            res.locals.message = "incorrect password!";
                            res.render('login');
						}
					});
            // If there are no results at all, the user does not exist
            } else {
				res.locals.title = "login";
                res.locals.message = "this user does not exist!";
                res.render('login');
            }
        });
    });
});

// Logout and redirect
router.get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log('logout');
        res.redirect('/');
    });
});

module.exports = router;