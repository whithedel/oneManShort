require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
//random string generator package.
var randomstring = require("randomstring");
// Authentication packages
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MySQLStore = require("express-mysql-session")(session);
var db = require("./models");
var app = express();
var PORT = process.env.PORT || 3000;

var options = {
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DB_DATABASE
};

var sessionStore = new MySQLStore(options);
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());
app.use(
  session({
    secret: randomstring.generate(),
    store: sessionStore,
    resave: false,
    saveUninitialized: false
    //cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/loginRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/namepairRoutes")(app);
require("./routes/apiRoutes")(app);
require("./routes/boardRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };
// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
