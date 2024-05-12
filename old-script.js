"use strict";
document.querySelector("dialog").classList.toggle("hidden");
// Dom
const DOM = (function () {
  const cells = document.querySelectorAll(".cell");
  const render = () => {
    for (const [i, cell] of cells.entries()) {
      cell.style.backgroundImage = `url(./images/${board[i]}.png)`;
    }
  };
  return { render };
})();

// PLayer
const createPlayer = function (name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

// Board
const gameBoard = (function () {
  let board;
  const WINCON = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const resetBoard = () => (board = Array.from({ length: 9 }, () => null));
  const getBoard = () => board;
  const addMarker = (pos, mark) => (board[pos] = mark);
  const checkDraw = () => board.every((el) => el !== null);
  const checkWin = () => {
    for (const [a, b, c] of WINCON) {
      if (
        board[a] !== null && // Empty cell wont be counted
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return true;
      }
    }
    return false;
  };

  return { resetBoard, getBoard, addMarker, checkDraw, checkWin };
})();

// Overall state
const gameState = (function () {
  const score = [0, 0];
  let status = "running";
  let turn = 0;

  const getTurn = () => turn;
  const switchTurn = () => (turn === 0 ? turn++ : turn--);
  const addScore = (winner) => score[winner]++;
  const getScore = () => score;
  const setStatus = (newStatus) => (status = newStatus);

  return { getTurn, addScore, switchTurn, setStatus, getScore };
})();

// TODO: uncomment below code
const gameController = (function (gameBoard, gameState, DOM, player1, player2) {
  // Module functions
  const handleOutput = () => console.log(gameBoard.getBoard());
  const handleWin = (player) => {
    console.log(`${player} wins!`);
    gameState.setStatus("over");
    handleGameOver();
  };
  const handleDraw = () => {
    console.log(`Draw!`);
    handleGameOver();
  };
  const handleGameOver = () => {
    if (confirm("Play Again?")) {
      startGame();
    } else {
      return;
    }
  };

  // Initialize Game
  const startGame = () => {
    gameBoard.resetBoard();
    gameState.setStatus("running");
    gameState.getTurn() === 0 ? "" : gameState.switchTurn();
    // To be filled with dom

    inputHandler();
  };

  const inputHandler = function () {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", function () {
        if (gameBoard.getBoard()[cell.getAttribute("id")] === null) {
          playTurn(Number(cell.getAttribute("id")));
        } else {
          console.log("clicked is null");
        }
      });
    });
  };

  const playTurn = (position) => {
    const currentPlayer = gameState.getTurn() === 0 ? player1 : player2;
    gameBoard.addMarker(position, currentPlayer.getMarker());

    // Render board
    handleOutput();
    if (gameBoard.checkWin()) {
      // Dom win
      handleWin(currentPlayer.getName());
    } else if (gameBoard.checkDraw()) {
      handleDraw();
    } else {
      gameState.switchTurn();
      inputHandler();
    }
  };

  startGame();
})(
  gameBoard,
  gameState,
  DOM,
  createPlayer("Player 1", "x"),
  createPlayer("Player 2", "o")
);
