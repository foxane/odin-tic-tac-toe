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

const moveHandler = (function () {
  const isValid = function (pos) {
    if (gameBoard.getBoard()[pos] === null) {
      return true;
    } else {
      return false;
    }
  };
  return { isValid };
})();

// TODO: uncomment below code
// const gameController = (function (
  gameBoard,
  gameState,
  moveHandler,
  player1,
  player2
) {
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

    playTurn();
  };

  const playTurn = () => {
    const currentPlayer = gameState.getTurn() === 0 ? player1 : player2;
    const movePosition = Number(
      prompt(`${currentPlayer.getName()} turn, input position:`)
    );
    // Input validation,
    moveHandler.isValid(movePosition)
      ? gameBoard.addMarker(movePosition, currentPlayer.getMarker())
      : playTurn();

    // Render board
    handleOutput();
    if (gameBoard.checkWin()) {
      // Dom win
      handleWin(currentPlayer.getName());
    } else if (gameBoard.checkDraw()) {
      handleDraw();
    } else {
      gameState.switchTurn();
      playTurn();
    }
  };

  startGame();
})(
  gameBoard,
  gameState,
  moveHandler,
  createPlayer("Player 1", "x"),
  createPlayer("Player 2", "o")
);
