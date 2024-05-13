"use strict";
document.querySelector("dialog").classList.add("hidden");

// Modules
const createPlayer = function (name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

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
  const score = [0, 0];

  const resetTurn = () => (turn = 0);
  const getTurn = () => turn;
  const switchTurn = () => (turn === 0 ? turn++ : turn--);
  const setStatus = (newStatus) => (status = newStatus);
  const getStatus = () => status;
  const addScore = (winnerIndex) => score[winnerIndex]++;
  const handleDraw = () => console.log("draw");
  const handleWin = () => console.log("win");
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
    addScore,
    handleDraw,
    handleWin,
  };
})();

const domHandler = (function () {
  const cells = document.querySelectorAll(".cell");
  const render = () => {
    for (const [i, mark] of gameBoard.getBoard().entries()) {
      cells[i].style.backgroundImage = `url(./images/${mark}.png)`;
    }
  };

  // Click listener
  cells.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      gameHandler.inputControl(Number(e.target.getAttribute("id")));
    });
  });

  return { render };
})();

// Procedure control
const gameFlow = (function () {
  // Initialize game
  // TOBE ADDED

  // Each turn controller
  // Play turn will be called by input control that called by click listener
  const playTurn = (position) => {
    if (gameHandler.getStatus() === "over") return;

    // PLayer plyernfo
    const players = [
      createPlayer("player1", "x"),
      createPlayer("player2", "o"),
    ];
    let currentPlayer = players[gameHandler.getTurn()];

    // Main logic
    gameBoard.addMarker(position, currentPlayer.getMarker());
    domHandler.render();
    if (gameBoard.checkWin()) {
      gameHandler.setStatus("over");
      gameHandler.handleWin();
    } else if (gameBoard.checkDraw()) {
      gameHandler.setStatus("over");
      gameHandler.handleDraw();
    } else {
      gameHandler.switchTurn();
    }
  };

  return { playTurn };
})();
