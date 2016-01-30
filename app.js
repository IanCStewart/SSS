// Load modules
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    multer = require('multer'),
    uploading = multer({
        dest: __dirname + '/public/uploads/'
    }),
    fs = require('fs'),
    dbOptions = {
      host: 'localhost',
      user: 'student',
      password: 'serverSide',
      port: 3306,
      database: 'student'
    },
    figlet = require('figlet'),
    art = require('ascii-art'),
    socket	 = require('socket.io'),
	http = require('http');

// Define routers
var indexRouter = require('./routes/index'),
    imgRouter = require('./routes/img'),
    categoriesRouter = require('./routes/categories'),
    adminRouter = require('./routes/admin'),
    errorRouter = require('./routes/error');

// Set up the app
var app = express();

// socket io stuff
var server = http.Server(app);
var io = socket(server);

// Use session
app.use(session({
  secret: "SomeoneToldMeThisWebsiteIsAboutpicturesOrSomething",
  resave: false,
  saveUninitialized: true
}));

// Define bodyparser (handles POST requests)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Define the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Tell express which static files to serve
app.use(express.static('public'));

//Connect the database
app.use(myConnection(mysql, dbOptions, 'single'));

// Connect the routers to routes
app.use('/', indexRouter);
app.use('/img', imgRouter);
app.use('/categories', categoriesRouter);
app.use('/admin', uploading.single('upload-file') , adminRouter);

//if none of routes followed
app.use(errorRouter);

// Tell the app to listen to incoming traffic on port 3000
app.listen(3000, function(){
    console.log('started on port 3000!');
    art.font('SSS  ', 'Basic', 'magenta').font('f* yeah!', 'Basic', 'green', function(data) {
        console.log(data);
    });
});
