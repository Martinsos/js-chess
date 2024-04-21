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
  currentPlayer: 'white',
  infoMessage: null
};

const gameState = initialGameState;  // Model

// ================ VIEW LOGIC (BROWSER) =============== //

const gameBoardElem = document.getElementById("gameboard");
const playerDisplayElem = document.getElementById("player");
const infoDisplayElem = document.getElementById("info-display");

function showGameInBrowser() {
  showBoardInBrowser();
  showPlayerInBrowser();
  showInfoMessageInBrowser();
}

function showInfoMessageInBrowser() {
  infoDisplayElem.textContent = gameState.infoMessage;
}

let draggedPieceCurrentRowAndCol = null; // { r, c }

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

      squareElem.addEventListener("dragstart", (event) => {});
      squareElem.addEventListener("dragover", (event) => {
        event.preventDefault();
        draggedPieceCurrentRowAndCol = { r, c };
      });
      squareElem.addEventListener("dragend", (event) => {
        event.preventDefault();
        // TODO: This is not the best solution, as it puts piece at last square it moved over
        //   even if it wasn't dropped at that square but e.g. outside of board.
        //   But I coulnd't get 'drop' event to trigger, so this is how I got it working for now.
        //   I should instead get this working via 'drop' event.
        performMove(r, c, draggedPieceCurrentRowAndCol.r, draggedPieceCurrentRowAndCol.c);
      });

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
  pieceElement.setAttribute('draggable', true);

  return pieceElement;
}

// ================ VIEW LOGIC (CONSOLE) =============== //

function printGameToConsole() {
  console.log('================');
  printBoardToConsole();
  printTurnToConsole();
  printInfoMessageToConsole();
}

function printInfoMessageToConsole() {
  if (gameState.infoMessage) {
    console.log('INFO: ', gameState.infoMessage);
  }
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

function performMove(startRowIdx, startColIdx, endRowIdx, endColIdx) {
  const moveValidity = checkIfMoveIsValid(startRowIdx, startColIdx, endRowIdx, endColIdx);
  if (moveValidity === true) {
    gameState.infoMessage = null;
    movePiece(startRowIdx, startColIdx, endRowIdx, endColIdx);
    toggleWhoseTurnItIs();
  } else {
    gameState.infoMessage = moveValidity.error;
  }
  // TODO: Check if game is over, and if so do something about it.
  showGameInBrowser();
  printGameToConsole();
}

// If move is valid, return true.
// If move is invalid, return { error: <string> }.
function checkIfMoveIsValid(startRowIdx, startColIdx, endRowIdx, endColIdx) {
  const piece = gameState.board[startRowIdx][startColIdx];

  if (piece.color !== gameState.currentPlayer) {
    return { error: "It's not your turn" };
  }

  // TODO: Add all the rules! There will be a lot of them.

  return true;
}

function movePiece(startRowIdx, startColIdx, endRowIdx, endColIdx) {
  const piece = gameState.board[startRowIdx][startColIdx];
  gameState.board[startRowIdx][startColIdx] = null;
  gameState.board[endRowIdx][endColIdx] = piece;
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

showGameInBrowser();
printGameToConsole();
