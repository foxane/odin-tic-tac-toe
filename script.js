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
  const winCon = [
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
  const checkDraw = () => () => board.every((el) => el !== null);
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

  return { getBoard, resetBoard, addMarker, checkDraw, checkDraw, checkWin };
})();

const gameHandler = function () {
  // PLayer will be indexed based on turn
  let turn = 0;
  let status = "running";
  const score = [0, 0];

  const resetTurn = () => (turn = 0);
  const switchTurn = () => (turn === 0 ? turn++ : turn--);
  const setStatus = (newStatus) => (status = newStatus);
  const addScore = (winnerIndex) => score[winnerIndex]++;
  const handleDraw = () => console.log("draw");
  const handleWin = () => console.log("win");

  return { resetTurn, switchTurn, setStatus, addScore, handleDraw, handleWin };
};

const domHandler = function () {
  const cells = document.querySelectorAll(".cell");

  const inputControl = (position, marker) => {
    if (gameBoard.getBoard()[position] === null) {
      gameBoard.addMarker(position, "x");
      render();
      console.log(gameBoard.getBoard());
    }
  };

  const render = () => {
    for (const [i, mark] of gameBoard.getBoard().entries()) {
      cells[i].style.backgroundImage = `url(./images/${mark}.png)`;
    }
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      inputControl(Number(e.target.getAttribute("id")));
    });
  });
};
gameBoard.resetBoard();
domHandler();
