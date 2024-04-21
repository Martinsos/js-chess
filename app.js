// MVC design pattern: Model - View - Controller.

// Model: data, state, in our case chess board + any info about the game.
//   Imagine if you want to save the game to disk and then load it later.
//   What do you need to save? To be able to completely restore it?
//   That is your data, therefore model.

// View: How we display our program. We take Model and we show it.
//   We can show it in the browser, or in the console, or whatever.

// Controller: the main/core logic. Updates model.

// M ---show---> V ---action---> C ---updates---> M ---> and so on and so on.

// empty or piece? Type of piece and color?

// =============== MODEL LOGIC ============== //

const initialBoard = [
  [{ type: 'rook', color: 'white' },
   { type: 'knight', color: 'white' },
   { type: 'bishop', color: 'white' },
   { type: 'queen', color: 'white' },
   { type: 'king', color: 'white' },
   { type: 'bishop', color: 'white' },
   { type: 'knight', color: 'white' },
   { type: 'rook', color: 'white' },
  ],
  [
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
    {type: 'pawn', color: 'white'},
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
    {type: 'pawn', color: 'black'},
  ],
  [{ type: 'rook', color: 'black' },
   { type: 'knight', color: 'black' },
   { type: 'bishop', color: 'black' },
   { type: 'queen', color: 'black' },
   { type: 'king', color: 'black' },
   { type: 'bishop', color: 'black' },
   { type: 'knight', color: 'black' },
   { type: 'rook', color: 'black' },
  ],
];

const initialGameState = {
  board: initialBoard,
  currentPlayer: 'white'
};

const gameState = initialGameState;  // Model

// ================ VIEW LOGIC (BROWSER) =============== //

const gameBoardElem = document.getElementById("gameboard");
const playerDisplayElem = document.getElementById("player");
const infoDisplayElem = document.getElementById("info-display");

function showGameInBrowser() {
  showBoardInBrowser();
  showPlayerInBrowser();
}

function showBoardInBrowser() {
  const squareElems = [];
  for (let r = 0; r < gameState.board.length; r++) {
    const row = gameState.board[r];
    for (let c = 0; c < row.length; c++) {
      const piece = row[c];

      const squareElem = document.createElement("div");
      squareElem.classList.add("square");
      squareElem.classList.add(isEven(r + c) ? "bright" : "dark");
      if (piece !== null) {
        squareElem.appendChild(pieceToDomElement(piece));
      }

      squareElems.push(squareElem);
    }
  }
  gameBoardElem.replaceChildren(...squareElems);
}

function showPlayerInBrowser() {
  playerDisplayElem.textContent = gameState.currentPlayer;
}

// Takes { type: <string>, color: 'white' | 'black' } and returns a dom element representing this piece.
function pieceToDomElement(piece) {
  let pieceElementHtml = null;

  switch (piece.type) {
    case 'rook': pieceElementHtml = rookElement; break;
    case 'bishop': pieceElementHtml = bishopElement; break;
    case 'knight': pieceElementHtml = knightElement; break;
    case 'queen': pieceElementHtml = queenElement; break;
    case 'king': pieceElementHtml = kingElement; break;
    case 'pawn': pieceElementHtml = pawnElement; break;
    default: throw 'Invalid piece!';
  }

  const pieceElement = createDomElementFromHTML(pieceElementHtml);

  pieceElement.classList.add(piece.color);

  return pieceElement;
}

// ================ VIEW LOGIC (CONSOLE) =============== //

function printGameToConsole() {
  console.log('================');
  printBoardToConsole();
  printTurnToConsole();
}

function printTurnToConsole() {
  console.log(`It is ${gameState.currentPlayer}'s turn.`);
}

function printBoardToConsole() {
  for (let r = 0; r < gameState.board.length; r++) {
    const row = gameState.board[r];
    let rowString = '';
    for (let c = 0; c < row.length; c++) {
      const piece = row[c];
      rowString += piece === null ? ' - ' : pieceToString(piece);
    }
    console.log('[' + r + '] ' + rowString);
  }
}

function pieceToString(piece) {
  let pieceTypeLetter = null;
  switch (piece.type) {
    case 'rook': pieceTypeLetter = 'R'; break;
    case 'bishop': pieceTypeLetter = 'B'; break;
    case 'knight': pieceTypeLetter = 'N'; break;
    case 'queen': pieceTypeLetter = 'Q'; break;
    case 'king': pieceTypeLetter = 'K'; break;
    case 'pawn': pieceTypeLetter = 'P'; break;
    default: throw "Invalid piece!";
  }

  if (piece.color === 'white') {
    pieceTypeLetter = pieceTypeLetter.toUpperCase();
  } else {
    pieceTypeLetter = pieceTypeLetter.toLowerCase();
  }

  return ' ' + pieceTypeLetter + ' ';
}

// ======== CONTROLLER LOGIC ======== //

function movePiece(startRowIdx, startColIdx, endRowIdx, endColIdx) {
  gameState.board[endRowIdx][endColIdx] = gameState.board[startRowIdx][startColIdx];
  gameState.board[startRowIdx][startColIdx] = null;
}

function toggleWhoseTurnItIs() {
  gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
}

// ============ Utility functions ========== //

function isEven (x) {
  return x % 2 === 0;
}

function createDomElementFromHTML(htmlString) {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  let newElement = tempDiv.firstElementChild;
  return newElement;
}

// ========= TOP LEVEL LOGIC ======== //

printGameToConsole();
showGameInBrowser();

movePiece(0, 0, 5, 5);
toggleWhoseTurnItIs();

printGameToConsole();
showGameInBrowser();
