const Player = function (name, marker) {
  const setName = function (newName) {
    name = newName;
  };
  return { name, marker, setName };
};

const Board = function () {
  let emptyBoard = [];
  for (let i = 0; i < 9; i++) {
    emptyBoard.push("");
  }
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
  const set = function (pos) {
    if (this.gameBoard[pos]) return;
    this.gameBoard[pos] = this.player[this.turn].marker;
  };
  const checkWinner = function () {
    for (let i = 0; i < this.winCon.length; i++) {
      const condition = this.winCon[i];
      const [a, b, c] = [
        this.gameBoard[condition[0]],
        this.gameBoard[condition[1]],
        this.gameBoard[condition[2]],
      ];
      if (a === b && b === c) {
        win = true;
      }
    }
    // Found winner
    if (win) {
      this.winner = this.player[this.turn].name;
      console.log(this.winner + " win");
      this.state = "over";
    } else if (!this.gameBoard.includes("")) {
      this.state = "draw";
    }
  };
  return { emptyBoard, winCon, set, checkWinner };
};

const State = function () {
  const status = "running";
  const winner = "";
  const turn = 0;
  return { status, winner, turn };
};

const players = [Player("player1", "x"), Player("player2", "o")];
const board = Board();
const state = State();
console.log(board);
console.log(state);
console.log(players[1]);

/* 
(function () {
  const game = {
    player: [(p1 = Player("foc", "x")), (p2 = Player("wol", "o"))],
    gameBoard: Board(),
    turn: 0,
    state: "running",
    winner: "",
    winCon: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ],
    reset: function () {
      this.turn = 0;
      this.winner = "";
      this.gameBoard = Board();
      this.state = "running";
    },
    set: function (pos) {
      if (this.gameBoard[pos]) return;
      this.gameBoard[pos] = this.player[this.turn].marker;
      this.turn ? this.turn-- : this.turn++;
    },
    checkWinner: function () {
      let win = false;

      for (let i = 0; i < this.winCon.length; i++) {
        const condition = this.winCon[i];
        const [a, b, c] = [
          this.gameBoard[condition[0]],
          this.gameBoard[condition[1]],
          this.gameBoard[condition[2]],
        ];
        if (a === "" || b === "" || c === "") {
          continue;
        }
        if (a === b && b === c) {
          win = true;
        }
      }
      // Found winner
      if (win) {
        this.winner = this.player[this.turn].name;
        console.log(this.winner + " win");
        this.state = "over";
      } else if (!this.gameBoard.includes("")) {
        this.state = "draw";
      }
    },
  };
  const dom = {};
})();
 */
