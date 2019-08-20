var db = require("../models");
var { check, validationResult } = require("express-validator");
// requiring bcrypt so password would be hash before getting into the database
var bcrypt = require('bcrypt');
var saltRounds = 10;
// Authentication package
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var moment = require('moment');


module.exports = function (app) {
    // Adding new user to the database.
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
                }).catch(function (err) {
                    if (err) {
                        err = { errors: [{ msg: 'You currently have an account with us already please use that account to sign in thank you.' }] }
                        return res.json(err)
                    }
                });
            });

        }

    });
    app.post("/loginAfterSignUp", function (req, res) {
        db.User.findOne({ where: { email: req.body.email } }, { fields: ["id"] }).then(function (dbUserFindOne) {
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


    app.get("/logout", function (req, res) {
        var dateTime = moment().format();
        db.User.update({
             status: "inactive",
             lastLogin: dateTime
            }, { 
                where: req.user 
            })
        req.logout();
        req.session.destroy(function (err) {
            res.redirect("/");
        });

    });
};

passport.serializeUser(function (userId, done) {
    done(null, userId);
});

passport.deserializeUser(function (userId, done) {
    db.User.findOne({ where: userId }).then(function (user) {
        var userId = { id: user.get().id }
        done(null, userId);
    });
});
