const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5; // 75
const maxPaddleY = canvas.height - grid - paddleHeight;

const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// Key codes
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;

// Initialize scores
let leftScore = 0;
let rightScore = 0;

const leftPaddle = {
  x: grid * 2,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0
};

const rightPaddle = {
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - paddleHeight / 2,
  width: grid,
  height: paddleHeight,
  dy: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,
  resetting: false,
  dx: BALL_SPEED,
  dy: -BALL_SPEED
};

function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function resetBall() {
  ball.resetting = true;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
  ball.dy = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
  setTimeout(() => {
    ball.resetting = false;
  }, 400);
}

function updatePaddle(paddle) {
  paddle.y += paddle.dy;
  if (paddle.y < grid) {
    paddle.y = grid;
  } else if (paddle.y > maxPaddleY) {
    paddle.y = maxPaddleY;
  }
}

function drawScores() {
  context.fillStyle = 'white';
  context.font = '24px Arial';
  context.fillText(`Player 1: ${leftScore}`, 50, 30);
  context.fillText(`Player 2: ${rightScore}`, canvas.width - 200, 30);
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawScores();
  
  updatePaddle(leftPaddle);
  updatePaddle(rightPaddle);

  context.fillStyle = 'white';
  context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.y < grid || ball.y + grid > canvas.height - grid) {
    ball.dy *= -1;
    ball.y = Math.max(grid, Math.min(ball.y, canvas.height - grid * 2));
  }

  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    if (ball.x < 0) {
      rightScore++;
    } else {
      leftScore++;
    }
    resetBall();
  }

  if (collides(ball, leftPaddle)) {
    ball.dx *= -1;
    ball.x = leftPaddle.x + leftPaddle.width;
  } else if (collides(ball, rightPaddle)) {
    ball.dx *= -1;
    ball.x = rightPaddle.x - ball.width;
  }

  context.fillRect(ball.x, ball.y, ball.width, ball.height);
  
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);
  
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

document.addEventListener('keydown', function(e) {
  if (e.which === KEY_UP) {
    rightPaddle.dy = -PADDLE_SPEED;
  } else if (e.which === KEY_DOWN) {
    rightPaddle.dy = PADDLE_SPEED;
  }

  if (e.which === KEY_W) {
    leftPaddle.dy = -PADDLE_SPEED;
  } else if (e.which === KEY_S) {
    leftPaddle.dy = PADDLE_SPEED;
  }
});

document.addEventListener('keyup', function(e) {
  if (e.which === KEY_UP || e.which === KEY_DOWN) {
    rightPaddle.dy = 0;
  }

  if (e.which === KEY_W || e.which === KEY_S) {
    leftPaddle.dy = 0;
  }
});

// Start the game
requestAnimationFrame(loop);