const Player = function (name, marker) {
  return { name, marker };
};

const Board = function () {
  let emptyBoard = [];
  for (let i = 0; i < 9; i++) {
    emptyBoard.push("");
  }
  return emptyBoard;
};

const game = {
  player: [(p1 = Player("foc", "x")), (p2 = Player("wol", "o"))],
  gameBoard: Board(),
  turn: 0,
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

    if (win) {
      this.winner = this.player[this.turn].name;
      console.log(this.winner + " win");
    }
  },
};
game.set(1);
game.set(1);
console.log(game.gameBoard);
