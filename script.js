// Элементы интерфейса
const boardElement = document.getElementById("game-board");
const cells = document.querySelectorAll(".cell");
const messageElement = document.getElementById("game-message");
const restartBtn = document.getElementById("restart-btn");
const playerXInput = document.getElementById("player-x");
const playerOInput = document.getElementById("player-o");
const confettiCanvas = document.getElementById("confetti-canvas");

// массив для текущего состояния игры
const gameState = {
  board: ["", "", "", "", "", "", "", "", ""],
  currentPlayer: "X",
  isGameActive: true
};

// имена игроков 
let playerXName = "X";
let playerOName = "O";

// Обновление сообщения о ходе игрока
function updateMessage(msg) {
  messageElement.textContent = msg;
}

// ф-я для смены игрока
function switchPlayer() {
  gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
  const currentPlayerName = gameState.currentPlayer === "X" ? playerXName : playerOName;
  updateMessage(`Player ${currentPlayerName}'s turn`);
}

// обрабатываем  ввод имён игроков
playerXInput.addEventListener("input", () => {
  playerXName = playerXInput.value.trim() || "X";
  if (gameState.currentPlayer === "X") {
    updateMessage(`Player ${playerXName}'s turn`);
  }
});
playerOInput.addEventListener("input", () => {
  playerOName = playerOInput.value.trim() || "O";
  if (gameState.currentPlayer === "O") {
    updateMessage(`Player ${playerOName}'s turn`);
  }
});

// победные комбинации
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// ф-я для появления конфетти
const confettiContext = confettiCanvas.getContext("2d");
let confettiPieces = [];

function createConfettiPiece() {
  return {
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: (Math.random() * 6) + 4,
    d: (Math.random() * 50) + 10,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.floor(Math.random() * 10) - 10
  };
}

function initConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 100; i++) {
    confettiPieces.push(createConfettiPiece());
  }
}

function drawConfetti() {
  confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((piece, index) => {
    confettiContext.beginPath();
    confettiContext.fillStyle = piece.color;
    confettiContext.arc(piece.x, piece.y, piece.r, 0, Math.PI * 2, true);
    confettiContext.fill();
  });
  updateConfetti();
}

function updateConfetti() {
  confettiPieces.forEach((piece, index) => {
    piece.y += Math.cos(piece.d) + 1 + piece.r / 2;
    piece.x += Math.sin(piece.d);
    if (piece.y > confettiCanvas.height) {
      confettiPieces[index] = createConfettiPiece();
      confettiPieces[index].y = 0;
    }
  });
}

function animateConfetti() {
  drawConfetti();
  requestAnimationFrame(animateConfetti);
}

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ф-я для проверки результата игры
function checkResult() {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState.board[a] && gameState.board[a] === gameState.board[b] && gameState.board[b] === gameState.board[c]) {
      gameState.isGameActive = false;
      const winnerName = gameState.currentPlayer === "X" ? playerXName : playerOName;
      updateMessage(`Player ${winnerName} wins!`);
      cells[a].classList.add("winning-cell");
      cells[b].classList.add("winning-cell");
      cells[c].classList.add("winning-cell");
      initConfetti();
      animateConfetti();
      return;
    }
  }
  if (!gameState.board.includes("")) {
    gameState.isGameActive = false;
    updateMessage("It's a tie!");
    return;
  }
}

// ф-я для обработки хода
function handleCellClick(e) {
  const clickedCell = e.target;
  const cellIndex = clickedCell.getAttribute("data-index");

  if (!gameState.isGameActive || gameState.board[cellIndex] !== "") {
    return;
  }

  gameState.board[cellIndex] = gameState.currentPlayer;
  clickedCell.textContent = gameState.currentPlayer;
  clickedCell.classList.add("pop");
  setTimeout(() => {
    clickedCell.classList.remove("pop");
  }, 300);

  checkResult();

  if (gameState.isGameActive) {
    switchPlayer();
  }
}

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

// сброс игры при нажатии на кнопку Restart
restartBtn.addEventListener("click", () => {
  gameState.board = ["", "", "", "", "", "", "", "", ""];
  gameState.currentPlayer = "X";
  gameState.isGameActive = true;
  updateMessage(`Player ${playerXName}'s turn`);
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning-cell");
  });
  confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = [];
});
