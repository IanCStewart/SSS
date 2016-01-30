var express = require('express');
var router = express.Router();

// This is a catch-all line, it responds to any and all GET requests that get here
router.get('*', function(req, res, next) {
  res.status(404);
  res.locals.title = "error 404";
  var errorURL = req.URL;

  // Plx respond in the way that fits the client
  if(req.accepts('html')) {
    res.render('404', {url: req.url});

  } else if(req.accepts('json')) {
    res.send({error: 'Not found'});

  } else {
    res.type('txt').send('Not found');
  }
});

router.post('/', function(req, res) {
    var msg = req.body.msg;
    var email = req.body.email;
    console.log("post received: %s %s", email, msg);
    
    res.locals.title = "error 404";
    res.locals.email = email;
    res.render('thanksmsg');
});

module.exports = router;