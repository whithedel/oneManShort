var db = require("../models");
var hb = require('express-handlebars').create();
// Requiring handlebars
var exphbs = require("express-handlebars");
handlebars = require('handlebars');
var express = require("express");
var app = express();
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

module.exports = function (app) {



    app.get("/checkers", function (req, res) {
        console.log("i got called all");
        db.Board.findAll({}).then(function (dbBoard) {
            res.render("gameBoard");
        });
    });

    app.get("/displayBoard", function (req, res) {
        console.log("i got called all");
        db.Board.findAll({}).then(function (dbBoard) {
            res.json(dbBoard);
        });
    });


    app.post("/boardstatus", function (req, res) {
        console.log("req information")
        db.Board.create(req.body).then(function (dbBoard) {
            res.json(dbBoard);
        });
    });

};

// color: req.body.color,
// positionX: req.body.positionX,
// positionY: req.body.positionY,
// user: req.body.user,
// isKing: req.body.isKing,
// hasPiece: req.body.hasPiece