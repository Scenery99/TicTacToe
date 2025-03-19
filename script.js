const boardElement = document.getElementById("game-board");
const cells = document.querySelectorAll(".cell");
const messageElement = document.getElementById("game-message");
const restartBtn = document.getElementById("restart-btn");
const playerXInput = document.getElementById("player-x");
const playerOInput = document.getElementById("player-o");

const confettiCanvas = document.getElementById("confetti-canvas");

// массив для текущего состояния доски 
let board = ["", "", "", "", "", "", "", "", ""];

let playerXName = "X";
let playerOName = "O";
let currentPlayer = "X";
let isGameActive = true;

// обновляем имя игрока при вводе
playerXInput.addEventListener("input", () => {
  playerXName = playerXInput.value.trim() || "X";
  if (currentPlayer === "X") {
    updateMessage(`Player's turn ${playerXName}`);
  }
});
playerOInput.addEventListener("input", () => {
  playerOName = playerOInput.value.trim() || "O";
  if (currentPlayer === "O") {
    updateMessage(`Player's turn ${playerOName}`);
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

// обновляем размер холста для конфетти в зависимости от размера экрана  
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ф-я для изменения сообщения о ходе игрока
function updateMessage(msg) {
  messageElement.textContent = msg;
}

// ф-я для проверки победы или ничьей
function checkResult() {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      isGameActive = false;
      const winnerName = currentPlayer === "X" ? playerXName : playerOName;
      updateMessage(`Player victory ${winnerName}!`);

      cells[a].classList.add("winning-cell");
      cells[b].classList.add("winning-cell");
      cells[c].classList.add("winning-cell");

      initConfetti();
      animateConfetti();
      return;
    }
  }
  // если победитель не найден – ничья
  if (!board.includes("")) {
    isGameActive = false;
    updateMessage("Draw!");
    return;
  }
}

// ф-я для обработки хода
function handleCellClick(e) {
  const clickedCell = e.target;
  const cellIndex = clickedCell.getAttribute("data-index");

  if (!isGameActive || board[cellIndex] !== "") {
    return;
  }

  board[cellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add("pop");
  setTimeout(() => {
    clickedCell.classList.remove("pop");
  }, 300);

  checkResult();

  if (isGameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    const currentPlayerName = currentPlayer === "X" ? playerXName : playerOName;
    updateMessage(`Player's turn ${currentPlayerName}`);
  }
}

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

// сброс игры при нажатии на кнопку Restart
restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  updateMessage(`Player's turn ${playerXName}`);
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning-cell");
  });
  confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = [];
});
