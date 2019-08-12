// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $registerBtn = $("#register")
var $exampleList = $("#example-list");
var $email = $("#email");
var $startGame = $("#startGame");
var $username = $("#staticUserName");
var $password = $("#inputPassword1");
var $passwordMatch = $("#inputPassword2");
var $gamePieceBlack = $(".Black");
var gamePieceWhite = $(".White");
var $signin = $("#signin");
var $logoutLink = $("#logoutLink");
var $signinCard = $("#signinCard");

// The API object contains methods for each kind of request we'll make
var API = {
    saveExample: function (example) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/examples",
            data: JSON.stringify(example),
        });
    },
    getExamples: function () {
        return $.ajax({
            url: "api/examples",
            type: "GET"
        });
    },
    deleteExample: function (id) {
        return $.ajax({
            url: "api/examples/" + id,
            type: "DELETE"
        });
    }
};
// the userReq object for each kind of request we'll make.
var userReq = {
    saveUser: function (user) {
        return $.ajax({
            type: "POST",
            url: "/register",
            data: user
        })
    },
    
    signin : function (user) {
        console.log("signin : function (user)")
        return $.ajax({
            type: "POST",
            url: "/login",
            data: user
        })
    }
};

// handleFormSignin is call whenever a user tries to signin
var handleFormSignin = function() {
    event.preventDefault();
    var user = {
        email: $email.val().trim(),
        password: $password.val().trim()
    };

    userReq.signin(user).then(function(data){
        console.log('userReq.signin(user).then(function(data){')
        console.log(data)
    })
}

// handleFormRegister is call whenever we submit a new user then saves if in the database.
var handleFormRegister = function () {
    event.preventDefault();
    var user = {
        email: $email.val().trim(),
        password: $password.val().trim(),
        passwordMatch: $passwordMatch.val().trim()
    };
    // if (!(user.email && user.password)) {
    //   alert("You must enter an email and password!");
    //   return;
    // };
    userReq.saveUser(user).then(function (data) {
        if (data !== "undefined" && "errors" in data) {
            obj = data;
            $(".error").empty()
            for (var data in obj) {
                obj[data].forEach(function (result) {
                    var errMsg = result.msg
                    var htmlText = `<div class="alert alert-danger" role="alert">
                            <h1>${errMsg}</h1> 
                          </div>`;
                    $(".error").append(htmlText);
                })
            }
        } else {            
            $.ajax({
                url: "/loginAfterSignUp",
                type: "POST",
                data: data
            }).then(function (data) {
                window.location.href = "http://localhost:3000/";
                
            })
        }
    })

}


// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function () {
    API.getExamples().then(function (data) {
        console.log(data)
        console.log(`123456678788`)
        var $examples = data.map(function (example) {
            console.log(example)
            var $a = $("<a>")
                .text(example.text)
                .attr("href", "/example/" + example.id);
            var $li = $("<li>")
                .attr({
                    class: "list-group-item",
                    "data-id": example.id
                })
                .append($a);
            var $button = $("<button>")
                .addClass("btn btn-danger float-right delete")
                .text("ｘ");
            $li.append($button);
            console.log(JSON.stringify($li))
            return $li;
        });
        $exampleList.empty();
        $exampleList.append($examples);
    });
};
// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
    event.preventDefault();
    var example = {
        text: $exampleText.val().trim(),
        description: $exampleDescription.val().trim()
    };
    if (!(example.text && example.description)) {
        alert("You must enter an example text and description!");
        return;
    }
    API.saveExample(example).then(function () {
        refreshExamples();
    });
    $exampleText.val("");
    $exampleDescription.val("");
};
// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
    var idToDelete = $(this)
        .parent()
        .attr("data-id");
    API.deleteExample(idToDelete).then(function () {
        refreshExamples();
    });
};
// takes in the email form the email input then splits it to take 
//the first index and sets it as the value attr to the username section
var emailInputChange = function () {
    var username = $email.val().trim().split(`@`)[0]
    $username.attr(`value`, username)
}
// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);
// Add event listener to the email input on the registration form. 
$email.change(emailInputChange);
// Add event listener to the register button.
$registerBtn.on("click", handleFormRegister);
// Add event listeners to sinin form
$signin.on("click", handleFormSignin);
// $registerBtn.on("click", renderGameBoard(gameBoard));



////////////////////////////////////////////////////////////




var boardReq = {
    saveBoard: function (gameBoard) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "boardstatus",
            data: JSON.stringify(gameBoard)
        })
    },
    currentBoard: function () {
        return $.ajax({
            type: "GET",
            url: "displayBoard",

        })
    }
}




// Code to make length and width of board with arrays
const Board = function (rows) {
    var array = [];
    for (var i = 0; i < rows; i++) {
        array.push(new Array(rows));

    }
    return array;
}

var user1 = "Jack";
var user2 = "Jill";

var x = `X`
// Creating an object with every board piece
var boardPiece = function (color, row, col, hasPiece, user, isKing) {

    return {
        color: color,
        row: row,
        col: col,
        hasPiece: hasPiece,
        user: user,
        isKing: isKing,
        crownMe: function (isKing, color, row) {
            // 
        },
        possibleMoves: function () {
            var moves = [];
            // ************************* White Piece Logic **************************
            // if the current piece selected is White
            if (this.color === "White" && this.hasPiece === true) {
                nextRow = this.row + 1;
                rightCol = this.col + 1;
                leftCol = this.col - 1;
                if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === false) {
                    // if the square to the right is available then return that square's position
                    moves.push(nextRow, rightCol);
                    // if the square to the right is occupied by another white piece
                } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "White") {
                    // Can't move
                    // return false;
                    // if the square to the right is occupied by a black piece
                } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "Black") {
                    // if the piece behind the black square is available
                    if (gameBoard[nextRow + 1][rightCol + 1].hasPiece === false) {
                        // then the white player can jump them.
                        moves.push(nextRow + 1, rightCol + 1);
                        // else the piece behind the black piece is occupied
                    }
                } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false) {
                    // if the square to the left is available then return that square's position
                    moves.push(nextRow, leftCol);
                    // if the square to the left is occupied by another white piece
                } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === true && gameBoard[nextRow][leftCol].color === "White") {
                    // Can't move;
                    // return false;
                    // if the square to the left is occupied by a black piece
                } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === true && gameBoard[nextRow][leftCol].color === "Black") {
                    // if the piece the behind the black square is available
                    if (gameBoard[nextRow + 1][leftCol + 1].hasPiece === false) {
                        // then the white player can jump them
                        moves.push(nextRow + 1, leftCol + 1);
                    }
                }
                // ************************* Black Piece Logic **************************
                // if the current piece selected is black
            } else if (this.color === "Black" && this.hasPiece === true) {
                nextRow = this.row - 1;
                rightCol = this.col + 1;
                leftCol = this.col - 1;

                if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === false) {
                    // if the square to the right is available
                    moves.push(nextRow, rightCol);
                    // if the square to the right is another black piece
                } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "Black") {

                    // Can't move
                    // return false;
                    // if the square to the right is occupied by a white piece
                } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "White") {

                    // if the piece behind the white square is available
                    if (gameBoard[nextRow + 1][rightCol + 1].hasPiece === false) {
                        // then the black player can jump them.
                        moves.push(nextRow + 1, rightCol + 1);
                        // else the square behind the white piece is occupied
                    }

                } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false) {
                    // if the square to the left is available then return the position
                    moves.push(nextRow, leftCol);
                    // if the square to the left is occupied by another black piece
                } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false && gameBoard[nextRow][leftCol].color === "Black") {
                    // Can't move
                    // return false;
                    // if the square to the left is occupied by a white piece
                } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false && gameBoard[nextRow][leftCol].color === "White") {
                    // if the piece behind the white piece is available
                    if (gameBoard[nextRow + 1][leftCol + 1].hasPiece === false) {
                        // then the black player can jump them
                        moves.push(nextRow + 1, leftCol + 1);
                        // else the square behind the white piece is occipied
                    }
                }
            }

            return moves;
        }
    }
}


// Code to make checker like pattern with X' and O's
function fill(array) {
    for (var i = 0; i < array.length; i++) {
        var row = array[i];
        if (i % 2 === 0) {
            for (var j = 0; j < row.length; j += 2) {
                row[j] = x;
                for (var k = 1; k < row.length; k += 2) {
                    row[k] = `O`;
                }
            }
        } else {
            for (var j = 0; j < row.length; j += 2) {
                row[j] = `O`;
                for (var k = 1; k < row.length; k += 2) {
                    row[k] = x;
                }
            }
        }

    }
    // Callback function
    return gamePieceSetup(array)
}
// Code to loop thru the game board and add the 24 pieces. 12 White 12 Black.
function gamePieceSetup(array) {
    for (var i = 0; i < array.length; i++) {
        var row = array[i];
        if (i < 3) {
            for (var j = 0; j < row.length; j++) {

                if (row[j] === `O${[]}`) {
                    row[j] = boardPiece(`White`, (i), (j), true, user1, false);
                }
            }
        } else if (i > 4) {
            for (var k = 0; k < row.length; k++) {
                if (row[k] === `O`) {
                    row[k] = boardPiece(`Black`, (i), (k), true, user2, false);
                }
            }
        } else {
            for (var b = 0; b < row.length; b++) {
                if (row[b] === `O`) {
                    row[b] = boardPiece(`Square`, (i), (b), false);
                }
            }
        }
    }

    return array
}
var gameBoard = fill(Board(8));

var whites = 0;
var blacks = 0;
var squares = 0;


// Count how mant white pieces on the board
let whitesCounter = function () {

    for (var i = 0; i < gameBoard.length; i++) {

        for (var j = 0; j < gameBoard.length; j++) {

            if (gameBoard[i][j].color === "White") {
                whites += 1;
            }
        }
    }
    return whites;
}();

// Count how many black pieces on the board
let blacksCounter = function () {

    for (var i = 0; i < gameBoard.length; i++) {

        for (var j = 0; j < gameBoard.length; j++) {

            if (gameBoard[i][j].color === "Black") {
                blacks += 1;
            }
        }
    }
    return blacks;
}();

let squaresCounter = function () {
    for (var i = 0; i < gameBoard.length; i++) {

        for (var j = 0; j < gameBoard.length; j++) {

            if (gameBoard[i][j].color === "Square") {
                squares += 1;
            }
        }
    }
    return squares;
}();

function renderGameBoard(gameBoard) {
    for (var i = 0; i < gameBoard.length; i++) {
        var row = $("<tr>");

        for (var j = 0; j < gameBoard.length; j++) {

            $(row).append(`<td id='${i}${j}' class='tile ${gameBoard[i][j].color} text-center mx-3'data-row='${i}' data-col='${j}'>${gameBoard[i][j].user}</td>`);
            // Ajax here
            var gameBoardDB = {
                color: gameBoard[i][j].color,
                positionX: j,
                positionY: i,
                user: gameBoard[i][j].user,
                isKing: gameBoard[i][j].isKing,
                hasPiece: gameBoard[i][j].hasPiece
            }

            // boardReq.saveBoard(gameBoardDB).then(function (data) {
            //     console.log(data);
            // })


        }

           $("tbody").append(row)

    }

}

var handleStartGame = function () {
    event.preventDefault();
    boardReq.currentBoard().then(function (data) {
        console.log(data)
        // console.log(data[0].id)
        // console.log(typeof data)
       
            var board = []
            for (var i = 0; i < 64; i += 8) {
                board.push(data.slice(i, i + 8))
            }
            console.log(board)
        for (var i = 0; i < board.length; i++) {
            var row = $("<tr>");

            for (var j = 0; j < board.length; j++) {

                $(row).append(`<td id='${i}${j}' class='tile ${board[i][j].color} text-center mx-3'data-row='${i}' data-col='${j}'>${board[i][j].user}</td>`);
                // Ajax here
                var boardDB = {
                    color: board[i][j].color,
                    positionX: j,
                    positionY: i,
                    user: board[i][j].user,
                    isKing: board[i][j].isKing,
                    hasPiece: board[i][j].hasPiece
                }

                // boardReq.saveBoard(gameBoardDB).then(function (data) {
                //     console.log(data);
                // })


            }

              $("tbody").append(row)

        }
        

        // for (var i = 0; i < data.length; i++) {
       
        //     console.log(data[i].id)
            

        //     if ((data[i].id % 8 === 0 || data[i].id === 1) && (data.id !== 64)) {
        //         var row = $("<tr>");
                
                    
                
        //         $("tbody").append(row);
        //     } else if (data[i].id < 65) {
        //         $(row).append(`<td id='${positionY}${positionX}' class='tile ${color} text-center mx-3'data-row='${positionY}' data-col='${positionX}'>${user}</td>`);
        //     }
            
            
        // }
    })
};

$(document).on("click", ".tile", (event) => {
    var id = event.target.id;
    var row = $(`#${id}`).attr(`data-row`)
    var col = $(`#${id}`).attr(`data-col`)
    console.log(row, col);
    console.log(this.window.gameBoard[row][col]);
    var gamePiece = this.window.gameBoard[row][col];
    var moves = gamePiece.possibleMoves();
    selectMoves(moves,gamePiece)
    // console.log(moves)
    
})

// $(document).ready(renderGameBoard(gameBoard));
$startGame.on("click", handleStartGame);
//renderGameBoard(gameBoard);


//
function selectMoves(moves,gamePiece){
    var move1
    var move2
    var hasBeenClick = false;
    if (moves.length !== 0 ) {
        console.log(moves);
        if (moves.length === 2){
            $(`td`).removeClass("bg-warning")
            $(`#${moves.toString().replace(",","")}`).addClass("bg-warning")
        } else if (moves.length >= 4 ) {
            move1 = [moves[0],moves[1]].toString().replace(",","");
            move2 = [moves[2],moves[3]].toString().replace(",","");

            $(`td`).removeClass("bg-warning")
            $(`td`).removeClass("bg-warning")
            $(`#${move1}`).addClass("bg-warning")
            $(`#${move2}`).addClass("bg-warning")
        }

        ///setting up variable 
        var id = event.target.id;
        var row = $(`#${id}`).attr(`data-row`)
        var col = $(`#${id}`).attr(`data-col`)
        var newGamePiece = this.window.gameBoard[row][col]

        $(`#${move1}`).on(`click`, function (event) {
            
            console.log(`thisobj`)
            console.log(event)
        })
        
    }
}

function movePiece(move1, move2){
    var $move1 = $(`#${move1}`)
    var $move2 = $(`#${move2}`)

    $move1.on(`click`, function (event) {
        ///setting up variable 
        
        var id = event.target.id;
        var row = $(`#${id}`).attr(`data-row`)
        var col = $(`#${id}`).attr(`data-col`)
        var newGamePiece = this.window.gameBoard[row][col]
        console.log(`thisobj`)
        console.log(id)
    })
}