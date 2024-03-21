// Constants for DOM elements
const gameBoard = document.getElementById('game-arena');
const instruction = document.getElementById('game-instructions');
const gameOverAudio = new Audio('./sound/gameover.mp3');
const foodAudio = new Audio('./sound/food.mp3');
const score = document.getElementById('score');
const highScoreText = document.getElementById('high-score');

// Game Variables
let snake = [{ x: 8, y: 7 }]; // Initial position of the snake
let gridSize = 15; // Size of the game grid
let food = generateFood(); // Initial food position
let direction = 'right'; // Initial direction of the snake
let gameInterval; // Interval for game loop
let gameSpeed = 300; // Initial speed of the game
let gameStarted = false; // Flag to indicate if the game has started
let highScore = 0; // Initialize high score

// Draw Function - updates the game board with current state
function draw() {
  gameBoard.innerHTML = ''; 
  snakeRender(); 
  foodRender(); 
  updateScore(); 
  updateHighScore(); 
}

// Render the snake on the game board
function snakeRender() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    gameBoard.appendChild(snakeElement);
  });
}

// Helper function to create a game element
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of a game element on the grid
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Render the food on the game board
function foodRender() {
  if (gameStarted) {
    let foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}

// Generate random food coordinates within the grid
function generateFood() {
  let x = Math.floor(Math.random() * gridSize) + 1;
  let y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Move the snake
function move() {
  let head = { ...snake[0] }; // Copy the head of the snake

  // Move the head in the current direction
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  // Add the new head to the snake
  snake.unshift(head);

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    food = generateFood(); // Generate new food
    foodAudio.play(); // Play food eating sound
    increaseGameSpeed(); // Increase game speed
    clearInterval(gameInterval); // Clear previous interval
    // Set new interval with updated speed
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeed);
  } else {
    snake.pop(); // Remove the tail segment if snake doesn't eat anything 
  }
}

// Start the game
function startGame() {
  gameStarted = true;
  instruction.style.display = 'none'; 
  // Set game loop interval
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeed);
}

// Handle key events for controlling the snake
function keyHandler(event) {
  if (!gameStarted && event.code === 'Space') {
    startGame();
  } else {
    switch (event.key) {
      case 'w':
        direction = 'up';
        break;
      case 's':
        direction = 'down';
        break;
      case 'a':
        direction = 'left';
        break;
      case 'd':
        direction = 'right';
        break;
    }
  }
}

// Listen for keydown events
document.addEventListener('keydown', keyHandler);

// Increase game speed as the snake grows
function increaseGameSpeed() {
  if (snake.length > 5) {
    gameSpeed -= 5;
  }
}

// Check for collisions (with walls or itself)
function checkCollision() {
  const head = snake[0];
  // Check collision with walls
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    gameOverAudio.play(); 
    resetGame(); // Reset the game
  }

  // Check collision with itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOverAudio.play(); 
      resetGame(); // Reset the game
    }
  }
}

// Reset the game state
function resetGame() {
  updateHighScore(); // Update high score if necessary
  stopGame(); // Stop the game loop
  snake = [{ x: 8, y: 7 }]; // Reset snake position
  food = generateFood(); // Generate new food
  direction = 'right'; // Reset direction
  gameSpeed = 300; // Reset game speed
  updateScore(); // Update score display
}

// Stop the game
function stopGame() {
  clearInterval(gameInterval); // Clear game loop interval
  gameStarted = false; // Update game status
  instruction.style.display = 'block'; // Show instructions
}

// Update the current score display
function updateScore() {
  const currentScore = snake.length - 1;
  score.innerHTML = `Score: ${currentScore.toString().padStart(3, '0')}`;
}

// Update the high score display
function updateHighScore() {
  let currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.innerHTML = `High Score: ${currentScore.toString().padStart(3, '0')}`;
  }
}
