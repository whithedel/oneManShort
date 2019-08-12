var db = require("../models");
// Authentication package
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
var LocalStrategy = require("passport-local").Strategy;

module.exports = function(app) {
  passport.use(
    "local",
    new LocalStrategy(function(username, password, done) {
      console.log("LocalStrategy(function (username, password, done)");
      console.log(username);
      console.log(password);
      db.User.findOne({ where: { email: username } }).then(function(user) {
        var userId = { id: user.dataValues.id };
        var hash = user.dataValues.password;
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(password, hash, function(err, res) {
          if (res === true) {
            return done(null, userId);
          } else {
            return done(null, false);
          }
        });
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: "Incorrect password." });
        // }
        // return done(null, "false");
      });
    })
  );

  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login" }),
    function(req, res) {
      console.log("try to redirect");
      res.redirect("/");
    }
  );
};
