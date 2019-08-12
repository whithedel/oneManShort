var db = require("../models");

module.exports = function (app) {
    app.get("/checkers", authenticationMiddleware(), function (req, res) {
        console.log("i got called all");
        db.Board.findAll({}).then(function (dbBoard) {
            res.render("gameBoard", {
                user: true
            });
        });
    });

    app.get("/displayBoard", function (req, res) {
        console.log("i got called all");
        db.Board.findAll({
            order: [["positionY", "asc"], ["positionX", "ASC"]]
        }).then(function (dbBoard) {
            res.json(dbBoard);
        });
    });

    app.post("/boardstatus", function (req, res) {
        console.log("req information");
        db.Board.create(req.body).then(function (dbBoard) {
            res.json(dbBoard);
        });
    });
};



function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/register')
    }
}
// color: req.body.color,
// positionX: req.body.positionX,
// positionY: req.body.positionY,
// user: req.body.user,
// isKing: req.body.isKing,
// hasPiece: req.body.hasPiece
