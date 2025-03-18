const boardElement = document.getElementById("game-board");
const cells = document.querySelectorAll(".cell");
const messageElement = document.getElementById("game-message");
const restartBtn = document.getElementById("restart-btn");

const confettiCanvas = document.getElementById("confetti-canvas");

// массив для текущего состояния доски 
let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";
let isGameActive = true;

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
      updateMessage(`Player ${currentPlayer} wins!`);

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
    updateMessage("It's a tie!");
    return;
  }
}

// ф-я для обработки хода, если ячейка пустая ставится x или 0
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
  // eсли игра продолжается меняем игрока
  if (isGameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateMessage(`Player ${currentPlayer}'s turn`);
  }
}

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});
// с помощью «Restart» сбрасываем игру
restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  updateMessage("Player X's turn");
  // очищаем ячейки
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning-cell");
  });
  // останавливаем конфетти 
  confettiContext.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces = [];
});
