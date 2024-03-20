// Constants
const CANVAS_COLOR = "#000000";
const WIDTH = 800;
const HEIGHT = 600;
const FPS = 60;

const PLATFORM_COLOR = "#29ff00";
const PLATFORM_WIDTH = 120;
const PLATFORM_HEIGHT = 5;
const PLATFORM_VELOCITY = 7;

const BALL_COLOR = "#29ff00";
const BALL_RADIUS = 10;
const BALL_VELOCITY = 7;
const VELOCITY_INCREMENT = 0.3;

// Global variables
let lastTime = Date.now();
let score = 0;
let updateId, drawId;

const canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvas.style.backgroundColor = CANVAS_COLOR;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

/************************************
 * Game objects
 * *********************************/

class Ball {
  constructor() {
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.angle = Math.random() * 2 * Math.PI;
    this.velocityX = -BALL_VELOCITY * Math.cos(this.angle);
    this.velocityY = -BALL_VELOCITY * Math.sin(this.angle);
  }

  update(deltaTime) {
    this.x += this.velocityX * deltaTime * FPS;
    this.y += this.velocityY * deltaTime * FPS;

    // Collision with edges
    if (this.x - BALL_RADIUS < 0 || this.x + BALL_RADIUS > WIDTH) {
      this.velocityX *= -1;
    }

    if (this.y - BALL_RADIUS < 0) {
      this.velocityY *= -1;
    }

    if (this.y + BALL_RADIUS > HEIGHT) {
      gameOver();
    }

    // Collision with platform
    if (
      this.y + BALL_RADIUS > platform.y &&
      this.y - BALL_RADIUS < platform.y + PLATFORM_HEIGHT &&
      this.x + BALL_RADIUS > platform.x &&
      this.x - BALL_RADIUS < platform.x + PLATFORM_WIDTH
    ) {
      this.velocityY *= -1;

      if (
        this.x - BALL_RADIUS < platform.x ||
        this.x + BALL_RADIUS > platform.x + PLATFORM_WIDTH
      ) {
        this.velocityX *= -1;
      }

      this.velocityX += VELOCITY_INCREMENT * Math.sign(this.velocityX);
      this.velocityY += VELOCITY_INCREMENT * Math.sign(this.velocityY);
      score++;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = BALL_COLOR;
    ctx.fill();
    ctx.closePath();
  }
}

class Platform {
  constructor() {
    this.x = WIDTH / 2 - PLATFORM_WIDTH / 2;
    this.y = HEIGHT - PLATFORM_HEIGHT - 40;
    this.velocityX = 0;
  }

  update(deltaTime) {
    this.x += this.velocityX * deltaTime * FPS;

    // Collision with edges
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + PLATFORM_WIDTH > WIDTH) {
      this.x = WIDTH - PLATFORM_WIDTH;
    }
  }

  draw(ctx) {
    ctx.fillStyle = PLATFORM_COLOR;
    ctx.fillRect(this.x, this.y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
  }
}

/************************************
 * Game loop
 * *********************************/

let ball = new Ball();
let platform = new Platform();

function update() {
  const now = Date.now();
  const deltaTime = (now - lastTime) / 1000.0;

  platform.update(deltaTime);
  ball.update(deltaTime);

  lastTime = now;

  updateId = requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  ball.draw(ctx);
  platform.draw(ctx);

  drawId = requestAnimationFrame(draw);
}

function startGame() {
  update();
  draw();
}

function gameOver() {
  cancelAnimationFrame(updateId);
  cancelAnimationFrame(drawId);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "50px Arial";
  ctx.fillText("Game Over", WIDTH / 2 - 150, HEIGHT / 2);
}

function resetGame() {
  cancelAnimationFrame(updateId);
  cancelAnimationFrame(drawId);

  ball = new Ball();
  platform = new Platform();
  score = 0;

  updateId = requestAnimationFrame(update);
  drawId = requestAnimationFrame(draw);
}

/************************************
 * Event listeners
 * *********************************/

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    resetGame();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    platform.velocityX = -PLATFORM_VELOCITY;
  } else if (e.key === "ArrowRight") {
    platform.velocityX = PLATFORM_VELOCITY;
  }
});

document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    platform.velocityX = 0;
  }
});

/************************************
 * Start game loop
 * *********************************/
startGame();
