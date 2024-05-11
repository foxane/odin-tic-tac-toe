"use strict";

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

  const resetBoard = () => (board = Array.from({ length: 9 }, () => null));
  const getBoard = () => board;
  const addMarker = (pos, mark) => {
    if (board[pos]) return;
    board[pos] = mark;
    checkDraw();
    checkWin();
  };
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

const gameController = (function (gameBoard, gameState, player1, player2) {
  // Initialize game
  const startGame = () => {
    gameBoard.resetBoard();
    gameState.setStatus("running");

    console.log("Game Started");
    playTurn();
  };

  const playTurn = () => {
    const currentPlayer = getCurrentPlayer();
    // Call handle input
    gameBoard.addMarker(
      prompt(`${currentPlayer.getName()} move, input marker position:`),
      currentPlayer.getMarker()
    );

    console.log(gameBoard.getBoard());
    if (gameBoard.checkWin()) {
      handleWin(currentPlayer);
    } else if (gameBoard.checkDraw()) {
      handleDraw();
    } else {
      switchTurn();
      playTurn();
    }
  };

  const getCurrentPlayer = () =>
    gameState.getTurn() === 0 ? player1 : player2;
  const switchTurn = () => gameState.switchTurn();

  const handleWin = (winner) => {
    gameState.addScore(winner === player1 ? 0 : 1);
    console.log(
      `${winner.getName()} wins! Score: ${gameState.getScore[0]}-${
        gameState.getScore[1]
      }`
    );
  };

  const handleDraw = () => {
    console.log("It's a draw!");
  };

  // TODO: create handle input to check wether the position selected is valid

  startGame();
})(
  gameBoard,
  gameState,
  createPlayer("Player 1", "x"),
  createPlayer("Player 2", "o")
);
