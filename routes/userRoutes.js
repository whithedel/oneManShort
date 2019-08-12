var db = require("../models");
var { check, validationResult } = require("express-validator");
// requiring bcrypt so password would be hash before getting into the database
var bcrypt = require('bcrypt');
var saltRounds = 10;
// Authentication package
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;


module.exports = function (app) {
    // Adding new user to the database.
    //   app.post("/register", function(req, res) {
    //     console.log(req.body);
    //     db.User.create(req.body).then(function(dbUser) {
    //       res.json(dbUser);
    //     });
    //   });
    app.post("/register", [
        // email must be an email
        check("email", "Email field cannot be empty").not().isEmpty(),
        check("email", "Invalid email please verify the email address you have provided").isEmail(),
        check("email", "Email address must be between 4-100 characters long, please try again").isLength({ min: 5, max: 100 }),
        // password must be at least 5 chars long
        check("password", "Password must be between 8-100 characters long").isLength({ min: 8, max: 100 }),
        check("password", "Password must include one lowercase character, one uppercase character,and a number.").matches(("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})")),
        check("password").custom(function (value, { req }) {
            if (value !== req.body.passwordMatch) {
                throw new Error("Password confirmation is incorrect, please try again");
            } else return true;
        })
    ], function (req, res) {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        var errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.json(errors)

        } else {
            var bcryptPassword = req.body.password
            bcrypt.hash(bcryptPassword, saltRounds, function (err, hash) {
                if (err) {
                    console.log(err)
                    throw err;
                }
                // Store hash in your password DB.
                db.User.create({ email: req.body.email, password: hash }).then(function (dbUser) {
                    res.json(dbUser);
                });
            });

        }

    });
    app.post("/loginAfterSignUp", function (req, res) {
        db.User.findOne({ where: { email: req.body.email } }, { fields: ['id'] }).then(function (dbUserFindOne) {
            var userId = { id: dbUserFindOne.dataValues.id }
            req.login(userId, function (error) {
                if (error) {
                    console.log(`err obj : ${error}`)
                    res.send(error)
                } else {
                    console.log(req.user.id)
                    res.end()
                }

            })
        })
    })

    app.get("/login", function (req, res) {
        res.render("login")
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            console.log('try to redirect')
            res.redirect('/');
        });

    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            res.redirect('/');
        });

    });
    //     app.post('/login', 
    //   passport.authenticate('local', { failureRedirect: '/login' }),
    //   function(req, res) {
    //     res.redirect('/');
    //   });
};

passport.use(
    new LocalStrategy(function (email, password, done) {
        console.log("LocalStrategy(function (email, password, done)")
        console.log(email);
        console.log(password);
        // User.findOne({ username: username }, function(err, user) {
        //   if (err) {
        //     return done(err);
        //   }
        //   if (!user) {
        //     return done(null, false, { message: "Incorrect username." });
        //   }
        //   if (!user.validPassword(password)) {
        //     return done(null, false, { message: "Incorrect password." });
        //   }
        return done(null, "false");
        // });
    })
);

passport.serializeUser(function (userId, done) {
    console.log(`serializeUser`)
    done(null, userId);
});

passport.deserializeUser(function (userId, done) {
    console.log("passport deserializeuser")
    db.User.findOne({ where: userId }).then(function (user) {
        var userId = { id: user.get().id }
        console.log(userId)
        console.log("passport.deserializeUser")
        done(null, userId);
    });
});



function passStrategy(email, password) {
    passport.use(new LocalStrategy(
        function (email, password, done) {
            console.log(email);
            console.log(password);
            // User.findOne({ username: userEmail }, function (err, user) {
            //     if (err) { return done(err); }
            //     if (!user) { return done(null, false); }
            //     if (!user.verifyPassword(unHashPassword)) { return done(null, false); }
                return done(null, 'user');
            // });
        }
    ));
}
