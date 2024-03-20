const gameBoard = document.getElementById('game-arena')
const instruction = document.getElementById('game-instructions')
const gameOverAudio = new Audio('./sound/gameover.mp3')
const foodAudio = new Audio('./sound/food.mp3')
const score = document.getElementById('score')
const highScoreText = document.getElementById('high-score')



//Declaring Game Variables
let snake = [{ x: 10, y: 10 }]
let gridSize = 20
let food = generateFood()
let direction = 'right'
let gameInterval;
let gameSpeed = 100
let gameStarted = false
let highScore = 0

//Draw Function

function draw() {
  gameBoard.innerHTML = ''
  snakeRender()
  foodRender()
  updateScore()
  updateHighScore()
}


//Making Snake
function snakeRender() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake')
    setPosition(snakeElement, segment)
    gameBoard.appendChild(snakeElement)
  })
}

function createGameElement(tag, className) {
  const element = document.createElement(tag)
  element.className = className
  return element
}



function setPosition(element, position) {
  element.style.gridColumn = position.x
  element.style.gridRow = position.y

}

function foodRender() {
  if(gameStarted) {
  let foodElement = createGameElement('div', 'food')
  setPosition(foodElement, food)
  gameBoard.appendChild(foodElement)
}}
//Generating Random food Coordinates

function generateFood() {
  let x = Math.floor(Math.random() * gridSize) + 1
  let y = Math.floor(Math.random() * gridSize) + 1

  return { x, y }
}




//Move the Snake

function move() {
  let head = { ...snake[0] }

  switch (direction) {
    case 'up':
      head.y--
      break;

    case 'down':
      head.y++
      break;

    case 'left':
      head.x--
      break;

    case 'right':
      head.x++
      break;

  }
  snake.unshift(head)
  if (head.x === food.x && head.y === food.y) {
    food = generateFood()
    foodAudio.play()
    increaseGameSpeed()
    clearInterval(gameInterval)
    gameInterval = setInterval(() => {
      move()
      checkCollison()
      draw()
    }, gameSpeed);
    
  } else {
    snake.pop()
    
  }
}



function startGame() {
  gameStarted = true
  instruction.style.display = 'none'
  gameInterval = setInterval(() => {
    move()
    checkCollison()
    draw()
  }, gameSpeed);

}

///Key Press

function keyHandler(event) {
  if (!gameStarted && event.code === 'Space') {
    startGame()
  } else {
    switch (event.key) {
      case 'w':
        direction = 'up'
        // console.log('up')
        break;
      case 's':
        direction = 'down'
        // console.log('d')
        break;
      case 'a':
        direction = 'left'
        // console.log('l')
        break;
      case 'd':
        direction = 'right'
        // console.log('r')
        break;


    }
  }
}

document.addEventListener('keydown', keyHandler)

function increaseGameSpeed () {
  console.log(gameSpeed);

 if(snake.length>5) {
  gameSpeed -= 5
 }
}

function checkCollison () {
  const  head  = snake[0]
  if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize) {
    gameOverAudio.play()
    resetGame()
  }
  
  
  for(let i=1;i<snake.length;i++) {
    if(head.x===snake[i].x && head.y===snake[i].y) {
      gameOverAudio.play()
      resetGame()
    }
  }
}



function resetGame() {
  updateHighScore()
  stopGame()
  snake = [{x:10,y:10}]
  food = generateFood()
  direction = 'right'
  gameSpeed = 300
  updateScore()
  
}

function stopGame () {
  clearInterval(gameInterval)
  gameStarted = false
  instruction.style.display = 'block'

}


function updateScore () {
  const currentScore = snake.length-1
  score.innerHTML = `Score:${currentScore.toString().padStart(3,'0')}`
}


function updateHighScore () {
  let currentScore = snake.length-1
  if(currentScore>highScore){
    highScore = currentScore
    highScoreText.innerHTML = `High Score:${currentScore.toString().padStart(3,'0')}`
  }
}