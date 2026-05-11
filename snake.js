import { saveScore } from "../app.js";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const gridSize = 20;

let snake, dx, dy, food, score, gameInterval;
let highScore = localStorage.getItem("highScore") || 0;

const scoreEl = document.getElementById("score");

// 🚀 Init
function initGame() {
  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;

  updateScore();

  food = randomFood();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 120);
}

// 🍎 Food (avoid snake body)
function randomFood() {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };

    let onSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
}

// 🎮 Controls
document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowUp" && dy === 0) {
    dx = 0; dy = -1;
  } else if (e.key === "ArrowDown" && dy === 0) {
    dx = 0; dy = 1;
  } else if (e.key === "ArrowLeft" && dx === 0) {
    dx = -1; dy = 0;
  } else if (e.key === "ArrowRight" && dx === 0) {
    dx = 1; dy = 0;
  }
}

// 🔁 Loop
function gameLoop() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // 💀 Wall collision
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    return gameOver();
  }

  // 💀 Self collision
  if (snake.some(part => part.x === head.x && part.y === head.y)) {
    return gameOver();
  }

  snake.unshift(head);

  // 🍽 Eat
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

// 🎨 Draw
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  snake.forEach((part, i) => {
    ctx.fillStyle = i === 0 ? "#00ffcc" : "#00aa88";
    ctx.fillRect(part.x * box, part.y * box, box, box);
  });

  // Food
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(food.x * box, food.y * box, box, box);
}

// 📊 Score update
function updateScore() {
  scoreEl.innerText = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
}

// 💀 Game Over
function gameOver() {
  clearInterval(gameInterval);

  saveScore(score); // 🔥 FIREBASE SAVE

  setTimeout(() => {
    if (confirm(`Game Over 😢\nScore: ${score}\nHigh Score: ${highScore}\n\nPlay Again?`)) {
      initGame();
    }
  }, 100);
}

// 🚀 Start
initGame();