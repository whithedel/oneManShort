// Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// // The API object contains methods for each kind of request we'll make
// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);




// Code to make length and width of board with arrays
const Board = function (rows) {
  var array = [];
  for (var i = 0; i < rows; i++) {
    array.push(new Array(rows));

  }
  return array;
}



var x = `X`
// Creating an object with every board piece
var boardPiece = function (color, col, row, hasPiece) {

  return {
    color: color,
    col: col,
    row: row,
    hasPiece: hasPiece,
    possibleMoves: function () {
      var moves = [];
      // ************************* White Piece Logic **************************
      // if the current piece selected is White
      if (this.color === "White" && this.hasPiece === true) {
        nextRow = this.row += 1;
        rightCol = this.col + 1;
        leftCol = this.col - 1;
        if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === false) {
          // if the square to the right is available then return that square's position
          moves.push([nextRow, rightCol]);
          // if the square to the right is occupied by another white piece
        } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "White") {
          // Can't move
          // return false;
          // if the square to the right is occupied by a black piece
        } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "Black") {
          // if the piece behind the black square is available
          if (gameBoard[nextRow + 1][rightCol + 1].hasPiece === false) {
            // then the white player can jump them.
            moves.push([nextRow + 1, rightCol + 1]);
            // else the piece behind the black piece is occupied
          }
        } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false) {
          // if the square to the left is available then return that square's position
          moves.push([nextRow, leftCol]);
          // if the square to the left is occupied by another white piece
        } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === true && gameBoard[nextRow][leftCol].color === "White") {
          // Can't move;
          // return false;
          // if the square to the left is occupied by a black piece
        } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === true && gameBoard[nextRow][leftCol].color === "Black") {
          // if the piece the behind the black square is available
          if (gameBoard[nextRow + 1][leftCol + 1].hasPiece === false) {
            // then the white player can jump them
            moves.push([nextRow + 1], [leftCol + 1]);
          }
        }
        // ************************* Black Piece Logic **************************
        // if the current piece selected is black
      } else if (this.color === "Black" && this.hasPiece === true) {
        nextRow = this.row -= 1;
        rightCol = this.col + 1;
        leftCol = this.col - 1;

        if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === false) {
          // if the square to the right is available
          moves.push([nextRow, rightCol]);
          // if the square to the right is another black piece
        } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "Black") {

          // Can't move
          // return false;
          // if the square to the right is occupied by a white piece
        } if (gameBoard[nextRow][rightCol] !== undefined && gameBoard[nextRow][rightCol].hasPiece === true && gameBoard[nextRow][rightCol].color === "White") {

          // if the piece behind the white square is available
          if (gameBoard[nextRow + 1][rightCol + 1].hasPiece === false) {
            // then the black player can jump them.
            moves.push([nextRow + 1, rightCol + 1]);
            // else the square behind the white piece is occupied
          }

        } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false) {
          // if the square to the left is available then return the position
          moves.push([nextRow, leftCol]);
          // if the square to the left is occupied by another black piece
        } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false && gameBoard[nextRow][leftCol].color === "Black") {
          // Can't move
          // return false;
          // if the square to the left is occupied by a white piece
        } if (gameBoard[nextRow][leftCol] !== undefined && gameBoard[nextRow][leftCol].hasPiece === false && gameBoard[nextRow][leftCol].color === "White") {
          // if the piece behind the white piece is available
          if (gameBoard[nextRow + 1][leftCol + 1].hasPiece === false) {
            // then the black player can jump them
            moves.push([nextRow + 1, leftCol + 1]);
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
          row[j] = boardPiece(`White`, (j), (i), true);
        }
      }
    } else if (i > 4) {
      for (var k = 0; k < row.length; k++) {
        if (row[k] === `O`) {
          row[k] = boardPiece(`Black`, (k), (i), true);
        }
      }
    } else {
      for (var b = 0; b < row.length; b++) {
        if (row[b] === `O`) {
          row[b] = boardPiece(`Square`, (b), (i), false);
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

    for (var j = 0; j < gameBoard.length; j++) {
      $("#gameboard").append(`<div class=>hello</div>`);
    }
  }
}

console.log(gameBoard);