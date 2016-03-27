//Think of these require statements as #include statements. They're just pre-built libraries.
var express = require('express');
var request = require('request');
var handles = require('express-handlebars');
var passport = require('passport');
var session = require('express-session');
var config = require('./app/config');
var app = express();

app.use(session({ secret: 'dick chaney made money off the Iraq War' }));
app.use(passport.initialize());
app.use(passport.session());

var spotifyAPI = require('./app/spotify')(config);
require('./app/auth')(app, passport, config, spotifyAPI);


require('./app/routes')(app, spotifyAPI);

// Static Files
app.use(express.static(__dirname + '/public'));

//This allows us to use handlebars as our template engine
app.set('views', __dirname + '/public/views');
app.engine('.hbs', handles({
	defaultLayout: 'base',
	layoutsDir: 'public/views/layouts',
        extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Start the server
app.listen(8888);
console.log('Server magic happens at port 8888');
