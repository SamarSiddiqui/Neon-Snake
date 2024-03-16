const board = document.getElementById('game-area')
const instructions = document.getElementById('game-rules')
let snake = [{ x: 11, y: 6 }]


//  Draw Snake
function draw() {
 instructions.innerHTML = ''
 drawSnake()
 drawFood()
}

// Draw Snake 
function drawSnake() {
 snake.forEach((segment => {
  let snakeElement = createSnakeElement('div', 'snake')
  snakePosition(snakeElement, segment)
  board.appendChild(snakeElement)
   const blinkDiv = document.createElement('div')
   blinkDiv.className = 'blink-div'
   snakeElement.appendChild(blinkDiv)
 }))
}

//Create Snake/Food Block
function createSnakeElement(tag, className) {
 let element = document.createElement(tag)
 element.className = className
 return element
}

//Creating Snake/Food Positions
function snakePosition(element, positions) {
 element.style.gridColumn = positions.x
 element.style.gridRow = positions.y
}

draw()


