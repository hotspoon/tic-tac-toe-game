console.log("C4 game");

// JavaScript logic
let Game = {
  newBoard: function (n) {
    // Creates a new board of n x n filled with marker '.'
    this.board = this.board || Array(n);
    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = Array(n).fill(".");
    }
    // Reset game finish as false and selected player as undefined
    this.finish = false;
    this.lastPlayer = "undefined";
    console.log("newBoard created: " + n + " by " + n);
  },
  winCount: function (n) {
    this.countWin = n;
    console.log("Game of connect " + n);
  },
  addMark: function (playerChosen, row, col) {
    if (playerChosen === this.lastPlayer) {
      console.log("Not your turn");
    } else if (this.board[row][col] === ".") {
      this.board[row][col] = playerChosen;
      this["lastPlayer"] = playerChosen;
      console.log("Player: " + playerChosen + " addMark to row: " + row + ", col: " + col);
    } else {
      console.log("Already marked. Try again.");
    }
  },
  checkRows: function (playerChosen) {
    for (let row = 0; row < this.board.length; row++) {
      let count = 0;
      this.winArray = [];
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("checkRow true on row: " + row);
          this["finish"] = true;
          console.log("Start", row);
          console.log("End", col);
          return true;
        }
      }
    }
  },
  checkCols: function (playerChosen) {
    for (let col = 0; col < this.board.length; col++) {
      let count = 0;
      this.winArray = [];
      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("checkCol true on col " + col);
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  checkDiagLR: function (playerChosen) {
    let count = 0;
    let length = this.board.length;
    this.winArray = [];
    let maxLength = length - this.countWin + 1;
    // Run Bottom Half diagonal Top Left to Bottom Right (incl middle)
    for (let rowStart = 0; rowStart < maxLength; rowStart++) {
      for (let row = rowStart, col = 0; row < length && col < length; row++, col++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TL to BR");
          this["finish"] = true;
          return true;
        }
      }
    }
    // Run Top Half diagonal Top Left to Bottom Right (excl middle)
    for (let colStart = 1; colStart < maxLength; colStart++) {
      for (let col = colStart, row = 0; col < length && row < length; col++, row++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TL to BR");
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  checkDiagRL: function (playerChosen) {
    let count = 0;
    let length = this.board.length;
    let maxLength = length - this.countWin + 1;
    this.winArray = [];
    // Run Bottom half diagonal Top Right to Botom Left (incl middle)
    for (let rowStart = 0; rowStart < maxLength; rowStart++) {
      for (let row = rowStart, col = length - 1; row < length && col >= 0; row++, col--) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TR to BL");
          this["finish"] = true;
          return true;
        }
      }
    }
    // Run Top half diagonal Top Right to Botom Left (excl middle)
    for (let colStart = length - 2; colStart > this.countWin - 2; colStart--) {
      for (let col = colStart, row = 0; col >= 0 && row <= length - 2; col-- && row++) {
        if (this.board[row][col] === playerChosen) {
          count++;
          this.winArray.push(Array(row, col));
        } else {
          count = 0;
          this.winArray = [];
        }
        if (count === this.countWin) {
          console.log("Win diagonal TR to BL");
          this["finish"] = true;
          return true;
        }
      }
    }
  },
  isEmpty: function () {
    let check = true;
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].includes(".")) {
        return false;
      }
    }
    return check;
  },
  checkAll: function (playerChosen) {
    if (this.checkRows(playerChosen)) {
      return true;
    }
    if (this.checkCols(playerChosen)) {
      return true;
    }
    if (this.checkDiagLR(playerChosen)) {
      return true;
    }
    if (this.checkDiagRL(playerChosen)) {
      return true;
    }
    if (!this.finish && this.isEmpty()) {
      console.log("Draw game no winner");
      return true;
    }
  },
};

// jQuery..................
$(document).ready(function () {
  // Declare global event listeners used more than once
  let $select = $("select"); // Select dropdown form game setup
  let $msg = $("#msg"); // Container to print instructions
  let $cell; // Assign event after buildBoard creates cell
  let $buildButton = $("button.build-board");
  let $document = $(document);
  let $body = $("body");
  let $players = $(".players");

  // Declare and cache global Game condition variables
  let size; // board dimensions size x size
  let winCount; // length condition to achieve in a row
  let maxScore; // first player to score maxScore wins

  let cacheValues = function () {
    size = parseInt($(".board-size option:selected").val());
    maxScore = parseInt($(".board-round option:selected").val());
    let el = parseInt($(".board-count option:selected").val());
    if (el > size) {
      alert("Length cannot be bigger than board size");
    } else {
      winCount = el;
    }
    console.log("size: " + size + " winCount: " + winCount + " maxScore: " + maxScore);
  };
  $select.change(cacheValues);
  cacheValues();

  // Function to hide set up and show board and title with cached values
  let showBoard = function () {
    $(".game-setup").css({
      display: "none",
    });
    $(".game-play").css({
      display: "block",
    });
    $("button.reset").css({
      display: "none",
    });
    $(".title").html("C4 game - Line up " + winCount + " in a row; First to score: " + maxScore);
  };

  // Create function for building a new board

  let buildBoard = function () {
    // Execute game logic based on cached select values
    Game.newBoard(size);
    Game.winCount(winCount);

    let dimension = 100 / size + "%"; // To set cell width
    let count = 0; // To number cells
    let list = ""; // Use string to store appended values
    // Loop create new board divs and append to div container. Assign row and col attributes for future access
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        count++;
        list += "<div class='cell' row=" + "'" + row + "' col='" + col + "'>" + count + "</div>";
      }
    }
    $(".container-content").html(list);
    // Cache event listener on board after build
    $cell = $(".cell");
    $cell.css({
      width: dimension,
      height: dimension,
    });
    $cell.on("click", takeMove);
    // showBoard callback;
    showBoard();
    return true;
  };

  $buildButton.on("click", buildBoard);

  // Selecting players
  let player;

  // Function to assign player and update msg div
  let pickPlayer = function (name) {
    player = name;
    console.log(player + " chosen");
    $msg
      .html(player + " chosen")
      .removeClass()
      .addClass(player);
  };

  // Shortcut keys: for choosing players
  $document.on("keypress", function (event) {
    // Number 1 shortcut
    if (event.keyCode === 49) {
      pickPlayer("player1");
    }
    // Number 2 shortcut
    if (event.keyCode === 50) {
      pickPlayer("player2");
    }
    // Spacebar shortcut
    if (event.keyCode === 32) {
      if (player === "player1") {
        pickPlayer("player2");
      } else if (player === "player2") {
        pickPlayer("player1");
      }
    }
  });

  // Cache value of button when player button clicked
  let buttonPlayer = function () {
    let el = $(this).attr("class");
    pickPlayer(el);
  };
  $players.on("click", "button", buttonPlayer);

  let printWin = function () {
    let winArray = Game.winArray;
    let length = winArray.length;

    for (let i = 0; i < length; i++) {
      $(".cell[row=" + winArray[i][0] + "][col=" + winArray[i][1] + "]").addClass("win");
    }
  };

  // Create checkScore and checkFinish callback
  let player1Score = 0; // Start with zero scores
  let player2Score = 0;

  // Check round score and record value
  let checkRound = function () {
    // Player 1 wins round
    if (Game.finish && Game.lastPlayer === "player1") {
      player1Score++;
      $msg.html("Winner is player1 <br/> Reset Board (R)");
      $body.removeClass().addClass("player1");
      console.log("player1Score:" + player1Score, "player2Score " + player2Score);
      $cell.off("click");
      printWin();
      // Player 2 wins round
    } else if (Game.finish && Game.lastPlayer === "player2") {
      player2Score++;
      $msg.html("Winner is player2 <br/> Reset Board (R)");
      $body.removeClass().addClass("player2");
      console.log("player1Score:" + player1Score, "player2Score " + player2Score);
      $cell.off("click");
      printWin();
      // Draw round
    } else if (Game.isEmpty() && !Game.finish) {
      $msg.html("Game draw. No points. <br/> Reset board (R)").removeClass().addClass("msg");
      $cell.off("click");
      $body.removeClass().addClass("msg");
    }
    // Append round score
    $("button.player1 span").html(player1Score);
    $("button.player2 span").html(player2Score);
    $("button.reset").css({
      display: "block",
    });
  };

  // Check total round wins
  let checkGame = function () {
    if (player1Score === maxScore || player2Score === maxScore) {
      if (player1Score > player2Score) {
        alert("player1 WINS!");
      } else if (player1Score < player2Score) {
        alert("player2 WINS!");
      }
      window.location.reload();
      $("body").html("Please reload browser to restart");
    }
  };

  // Create callback function when cell is clicked
  let takeMove = function () {
    // Find position of click
    let el = $(this);
    let row = el.attr("row");
    let col = el.attr("col");
    // Check conditions
    if (player === undefined) {
      $msg.html("Please select a player");
    } else if (player === Game.lastPlayer && player !== undefined) {
      $msg.html("Turn taken. Press spacebar to switch players");
    } else {
      Game.addMark(player, row, col);
      Game.checkAll(player);
      el.addClass(player);
      checkRound();
      checkGame();
    }
    return true;
  };

  let resetBoard = function () {
    Game.newBoard(size); // Store the new board in a variable
    $cell.removeClass("player1");
    $cell.removeClass("player2");
    $cell.removeClass("win");
    $cell.on("click", takeMove);
    $("button.reset").css({
      display: "none",
    });
    player = undefined;
    $players.on("click", "button", buttonPlayer);

    $body.addClass("reset");
    $msg.html("Board reset. Pick who goes first").removeClass().addClass(".msg");
  };

  $("button.reset").on("click", resetBoard);

  $document.on("keypress", function (event) {
    if (event.keyCode === 114) {
      resetBoard();
    }
  });
}); // jQuery document ready function
