var express = require('express');
var router = express.Router();

// cath non loged in users
router.get('/:index', function(req, res, next){
    if(req.session.login){
        next();   
    }else{
        console.log('redirecting user');
        res.redirect('/login');
    }
});

// show comments alongside picture
router.get('/:index', function(req, res){
    req.getConnection(function(error, connection){
        if(error) return next(error);
        connection.query('SELECT * FROM photos WHERE id = ?', [req.params.index], function(error, result) {
            if(error) return next(error);
            connection.query('SELECT * FROM comments WHERE photo_id=? ORDER BY comments.created_at ASC', [req.params.index], function(error, records){
                if(error) return next(error);
                connection.query('SELECT * FROM comments LEFT JOIN users ON comments.user_id=users.id WHERE photo_id=?', [req.params.index], function(error, names){
                    if(error) return next(error);
                    
                    res.locals.photos = result;
                    res.locals.comments = records;
                    res.locals.users = names;
                    res.locals.title = result[0].title;
                    res.render('img/show')
                });
            });
        });
    }); 
});

router.post('/:index', function(req, res){
    req.getConnection(function(error, connection){
        if(error) return next(error);
        connection.query('INSERT INTO comments (photo_id, user_id, created_at, comment) VALUES (?, ?, NOW(), ?)', [req.params.index, req.session.userId, req.body.comment], function(error, result){
            if(error) return next(error);
            
            res.redirect(req.baseUrl+'/'+req.params.index);
        });
    });
});

module.exports = router;