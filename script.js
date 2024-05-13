"use strict";

// Modules
const createPlayer = function (name, marker) {
  let score = 0;
  const getName = () => name;
  const getMarker = () => marker;
  const addScore = () => score++;
  const getScore = () => score;

  return { addScore, getScore, getName, getMarker };
};

// Put in global so it dont get affected by game
const players = [createPlayer("player1", "x"), createPlayer("player2", "o")];

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

  // Gameboard methods
  const getBoard = () => board;
  const resetBoard = () => (board = Array.from({ length: 9 }, () => null));
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

  resetBoard();
  return { getBoard, resetBoard, addMarker, checkDraw, checkDraw, checkWin };
})();

const gameHandler = (function () {
  // PLayer will be indexed based on turn
  let turn = 0;
  let status = "running";

  const resetTurn = () => (turn = 0);
  const getTurn = () => turn;
  const switchTurn = () => (turn === 0 ? turn++ : turn--);
  const setStatus = (newStatus) => (status = newStatus);
  const getStatus = () => status;
  const handleDraw = () => {
    domHandler.renderDialog("draw");
  };
  const handleWin = (currentPlayer, players) => {
    currentPlayer.addScore();
    domHandler.renderScore(players);
    domHandler.renderDialog("win", currentPlayer);
  };
  const inputControl = (position) => {
    if (gameBoard.getBoard()[position] === null) {
      gameFlow.playTurn(position);
    }
  };

  return {
    inputControl,
    resetTurn,
    switchTurn,
    getTurn,
    setStatus,
    getStatus,
    handleDraw,
    handleWin,
  };
})();

const domHandler = (function () {
  const cells = document.querySelectorAll(".cell");
  const scores = document.querySelectorAll(".score");
  const dialog = document.querySelector("dialog");
  const renderBoard = () => {
    for (const [i, mark] of gameBoard.getBoard().entries()) {
      cells[i].textContent = mark;
    }
  };
  const renderScore = (playerArr) => {
    for (const [i, score] of scores.entries()) {
      score.textContent = playerArr[i].getScore();
      console.log(playerArr[i].getScore());
    }
  };
  const renderDialog = (status, winner) => {
    if (status === "draw") {
      document.querySelector("#status").textContent = "DRAW!";
    } else {
      document.querySelector("#status").textContent = `${winner
        .getName()
        .toUpperCase()} WINS!`;
    }
    dialog.classList.remove("hidden");
  };

  // Click listener
  cells.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      gameHandler.inputControl(Number(e.target.getAttribute("id")));
    });
  });
  document.querySelector("#dialog-btn").addEventListener("click", () => {
    gameFlow.gameInit();
    dialog.classList.add("hidden");
  });
  dialog.addEventListener("click", () => {
    gameFlow.gameInit();
    dialog.classList.add("hidden");
  });

  return { renderDialog, renderBoard, renderScore };
})();

// Procedure control
const gameFlow = (function () {
  // Initialize game
  const gameInit = () => {
    gameBoard.resetBoard();
    gameHandler.resetTurn();
    gameHandler.setStatus("running");
    domHandler.renderBoard();
  };

  // Each turn controller
  // Play turn will be called by input control that called by click listener
  const playTurn = (position) => {
    if (gameHandler.getStatus() === "over") return;

    // PLayer plyernfo

    let currentPlayer = players[gameHandler.getTurn()];

    // Main logic
    gameBoard.addMarker(position, currentPlayer.getMarker());
    domHandler.renderBoard();
    if (gameBoard.checkWin()) {
      gameHandler.setStatus("over");
      gameHandler.handleWin(currentPlayer, players);
    } else if (gameBoard.checkDraw()) {
      gameHandler.setStatus("over");
      gameHandler.handleDraw();
    } else {
      gameHandler.switchTurn();
    }
  };

  return { gameInit, playTurn };
})();
