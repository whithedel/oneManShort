var db = require("../models");

var { check, validationResult } = require("express-validator");
// requiring bcrypt so password would be hash before getting into the database
var bcrypt = require('bcrypt');
var saltRounds = 10;

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
        console.log(req.body);
        // Finds the validation errors in this request and wraps them in an object with handy functions
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped())
        //    err(errors, res)
        //    res.render("register", {
        //         title: "Registrationsss",
        //         error: errors.mapped()
        //     });
            return res.status(422).json({ errors: errors.array() });
        } else {
            var bcryptPassword = req.body.password
            bcrypt.hash(bcryptPassword, saltRounds, function(err, hash) {
                // Store hash in your password DB.
                db.User.create({ email: req.body.email, password: hash }).then(function (dbUser) {
                    res.json(dbUser);
                });
              });
              
        }

        
    });
};

function err (errors, res){
    res.render("register", {
        title: "Registrationsss",
        error: errors.mapped()
    });
}