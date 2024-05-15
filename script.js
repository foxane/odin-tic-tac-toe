"use strict"; // Idk what this does but why not

/* Most if not all of the modules only return method */

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

// Gameboard handle anything that happens in board, not the UI board, we have UI board at home
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

  const getBoard = () => board;
  const resetBoard = () => (board = Array.from({ length: 9 }, () => null)); // Take every value inside board and turn them into null
  const addMarker = (position, mark) => (board[position] = mark);
  const checkDraw = () => board.every((el) => el !== null); // Check if every value inside array is not null (or marked by player)
  const checkWin = () => {
    for (const [a, b, c] of WINCON) {
      if (
        board[a] !== null && // Null will be ignored
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

// Game handler control overall state of game (players, cell click handler, etc)
const gameHandler = (function () {
  const players = [
    createPlayer("player 1", "x"),
    createPlayer("player 2", "o"),
  ];

  let turn = 0;
  let status = "running";

  const resetTurn = () => (turn = 0);
  const getTurn = () => turn;
  const switchTurn = () => (turn === 0 ? turn++ : turn--);
  const setStatus = (newStatus) => (status = newStatus);
  const getStatus = () => status;
  // Draw and win handler does not do any logic, they only call functions
  const handleDraw = () => {
    domHandler.renderWinModal("draw");
  };
  const handleWin = (currentPlayer, players) => {
    currentPlayer.addScore();
    domHandler.renderScore(players);
    domHandler.renderWinModal("win", currentPlayer);
  };
  const inputControl = (position) => {
    if (gameBoard.getBoard()[position] === null) {
      // Is clicked cell not marked?
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
    players,
  };
})();

// DOM Handler
// yeh yeh yeh dom do this, dom do that. I DOM WHAT I WANT kll me..
const domHandler = (function () {
  const cellElArray = document.querySelectorAll(".cell");
  const scoreElArray = document.querySelectorAll(".scores");
  const winModal = document.querySelector(".win-notice");
  const newNameModal = document.querySelector(".new-name-modal");
  const modalOverlay = document.querySelector(".modals");
  const p1Name = document.querySelector(".p1-name");
  const p2Name = document.querySelector(".p2-name");
  const p1NewName = document.querySelector(".p1-new");
  const p2NewName = document.querySelector(".p2-new");
  const winBtn = document.querySelector(".dialog-btn");
  const showBoardBtn = document.querySelector(".show-board");
  const changeNameBtn = document.querySelector(".change-name");
  const confirmBtn = document.querySelector(".cn-confirm");
  const cancelBtn = document.querySelector(".cn-cancel");
  const startBtn = document.querySelector(".start");
  const restartBtn = document.querySelector(".restart");

  const renderName = () => {
    p1Name.textContent = gameHandler.players[0].getName();
    p2Name.textContent = gameHandler.players[1].getName();
  };

  const renderBoard = (position) => {
    cellElArray[position].textContent = gameBoard
      .getBoard()
      [position].toUpperCase();
    cellElArray[position].style.color = "var(--clr-accent)";
    cellElArray[position].style.transform = `rotate(${Math.floor(
      Math.random() * 360 - 180
    )}deg)`;
  };

  const resetBoard = () => {
    for (let cell of cellElArray) {
      cell.textContent = "";
      cell.classList.remove("used-cell");
      cell.style.transform = "rotate(0)";
      cell.style.color = "transparent";
      gameBoard.resetBoard();
    }
  };

  const renderScore = (playerArr) => {
    for (const [i, score] of scoreElArray.entries()) {
      score.textContent = playerArr[i].getScore();
    }
  };

  const renderWinModal = (status, winner) => {
    if (status === "draw") {
      winModal.querySelector(".status").textContent = "DRAW!";
    } else {
      winModal.querySelector(".status").textContent = `${winner
        .getName()
        .toUpperCase()} WINS!`;
    }
    winModal.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  };

  // Click event listeners
  // Is there better way than doing these? Waiting for your wisdom sir
  cellElArray.forEach((cell) => {
    cell.addEventListener("click", function (e) {
      gameHandler.inputControl(Number(e.target.getAttribute("id")));
    });
  });

  winBtn.addEventListener("click", () => {
    gameFlow.gameInit();
    winModal.classList.add("hidden");
    modalOverlay.classList.add("hidden");
  });

  showBoardBtn.addEventListener("click", () => {
    winModal.classList.add("hidden");
    modalOverlay.classList.add("hidden");
  });

  changeNameBtn.addEventListener("click", () => {
    newNameModal.classList.remove("hidden");
    modalOverlay.classList.remove("hidden");
  });

  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Prevent execute when input is empty
    if (p1NewName.value && p2NewName.value) {
      gameHandler.players[0].setName(p1NewName.value);
      gameHandler.players[1].setName(p2NewName.value);
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
    gameHandler.players[0].resetScore();
    gameHandler.players[1].resetScore();
    renderScore(gameHandler.players);
  });

  return { renderWinModal, renderBoard, resetBoard, renderScore };
})();

// Game Flow
const gameFlow = (function () {
  // Reset all game state except for player array
  const gameInit = () => {
    gameHandler.resetTurn();
    gameHandler.setStatus("running");
    domHandler.resetBoard();
  };

  // Execute each time user clicked valid cell
  const playTurn = (position) => {
    if (gameHandler.getStatus() === "over") return; // Disabled when game is not initialized
    let currentPlayer = gameHandler.players[gameHandler.getTurn()]; // Player is indexed based on turn

    gameBoard.addMarker(position, currentPlayer.getMarker());
    domHandler.renderBoard(position);

    if (gameBoard.checkWin()) {
      gameHandler.setStatus("over");
      gameHandler.handleWin(currentPlayer, gameHandler.players);
    } else if (gameBoard.checkDraw()) {
      gameHandler.setStatus("over");
      gameHandler.handleDraw();
    } else {
      gameHandler.switchTurn();
    }
  };

  return { gameInit, playTurn };
})();

// I thinks that's it, thanks for being here ^^
