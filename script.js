"use strict";

// Modules
const createPlayer = function (name, marker) {
  let score = 0;
  const getName = () => name;
  const setName = (newName) => (name = newName);
  const getMarker = () => marker;
  const addScore = () => score++;
  const getScore = () => score;
  const resetScore = () => (score = 0);

  return { setName, addScore, getScore, resetScore, getName, getMarker };
};

// Put in global so it dont get affected by game
const players = [createPlayer("player 1", "x"), createPlayer("player 2", "o")];

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
  const handleWin = (currentPlayer, players, winCell) => {
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

// DOM Handler
const domHandler = (function () {
  const cells = document.querySelectorAll(".cell");
  const scores = document.querySelectorAll(".scores");
  const dialog = document.querySelector(".win-notice");
  const newNameModal = document.querySelector(".new-name-modal");
  const modalOverlay = document.querySelector(".modals");
  const p1Name = document.querySelector(".p1-name");
  const p2Name = document.querySelector(".p2-name");
  const p1NewName = document.querySelector(".p1-new");
  const p2NewName = document.querySelector(".p2-new");
  const dialogBtn = document.querySelector(".dialog-btn");
  const showBoardBtn = document.querySelector(".show-board");
  const changeNameBtn = document.querySelector(".change-name");
  const confirmBtn = document.querySelector(".cn-confirm");
  const cancelBtn = document.querySelector(".cn-cancel");
  const startBtn = document.querySelector(".start");
  const restartBtn = document.querySelector(".restart");

  const renderName = () => {
    p1Name.textContent = players[0].getName();
    p2Name.textContent = players[1].getName();
  };

  const renderBoard = (position) => {
    cells[position].textContent = gameBoard.getBoard()[position].toUpperCase();
    cells[position].style.color = "var(--clr-accent)";
    cells[position].style.transform = `rotate(${Math.floor(
      Math.random() * 360 - 180
    )}deg)`;
  };

  const resetBoard = () => {
    for (const cell of cells) {
      cell.textContent = "";
      cell.classList.remove("used-cell");
      cell.style.transform = "rotate(0)";
    }
  };

  const renderScore = (playerArr) => {
    for (const [i, score] of scores.entries()) {
      score.textContent = playerArr[i].getScore();
    }
  };

  const renderDialog = (status, winner) => {
    if (status === "draw") {
      dialog.querySelector(".status").textContent = "DRAW!";
    } else {
      dialog.querySelector(".status").textContent = `${winner
        .getName()
        .toUpperCase()} WINS!`;
    }
    dialog.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  };

  // Click event listeners
  cells.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      gameHandler.inputControl(Number(e.target.getAttribute("id")));
    });
  });

  dialogBtn.addEventListener("click", () => {
    gameFlow.gameInit();
    dialog.classList.add("hidden");
    modalOverlay.classList.add("hidden");
  });

  showBoardBtn.addEventListener("click", () => {
    dialog.classList.add("hidden");
    modalOverlay.classList.add("hidden");
  });

  changeNameBtn.addEventListener("click", () => {
    newNameModal.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  });

  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (p1NewName.value && p2NewName.value) {
      players[0].setName(p1NewName.value);
      players[1].setName(p2NewName.value);
      p1NewName.value = "";
      p2NewName.value = "";
      renderName();
      newNameModal.classList.add("hidden");
      modalOverlay.classList.add("hidden");
    } else {
      alert("New names cannot be empty!");
    }
  });

  cancelBtn.addEventListener("click", () => {
    p1NewName.value = "";
    p2NewName.value = "";
    newNameModal.classList.add("hidden");
    modalOverlay.classList.add("hidden");
  });

  startBtn.addEventListener("click", () => {
    gameFlow.gameInit();
  });

  restartBtn.addEventListener("click", () => {
    gameFlow.gameInit();
    players[0].resetScore();
    players[1].resetScore();
    renderScore(players);
  });

  return { renderDialog, renderBoard, resetBoard, renderScore };
})();

// Procedure control
const gameFlow = (function () {
  // Initialize game
  const gameInit = () => {
    gameBoard.resetBoard();
    gameHandler.resetTurn();
    gameHandler.setStatus("running");
    domHandler.resetBoard();
  };

  // Each turn controller
  // Play turn will be called by input control that called by click listener
  const playTurn = (position) => {
    if (gameHandler.getStatus() === "over") return;

    // PLayer plyernfo

    let currentPlayer = players[gameHandler.getTurn()];

    // Main logic
    gameBoard.addMarker(position, currentPlayer.getMarker());
    domHandler.renderBoard(position);
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
