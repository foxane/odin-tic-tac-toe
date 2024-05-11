# Assignment

1. Set up your project with HTML, CSS and Javascript files and get the Git repo all set up.

2. You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects, and you’re probably going to want an object to control the flow of the game itself.

   - Your main goal here is to have as little global code as possible. Try tucking as much as you can inside factories. If you only need a single instance of something (e.g. the gameboard, the displayController etc.) then wrap the factory inside an IIFE (module pattern) so it cannot be reused to create additional instances.

   - In this project, think carefully about where each bit of logic should reside. Each little piece of functionality should be able to fit in the game, player or gameboard objects. Take care to put them in “logical” places. Spending a little time brainstorming here can make your life much easier later!

   - If you’re having trouble, Building a house from the inside out is a great article that lays out a highly applicable example both of how you might approach tackling this project as well as how you might
     organize and structure your code.

3. Focus on getting a working game in the console first. Make sure you include logic that checks for when the game is over! You should be checking for all winning 3-in-a-rows and ties. Try to avoid thinking about the DOM and your HTML/CSS until your game is working.

4. Once you have a working console game, create an object that will handle the display/DOM logic. Write a function that will render the contents of the gameboard array to the webpage (for now, you can always just fill the gameboard array with "X"s and "O"s just to see what’s going on).

5. Write the functions that allow players to add marks to a specific spot on the board by interacting with the appropriate DOM elements (e.g. letting players click on a board square to place their marker). Don’t forget the logic that keeps players from playing in spots that are already taken!

6. Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that shows the results upon game end!

```
const gameController = (function (gameBoard, gameState, player1, player2) {
  const startGame = () => {
    gameBoard.resetBoard();
    gameState.changeStatus("running");
    gameState.changeTurn(0); // Assuming player 1 starts first
    // Additional initialization logic if needed
    console.log("Game started!");
    // Optional: Display initial game status to players
    // displayGameStatus();
    playTurn();
  };

  const playTurn = () => {
    const currentPlayer = getCurrentPlayer();
    // Optional: Display current player's turn to players
    // displayPlayerTurn(currentPlayer);
    // Wait for player input or handle AI move
    // For simplicity, assuming manual input in this example
    // handlePlayerInput();
    // After player makes move, update game board
    // updateGameBoard();
    // Check for win/draw conditions
    if (gameBoard.checkWin()) {
      handleWin(currentPlayer);
    } else if (gameBoard.checkDraw()) {
      handleDraw();
    } else {
      // If game is still ongoing, switch turns and continue
      switchTurn();
      playTurn();
    }
  };

  const getCurrentPlayer = () => (gameState.getTurn() === 0 ? player1 : player2);

  const switchTurn = () => gameState.changeTurn();

  const handleWin = (winner) => {
    gameState.addScore(winner === player1 ? 0 : 1);
    // Display win message and update score
    console.log(`${winner.getName()} wins! Score: ${gameState.score[0]}-${gameState.score[1]}`);
    // Ask players if they want to play again or exit
    // handlePlayAgain();
  };

  const handleDraw = () => {
    // Display draw message
    console.log("It's a draw!");
    // Ask players if they want to play again or exit
    // handlePlayAgain();
  };

  // Additional functions for user input handling, displaying game status, etc. can be added here

  return { startGame };
})(gameBoard, gameState, createPlayer("Player 1", "X"), createPlayer("Player 2", "O"));

// Start the game
gameController.startGame();
```
