const canvas = document.querySelector('.snakeCanv'); //select css element, assign to variable
//const is a variable that cannot be reassigned, but can be mutated
//canvas is a rectangular area on an HTML page, where we can use JavaScript to draw graphics
//document is the whole html page, querySelector() is a method of document
//querySelector() returns the first Element within the document that matches the specified selector, or group of selectors

const ctx = canvas.getContext('2d'); //2D rendering context of the canvas
//ctx is a predefined object, used to create and manipulate content shown on the canvas
//methods like ctx.fillRect(), ctx.drawImage(), ctx.strokeStyle... to draw shapes,images,text,perform operations on the canvas
//getContext() method gets the context of an canvas element
//2d rendering context is an object that provides methods and properties for drawing and manipulating images and graphics on a canvas element in a document

const scoreElement = document.querySelector('.main-score'); //select css element, assign to variable
const restartButton = document.querySelector('.restart-button'); //select css element, assign to variable
const pauseButton = document.querySelector('.pause-button'); //select css element, assign to variable
const resumeButton = document.querySelector('.resume-button'); //select css element, assign to variable
//document.querySelector() returns the first Element within the document that matches the specified selector, or group of selectors

//initialize variables
let blockSize = 15; //size of each block
let canvasSize = 25; //size of canvas
let score = 0; //Track score
let gameStarted = false; // Track game state
let paused = false; // Track pause state
canvas.height = canvas.width = canvasSize * blockSize; //calculate total size in px of the canvas by multiplying 
//By setting both properties to the same value, we ensure that the canvas is a square, as height and width are equal
let snake = [{ x: 0, y: 0 }]; //snake[0]
//initialize snake array with one segment, at position (0,0), top left corner snakes head, used to store all the segments of the snake
let direction = 'right'; //initial direction of snake on game start
let food = generateFood(); //This line initializes the food variable by calling the generateFood() function. It assigns the return value of the function to the food variable. 
//The purpose is to generate the initial position of the food item on the game board.
let snakeColor = '#69802e'; //color of snake
let foodColor = 'red'; //color of food

function moveSnake() {
  //this code block handles the logic of updating the snake's body based on whether it encounters food or not. 
  //If the snake's head reaches the food, the food is regenerated, the score is increased, and the snake grows by adding a new segment. 
  //If the snake doesn't encounter food, the snake's tail segment is removed, and the head segment is added at the front, creating the illusion of movement.
  
  if (paused) return; //if the game is paused, stop moving the snake

  let head = { ...snake[0] }; //create new object with same properties as snake[0]

  //update head position based on direction
  if (direction === 'right') {
    head.x++; 
    //snake is moving right, increment x coordinate of head by 1, moving the head one unit to right
  } else if (direction === 'left') {
    head.x--; 
    //snake is moving left, decrement x coordinate of head by 1, moving the head one unit to left
  } else if (direction === 'up') {
    head.y--; 
    //snake is moving up, decrement y coordinate of head by 1, moving the head one unit up
  } else { 
    head.y++;
    //snake is moving down, increment y coordinate of head by 1, moving the head one unit down
  }

  //check if snake ate food
  if (head.x === food.x && head.y === food.y) { //if snake head is at same position as food
    food = generateFood(); //generate new food coordinate
    score++; //increment score by 1
  } else {
    snake.pop(); //remove last element of snake array, the tail, to make snake move
    //pop() is built-in JS array method that removes the last element from array
    //line is executed when snake doesnt encounter food
  }
  snake.unshift(head); //executed regardless of whether snake encounters food or not
  //unshift() is built-in JS array method that adds new element to beginning of array
  //adds the updated head to the beginning of snake array, at index 0, to make snake move
  //effectively moving the snake by adding a new segment at the front and removing the tail segment
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //clearRect(x, y, width, height) is method of the 2D rendering context (ctx) clears the specified pixels within a given rectangle
  //It sets all the pixels within that area to transparent, effectively erasing any previously drawn content.
  // the rectangular area to be cleared starts at coordinates (0, 0) (the top-left corner of the canvas) and extends to the full width and height of the canvas.
}

function drawSnake() {
  //this code block handles the logic of drawing the snake on the canvas.
  ctx.fillStyle = snakeColor; //fillStyle property of the 2D rendering context (ctx) sets the fill color used when drawing shapes
  snake.forEach((cell) => { //forEach() is built-in JS array method that executes a provided function once for each array element
    //cell is a parameter of the function, represents each element of the snake array
    ctx.fillRect(cell.x * blockSize, cell.y * blockSize, blockSize, blockSize); 
    //fillRect(x, y, width, height) is method of the 2D rendering context (ctx) draws a filled rectangle
    //cell.x is the x coordinate of the cell, cell.y is the y coordinate of the cell, it is multiplied by blockSize to convert them to pixels
    //blockSize, blockSize represent the width and height of each block in the snake
  });
  //By iterating over each cell in the snake array and drawing a rectangle for each segment, the drawSnake() function visualizes the snake on the canvas. 
  //The fill color used for drawing the snake is determined by snakeColor, and the size of each segment is defined by blockSize.
}

function drawFood() {
  //this code block handles the logic of drawing the food on the canvas.
  ctx.fillStyle = foodColor; //fillStyle property of the 2D rendering context (ctx) sets the fill color used when drawing shapes
  ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
  //fillRect(x, y, width, height) is method of the 2D rendering context (ctx) draws a filled rectangle oon the canvas in this case the food
  //x and y coordinates of the rectangle are calculated based on the x and y properties of the food object. The food.x and food.y values are multiplied by blockSize to convert them to the appropriate pixel coordinates on the canvas.
  //blockSize represent the width and height of each block in the snake
  //last arguments are width and height of rectangle to be drawn
}

function collisionCheck() {
  //this code block handles the logic of checking for collisions between the snake and the food, as well as collisions between the snake and the walls of the canvas.
  for (let i = 0; i < snake.length; i++) { //i is index of current segment being checked
    for (let j = i + 1; j < snake.length; j++) { //j is index of remaining segments being checked
      if (snake[i].x === snake[j].x && snake[i].y === snake[j].y) { //if coordinates of any two segments are the same, snake has collided with itself
        //check if x and y coordinates of any two segments are the same
        return false; //return false to indicate collision
      }
    }
  }

  if (snake[0].x >= canvasSize || snake[0].y >= canvasSize || snake[0].x < 0 || snake[0].y < 0) { 
    //check if the head of the snake 'snake[0]' has collided with the walls of the canvas
    //check if x or y coordinate of head is greater than or equal to canvasSize (canvas width and height)
    //if its greater than or equal to canvasSize, it means the head has collided with the right or bottom wall of the canvas, right is x coordinate, bottom is y coordinate
    //if its smaller than 0, it means the head has collided with the left or top wall of the canvas, left is x coordinate, top is y coordinate
    return false; //return false to indicate collision
  }
  
  return true; //return true to indicate no collision
}

function updateScore() {
  //this code block handles the logic of updating the score
  scoreElement.innerText = score; //synchronize scoreElement with score
  //.innerText is a property of the DOM element that sets or returns the text content of the specified node
  //scoreElement is the DOM element that displays the score
  //score is the variable that stores the score
  //The DOM (Document Object Model) is a programming interface for HTML documents. It represents the structure of a web page as a tree-like model where each node in the tree corresponds to a part of the document, such as an element, attribute, or text.
  //A DOM element refers to an element node in the DOM tree. In HTML, elements are represented by tags, such as <div>, <p>, <span>, etc. Each of these tags becomes an element node in the DOM tree.
  //In JavaScript, you can access and manipulate DOM elements using various methods and properties provided by the DOM API. This allows you to dynamically update the content, style, attributes, and other aspects of the web page during runtime.
  //For instance, you can select a DOM element using methods like getElementById(), querySelector(), or getElementsByClassName(). Once you have a reference to a DOM element, you can interact with it, modify its properties, add event listeners, 
  //update its content, and perform various other operations to dynamically change the appearance or behavior of the web page.
}

function gameOver() {
  //this code block handles the logic of ending the game
  clearInterval(gameLoop); //This stops the continuous execution of the game logic.
  pauseButton.removeEventListener('click', pauseGame); //disable pause button
  pauseButton.style.display = 'none'; //hide pause button
  resumeButton.style.display = 'none'; //hide resume button

  ctx.font = '15px "Roboto Condensed", Sans-Serif';  //set font of text to be displayed
  ctx.fillStyle = 'white'; //set color of text to be displayed
  ctx.textAlign = 'center'; //set alignment of text to be displayed
  ctx.textBaseline = 'middle'; //set baseline of text to be displayed
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2); //display text on canvas
  //fillText(text, x, y) is method of the 2D rendering context (ctx) draws filled text on the canvas

  restartButton.style.display = 'inline-block'; //display restart button
  restartButton.addEventListener('click', restartGame); //enable restart button
  updateBestScore();  //update best score

  //Overall, the gameOver() function is responsible for ending the game, hiding unnecessary elements, 
  //displaying the game over text, showing the restart button, and updating the best score.
}

let gameLoop; //variable to store setInterval() function that executes game logic

function restartGame() { 
  //this code block handles the logic of restarting the game
  snake = [{ x: 0, y: 0 }]; //reset snake to initial position
  direction = 'right'; //reset direction to initial direction
  food = generateFood(); //generate new food
  score = 0; //reset score to 0
  paused = false; //the game is not initially paused
  pauseButton.style.display = 'inline-block'; //display pause button
  resumeButton.style.display = 'none'; //hide resume button

  clearCanvas(); //clear previous game from canvas
  clearInterval(gameLoop); //stop  previous game loop

  gameLoop = setInterval(() => { //start new game loop
    //The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).
    //The setInterval() method will continue calling the function until clearInterval() is called, or the window is closed.
    //define game logic
    moveSnake(); 
    clearCanvas();
    drawSnake();
    drawFood();
    updateScore();
    if (!collisionCheck()) { //if coliision is not detected returns true, so if collision is detected returns false and executes gameOver()
      gameOver();
    }
  }, 150); //speed of game loop
  pauseButton.addEventListener('click', pauseGame); //enable pause button
}

function generateFood() {
  //this code block handles the logic of generating food
  let node; //node which will store the randomly generated food location
  while (true) { 
    //loop until a valid food location is generated
    let flag = false; //will be used to check if the generated location is occupied by any part of the snake
    node = getRandomLoc(); //generate random location for food
    for (let i = 0; i < snake.length && !flag; i++) { //loop through each segment of the snake
      if (snake[i].x === node.x && snake[i].y === node.y) { //if the generated location is occupied by any part of the snake
        flag = true; //set flag to true
      }
    }
    if (!flag) { //if the generated location is not occupied by any part of the snake
      break; //break out of the loop
    }
  }
  return node; //return the generated location
}

function getRandomLoc() {
  //In summary, the getRandomLoc() function uses Math.random() and Math.floor() to generate random x and y coordinates within the range of 0 to canvasSize - 1. These coordinates represent a random location on the canvas where the food can be placed.
  //this code block handles the logic of generating a random location
  return { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
  //Math.random() returns a random floating point number between 0,  and 1 (excluding 1)
  //Math.floor() rounds a number downwards to the nearest integer
  //Math.random() * canvasSize: generates random number between 0 (inclusive) and canvasSize (exclusive). Multiplying Math.random() by canvasSize scales the random number to the range of 0 to canvasSize.
  //The x and y values are generated independently using the previous expressions, resulting in random coordinates for the food location.
}

function detectDirection(event) {
  //In summary, the detectDirection(event) function handles key events and updates the direction variable based on the arrow keys pressed. 
  //It also performs the necessary actions to start the game if it hasn't already started and hides any instructions displayed to the player
  //this code block handles the logic of detecting the direction of the snake
  if (!gameStarted) { //check if the game has started
    gameStarted = true; //started game
    restartGame(); //initialize game
	  const instructions = document.querySelector('.press'); //get instructions element
    instructions.style.display = 'none'; //hide instructions after game has started
  }

  if (event.keyCode === 37 && direction !== 'right') { //Checks if the pressed key has a key code of 37, which corresponds to the left arrow key. 
    //Additionally, it ensures that the current direction is not already "right" to prevent the snake from turning back on itself.
    direction = 'left'; //if the conditions are met, the direction is set to "left".
  } else if (event.keyCode === 38 && direction !== 'down') {
    direction = 'up';
  } else if (event.keyCode === 39 && direction !== 'left') {
    direction = 'right';
  } else if (event.keyCode === 40 && direction !== 'up') {
    direction = 'down';
  }
}

function pauseGame() {
  //In summary, the pauseGame function ensures that the game can only be paused when it has started and is not already paused. 
  //It freezes the game state, hides the pause button, and displays the resume button to allow the player to continue playing from where they left off.
  //this code block handles the logic of pausing the game
  if (!gameStarted) return; // Only pause if the game has started
  if (paused) return; //check if the game is already paused

  paused = true; //set paused to true
  clearInterval(gameLoop); //stop game loop
  pauseButton.style.display = 'none'; //hide pause button
  resumeButton.style.display = 'inline-block'; //display resume button
}

function resumeGame() {
  if (!gameStarted) return; // Only resume if the game has started
  if (!paused) return; // Stop the function if the game is not paused

  paused = false; //set paused to false, game is no longer paused
  gameLoop = setInterval(() => { //resume game loop
    //define game logic
    moveSnake();
    clearCanvas();
    drawSnake();
    drawFood();
    updateScore();
    if (!collisionCheck()) { 
      //if coliision is not detected returns true, so if collision is detected returns false and executes gameOver()
      gameOver();
    }
  }, 150); //speed of game loop

  pauseButton.style.display = 'inline-block'; //display pause button
  resumeButton.style.display = 'none'; //hide resume button
}

const bestScoreElement = document.querySelector('.best-score'); //get best score element
let bestScore = localStorage.getItem('bestScore') || 0; //get best score from local storage, if no best score is found, set it to 0

function updateBestScore() { 
  //In summary, the updateBestScore() function updates the best score displayed to the player and stores it in the browser's local storage.
  bestScore = Math.max(score, bestScore); //compare current score and best score, set best score to the higher value
  //Math.max() returns the largest of zero or more numbers.
  bestScoreElement.innerText = bestScore; //update best score element
  localStorage.setItem('bestScore', bestScore); //store best score in local storage
}

document.addEventListener('keydown', detectDirection); //detect key press
restartButton.addEventListener('click', restartGame); //restart button, calls restartGame() function when clicked
pauseButton.addEventListener('click', pauseGame); //pause button, calls pauseGame() function when clicked
resumeButton.addEventListener('click', resumeGame); //resume button, calls resumeGame() function when clicked

// Hide resume button initially
resumeButton.style.display = 'none';
