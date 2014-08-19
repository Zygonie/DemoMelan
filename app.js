/*
 * Module dependencies.
 */
 var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    path = require('path'),
    port = process.env.PORT || 8080,
    http = require('http'),
    url = require('url'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    errorhandler = require('errorhandler'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    fs = require('fs');
 
 /*
  * Route variables
  */
 var userRoutes = require('./routes/user'),
     routes = require('./routes/routes'),
     apiClient = require('./routes/apiClient'),
     apiInterventions = require('./routes/apiInterventions'),
     pass = require('./config/pass');

 /*
  * Database connect 
  */
var credentials = require('./config/mongoCredentials');
var uristring = 'mongodb://' + credentials.user + ':' + credentials.password + '@kahana.mongohq.com:10072/DemoMelan';
var mongoOptions = { db: { safe: true } };
mongoose.connect(uristring, mongoOptions, function (err, res) {
    if (err) {
        console.log('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log('Successfully connected to MongoDB on MongoHQ');
    }
});

/*
 * Former middlewares
 */
var logfile = fs.createWriteStream(__dirname + '/logfile.log', {flags: 'w'});
var app = express();
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan(':remote-addr :remote-user [:date] :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
		{stream: process.stdout}));//{stream: logfile}));// log every request to the console
app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: false })); // pull information from html in POST
app.use(bodyParser.json()); // parse application/json
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));// set the static files location
app.use(errorhandler());

//required for passport
app.use(session({ secret: 'topsecretveryefficientpassword' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/********************** 
 *     Basic pages    *
 *********************/
app.route('/').get(routes.index);
app.route('/home').get(pass.ensureAuthenticated, routes.home);
app.route('/client').get(pass.ensureAuthenticated, routes.client);
app.route('/client/:clientID').get(pass.ensureAuthenticated, routes.client);
app.route('/clientDetails').get(pass.ensureAuthenticated, routes.clientDetails);
app.route('/interventions').get(pass.ensureAuthenticated, routes.interventions);
app.route('/login').get(userRoutes.loginGET)
                   .post(userRoutes.loginPOST);
app.route('/signup').get(userRoutes.signupGET)
                    .post(userRoutes.signupPOST);
app.route('/logout').get(userRoutes.logout);

/****************
 *   API REST   *
 ***************/
app.route('/api/client').get(pass.ensureAuthenticated, apiClient.getClient)
                        .post(pass.ensureAuthenticated, apiClient.createClient);

app.route('/api/interventions').get(pass.ensureAuthenticated, apiInterventions.getInterventions)
                               .post(pass.ensureAuthenticated, apiInterventions.saveIntervention)
                               .delete(pass.ensureAuthenticated, apiInterventions.removeIntervention);

app.route('/api/interventionTypes').get(pass.ensureAuthenticated, apiInterventions.getInterventionTypes)
                                   .post(pass.ensureAuthenticated, apiInterventions.saveInterventionType)
                                   .delete(pass.ensureAuthenticated, apiInterventions.removeInterventionType);


app.listen(app.get('port'));
console.log("Express server listening on port " + app.get('port'));