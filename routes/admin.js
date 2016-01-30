var express = require('express');
var router = express.Router();
var fs = require('fs');

// Login check
router.get('/', function(req, res, next) {
    if(req.session.login){
        next();   
    }else{
        console.log('redirecting user');
        res.redirect('/login');
    }
});

// Show upload form
router.get('/', function(req, res){
    res.locals.title = "admin dashboard";
    res.locals.username = req.session.username;
    res.locals.message = "";
    res.render('admin/upload');
});

// Handle upload post
router.post('/', function(req, res, next) {
    if(req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/gif') {
        if(req.file !== undefined) {
         // Move the file
            fs.rename(req.file.path, req.file.destination + req.file.originalname, function(err, result){
                if(err) return next(err);
            });
        }
        req.getConnection(function(err, connection){
            if(err) return next(err);
            
            connection.query('INSERT INTO photos (user_id, title, category_id, filename, date) VALUES (?, ?, ?, ?, NOW());', [req.session.userId, req.body.caption, req.body.category, req.file.originalname], function(err, result){
                if(err) return next("something went wrong with the sql");
                res.locals.title = "Home";
                res.redirect('/');
            });
        });
    }else{
        res.locals.message = "your file was not a picture";
        res.locals.title = "upload";
        res.render('admin/upload');
    }
});

module.exports = router;