const canvas = document.querySelector('.snakeCanv'); //select css element, assign to variable
const ctx = canvas.getContext('2d'); //2D rendering context of the canvas

//select css element, assign to variable
const scoreElement = document.querySelector('.main-score'); 
const restartButton = document.querySelector('.restart-button'); 
const pauseButton = document.querySelector('.pause-button'); 
const resumeButton = document.querySelector('.resume-button');
const bestScoreElement = document.querySelector('.best-score'); 

//initialize variables
let blockSize = 15; 
let canvasSize = 25; 
let score = 0; 
let gameStarted = false; 
let paused = false;
canvas.height = canvas.width = canvasSize * blockSize; //set canvas height and width
let snake = [{ x: 0, y: 0 }];
let direction = 'right'; 
let food = generateFood();
let snakeColor = '#69802e';
let foodColor = 'red';
let gameLoop;  //stores setInterval function
let bestScore = localStorage.getItem('bestScore') || 0; //all time best score
let sessionBestScore = 0; //best score in current session

//button event listeners
document.addEventListener('keydown', detectDirection); 
restartButton.addEventListener('click', restartGame); 
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
resumeButton.style.display = 'none'; // hide resume button initially

function moveSnake() {
  if (paused) return; // stop moving if paused

  let head = { ...snake[0] }; //create new object with same properties as snake[0]

  //update head position based on direction
  if (direction === 'right') { 
    head.x++;
  } else if (direction === 'left') {
    head.x--;
  } else if (direction === 'up') {
    head.y--;
  } else {
    head.y++;
  }

  //check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score++;
  } else {
    snake.pop();
  }
  snake.unshift(head); //add new segment or remove segment (if snake didn't eat food)
}

//clear canvas 
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

//render snake on canvas
function drawSnake() {
  ctx.fillStyle = snakeColor; //set color
  snake.forEach((cell) => {
    ctx.fillRect(cell.x * blockSize, cell.y * blockSize, blockSize, blockSize); //draw rectangle, x,y,width,height
  });
}

//render food on canvas
function drawFood() {
  ctx.fillStyle = foodColor; //set color
  ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize); //draw rectangle, x,y,width,height
}


function collisionCheck() {
  for (let i = 0; i < snake.length; i++) {  //itr through snake array
    for (let j = i + 1; j < snake.length; j++) { //itr through remaining snake array
      if (snake[i].x === snake[j].x && snake[i].y === snake[j].y) { //if i and j are same, collision is detected
        return false;
      }
    }
  }

  //check if snakes head has collided with wall
  if (snake[0].x >= canvasSize || snake[0].y >= canvasSize || snake[0].x < 0 || snake[0].y < 0) { //if head is outside canvas, collision is detected
    return false;
  }
  return true; //no collision detected
}

function updateScore() {
  scoreElement.innerText = score;  
  updateSessionScore();
}

window.addEventListener('load', () => { 
  bestScoreElement.innerText = bestScore; //display best score
}); 

//when game is over
function gameOver() {
  clearInterval(gameLoop); //stop game loop

  //remove pause button
  pauseButton.removeEventListener('click', pauseGame); 
  pauseButton.style.display = 'none'; 
  resumeButton.style.display = 'none'; 

  //display game over text
  ctx.font = '15px "Roboto Condensed", Sans-Serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

  //display restart button on canvas
  restartButton.style.display = 'inline-block';
  restartButton.addEventListener('click', restartGame);

  //update best score
  updateBestScore(); 
}

function restartGame() {
  //reset variables
  snake = [{ x: 0, y: 0 }]; 
  direction = 'right';
  food = generateFood();
  score = 0;
  paused = false; 

  //add pause button
  pauseButton.addEventListener('click', pauseGame);
  pauseButton.style.display = 'inline-block';

  //clear canvas before starting new game
  clearCanvas();
  clearInterval(gameLoop);

  //start new game
  gameLoop = setInterval(() => { 
    //define game logic
    moveSnake();
    clearCanvas();
    drawSnake();
    drawFood();
    updateScore();
    if (!collisionCheck()) {
      gameOver();
    }
  }, 150); //interval of game loop
}

function generateFood() {
  let node; //stores food location
  
  //loop until food location is not on snake
  while (true) { 
    let flag = false; //flag to check if food location is on snake
    node = getRandomLoc(); //get random location for food
    for (let i = 0; i < snake.length && !flag; i++) {  
      if (snake[i].x === node.x && snake[i].y === node.y) { 
        flag = true; 
      }
    }
    if (!flag) { //if food location is not on snake, break out of loop
      break;
    }
  }
  return node; //return food location
}

function getRandomLoc() {
  return {
    //generate random x and y coordinates within canvas
    x: Math.floor (Math.random() * canvasSize), y: Math.floor (Math.random() * canvasSize) 
  };
}

//event handler that is triggered when a key is pressed
function detectDirection(event) {
  if (!gameStarted) { 
    gameStarted = true; //game has started
    restartGame(); //initialize and start game

    //remove instructions
	  const instructions = document.querySelector('.press'); 
    instructions.style.display = 'none';
  }

  //change direction based on key pressed
  if (event.keyCode === 37 && direction !== 'right') {  
    //!== prevent the snake from turning directly into the opposite direction
    direction = 'left';
  } else if (event.keyCode === 38 && direction !== 'down') {
    direction = 'up';
  } else if (event.keyCode === 39 && direction !== 'left') {
    direction = 'right';
  } else if (event.keyCode === 40 && direction !== 'up') {
    direction = 'down';
  }
}

function pauseGame() {
  if (!gameStarted) return; // only pause if the game has started
  if (paused) return; // return if already paused 
  paused = true; 
  clearInterval(gameLoop); //stop game loop
  pauseButton.style.display = 'none'; //remove pause button 
  resumeButton.style.display = 'inline-block'; //display resume button
}

function resumeGame() {
  if (!gameStarted) return; // only resume if the game has started
  if (!paused) return; // return if not paused

  paused = false; //no longer paused can resume game

  //start game loop
  gameLoop = setInterval(() => {
    moveSnake();
    clearCanvas();
    drawSnake();
    drawFood();
    updateScore();
    if (!collisionCheck()) {
      gameOver();
    }
  }, 150);

  //remove resume button
  pauseButton.style.display = 'inline-block';
  resumeButton.style.display = 'none';
}

function updateBestScore() {
  bestScore = Math.max(score, bestScore); //compare current score with best score
  bestScoreElement.innerText = bestScore;  //update best score
  localStorage.setItem('bestScore', bestScore); //store best score in local storage
}

function updateSessionScore() {
  sessionBestScore = Math.max(score, sessionBestScore); // compare
  document.querySelector('.session-score').innerText = sessionBestScore; // display
}
