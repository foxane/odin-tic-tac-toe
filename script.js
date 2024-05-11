"use strict";

const createPlayer = function (name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { name, marker, getName, getMarker };
};

const gameboard = (function () {
  let board = Array(9);
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

  const reset = () => (board = Array(9));
  const getBoard = () => board;
  const addMarker = (pos, mark) => (board[pos] = mark);
  const checkDraw = () => board.every((el) => el !== undefined);

  const checkWin = () => {
    for (const [a, b, c] of WINCON) {
      if (
        board[a] !== undefined &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return true;
      }
    }
    return false;
  };

  return { reset, getBoard, addMarker, checkDraw, checkWin };
})();

// const Game = function () {
//   let status = "";
//   const score = [0, 0];
//   let turn = 0;
//   const setStatus = function (newStatus) {
//     status = newStatus;
//   };
//   const addScore = function () {
//     score[turn]++;
//     console.log(score);
//   };
//   const changeTurn = function () {
//     turn === 0 ? turn++ : turn--;
//     console.log(turn);
//   };
//   const resetScore = function () {
//     score = [0, 0];
//   };
//   return { setStatus, addScore, changeTurn, resetScore };
// };
