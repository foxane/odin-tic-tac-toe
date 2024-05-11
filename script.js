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
