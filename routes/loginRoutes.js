var db = require("../models");
// Authentication package
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

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
          }
          if (err || !user) {
            var error = new Error("Wrong email or password.");
            error.status = 401;
            return done(err);
          }
        });
      });
    })
  );

  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }),
    function(req, res) {
      db.User.update({ status: "active" }, { where: req.user });
      console.log("try to redirect");
      res.redirect("/");
    }
  );
};
