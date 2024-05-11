"use strict";

const Player = function (name, marker) {
  return { name, marker };
};

const Board = function () {
  const gameBoard = Array(9);
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
  // Untested
  const reset = function () {
    gameBoard = emptyBoard;
  };
  // Working
  const addMarker = function (pos, marker) {
    if (gameBoard[pos]) return;
    gameBoard[pos] = marker;
  };
  // Working
  const checkWin = function () {
    let isWin = false;
    for (let i = 0; i < winCon.length; i++) {
      const condition = winCon[i];
      const a = gameBoard[condition[0]];
      const b = gameBoard[condition[1]];
      const c = gameBoard[condition[2]];
      if (a === undefined || b === undefined || c === undefined) continue;
      if (a === b && b === c) isWin = true;
    }
    return isWin;
  };
  // Working perfectly
  const checkDraw = function () {
    let isDraw = false;
    for (const el of gameBoard) {
      if (el === undefined) {
        isDraw = false;
        break;
      } else {
        isDraw = true;
      }
    }
    return isDraw;
  };
  const debug = function () {
    console.log(gameBoard);
  };
  return { reset, addMarker, checkWin, checkDraw, debug };
};

const Game = function () {
  let status = "";
  const score = [0, 0];
  let turn = 0;
  const setStatus = function (newStatus) {
    status = newStatus;
  };
  const addScore = function () {
    score[turn]++;
    console.log(score);
  };
  const changeTurn = function () {
    turn === 0 ? turn++ : turn--;
    console.log(turn);
  };
  const resetScore = function () {
    score = [0, 0];
  };
  return { setStatus, addScore, changeTurn, resetScore };
};

const DOM = function () {
  const cells = document.querySelectorAll(".cell");
  const render = function () {
    // for (const [i, val] of board.gameBoard.entries()) {
    //   cells[i].innerText = "awdwadal";
    // }
  };
  return { cells, render };
};

const currentGame = (function () {
  const player = [Player("player 1", "x"), Player("player 2", "o")];
  const board = Board();
  const game = Game();
  const dom = DOM();
  const runtime = { ...board, ...game, ...dom };
  runtime.cells.forEach((cell) => {
    cell.addEventListener("click", function () {
      const pos = Number(cell.getAttribute("id"));
      this.addMarker(pos, player[this.turn].marker).bind(this);
    });
  });
  console.log(player[runtime.turn].marker);
})();
