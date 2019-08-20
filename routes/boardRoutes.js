var db = require("../models");

module.exports = function (app) {
    app.get("/checkers", authenticationMiddleware(), function (req, res) {
        console.log("i got called all");
        db.User.findAll({
            where: {
                status: 'active'
            }
        }).then(function (user) {
            var currentUserId = req.user.id
            var activeUsersSet = new Set([])
            var currentUser = ''
            var payload = []
            for (var i = 0; i < user.length; i++) {
                var id = user[i].dataValues.id
                if (id === currentUserId) {
                    currentUser = user[i].dataValues.email.split("@")[0]
                }
            }

            for (var i = 0; i < user.length; i++) {
                var id = user[i].dataValues.id;
                var otherUser = ''
                if (id !== currentUserId) {
                    otherUser = user[i].dataValues.email.split("@")[0]

                    payload.push({
                        otherUser: otherUser,
                        namePair: getNamePair(otherUser, currentUser)
                    })
                }
            }

            res.render("availableUser", {
                thePayLoad: payload,
                user: true
            });

        });
    });

    app.get("/renderGameBoard", function (req, res) {
        res.render("gameBoard")
    })

    app.get("/displayBoard", function (req, res) {
        console.log("i got called all");
        console.log(req.query)
        var currentNamepairId = req.query;
        db.Board.findAll(
            {
                where: currentNamepairId,
                order: [["positionY", "asc"], ["positionX", "ASC"]]
            }).then(function (dbBoard) {
                res.json(dbBoard);
            });
    });

    app.post("/boardstatus", function (req, res) {
        payload = req.body;
        var dataToBeCreated = {}
        var passed = false

        function createThisBoard(dataToBeCreated) {
            db.Board.create(dataToBeCreated)
        }

        db.Board.count({ where: { 'NamepairId': payload.namepairId } }).then(function (count) {
            if (count === 64) {
                res.end()
                return
            } else {
                for (var i = 0; i < payload.gameBoard.length; i++) {
                    var gameBoardInfo = payload.gameBoard[i]
                    for (var j = 0; j < gameBoardInfo.length; j++) {
                        dataToBeCreated = {
                            color: gameBoardInfo[j].color,
                            positionX: j,
                            positionY: i,
                            user: gameBoardInfo[j].user,
                            isKing: gameBoardInfo[j].isKing,
                            hasPiece: gameBoardInfo[j].hasPiece,
                            NamepairId: payload.namepairId
                        }
                        // console.log(dataToBeCreated)
                        createThisBoard(dataToBeCreated)


                        // db.Board.findAndCountAll({ where: {'NamepairId': payload.namepairId} }).then(function (c) {
                        //     console.log(c.count)
                        //     if (c.count === 64 ){
                        //         return 
                        //     } else {
                        //         passed = true
                        //         // console.log(dataToBeCreated)
                        //         createThisBoard (dataToBeCreated)
                        //         // res.json(dataToBeCreated)
                        //     } 

                        //   })
                    }
                }
            }
        })



        res.end()
        // for ( var data in payload){
        //     console.log(payload)
        // }
        // db.Board.create(req.body).then(function (dbBoard) {
        //     res.json(dbBoard);
        // });
    });

};
// color: gameBoard[i][j].color,
// positionX: j,
// positionY: i,
// user: gameBoard[i][j].user,
// isKing: gameBoard[i][j].isKing,
// hasPiece: gameBoard[i][j].hasPiece


function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}


function getNamePair(otherUser, currentUser) {
    var compare = otherUser.localeCompare(currentUser)
    if (compare < 0) {
        return otherUser + '+' + currentUser
    } else {
        return currentUser + '+' + otherUser
    }
}
