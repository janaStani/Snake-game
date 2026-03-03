const canvas = document.querySelector('.snakeCanv');
const ctx = canvas.getContext("2d");

//select elements and assign them to variables
const scoreNumber = document.querySelector('.score-number');
const scoreMax = document.querySelector('.max-score-number');

const start = document.querySelector('.button-start');
const restart = document.querySelector('.button-restart');

//get width and height from canvas
const width = canvas.width;
const height = canvas.height;

//define block size and width, height in blocks
const blockSize = 5;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

//initialize score
let score = 0;

//funct to get score
const drawScore = () => {
  scoreNumber.textContent = score;
};

//get max or set to 0 if it doesn't exist
let maxNumber = localStorage.getItem('number') || 0;

//funct to get max score on screen, if current score is higher than max, set max to current score
const drawMaxScore = () => {
  if (maxNumber < score) {
    maxNumber = score;
    localStorage.setItem('number', maxNumber);
  }
  scoreMax.textContent = maxNumber;
};

//when game over, show restart button, show game over text
const gameOver = () => {
  playing = false;
  restart.style.visibility = "visible";
  ctx.font = '5em "Roboto Condensed", Sans-Serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', width / 3, height / 3);
};

class Block {
  //constructor takes col and row as arguments
  constructor(col, row) {
    this.col = col; //assign col
    this.row = row; //assign row
  }

  //method to draw a square block with a specified color
  drawSquare(color) {
    //calculate coordinates of the top-left corner
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    
    //set fill style and draw a block filled with the color
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  //comparing two blocks if they occupy the same position in the grid
  equal(otherBlock) {
    // return true if they have the same column and row values, otherwise return false
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
  //to check if the head of a snake in a game collides with its own body or with other game elements
}

class Snake {
  //keep track of the snake's position and movement throughout the game. 
  constructor() {
    this.segments = [
      new Block(7, 5),
      new Block(6, 5),
      new Block(5, 5),
    ];
    
    //initial direction of the snake
    this.direction = 'right';
  }

  //method to draw the sanke on the canvas
  draw() {
    //go through each segment 
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].drawSquare('#69802e'); //draw the segments
    }
  }

  move() {
    let head = this.segments[0]; //get current segment

    //new head position based on current move
    switch (this.direction) {
      case 'right':
        newHead = new Block(head.col + 1, head.row); //increment col by 1, keep row the same
        break;
      case 'down':
        newHead = new Block(head.col, head.row + 1); //keep col the same, increment row by 1
        break;
      case 'left':
        newHead = new Block(head.col - 1, head.row); //decrement col by 1, keep row the same
        break;
      case 'up':
        newHead = new Block(head.col, head.row - 1); //keep col the same, decrement row by 1
        break;
      default:
        break;
    }
    
    //check if the new head collides with the wall or itself
    if (this.checkCollision(newHead)) {
      if (newHead.col === 0 || newHead.col === widthInBlocks - 1 || newHead.row === 0 || newHead.row === heightInBlocks - 1) { 
        //check if is located on any of the four edges of the game field, left, right, top, bottom
        gameOver(); //if so, game over
        return;
      }
    }

    if (newHead.equal(apple.position)) {
      score++;
      if (score < 17) {
        animationTime -= 5;
      } else {
        animationTime = 15;
      }
      apple.move(this.segments);
    } else {
      this.segments.pop();
    }
    this.segments.unshift(newHead);
  }

checkCollision(head) {
  const leftCollision = head.col === 0;
  const topCollision = head.row === 0;
  const rightCollision = head.col === widthInBlocks - 1;
  const bottomCollision = head.row === heightInBlocks - 1;
  const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
  let selfCollision = false;

  for (let i = 1; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
      break;
    }
  }

  return wallCollision || selfCollision;
}


setDirection(newDirection) {
	if ((this.direction === 'up' && newDirection === 'down') ||
	(this.direction === 'right' && newDirection === 'left') ||
	(this.direction === 'down' && newDirection === 'up') ||
	(this.direction === 'left' && newDirection === 'right')) {
		return;
	}
	this.nextDirection = newDirection;
	}
}

class Apple {
constructor() {
this.position = new Block(10, 10);
}

draw() {
this.position.drawSquare('SeaGreen');
}

move(otherBlock) {
let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
this.position = new Block(randomCol, randomRow);
let index = otherBlock.length - 1;
while (index >= 0) {
if (this.position.equal(otherBlock[index])) {
this.move(otherBlock);
return;
}
index--;
}
}
}

let snake = new Snake();
let apple = new Apple();

let animationTime = 100;
let playing = true;

const gameLoop = () => {
ctx.clearRect(0, 0, width, height);
drawScore();
drawMaxScore();
snake.move();
snake.draw();
apple.draw();
if (playing) {
setTimeout(gameLoop, animationTime);
}
};

const directions = {
ArrowLeft: 'left',
ArrowUp: 'up',
ArrowRight: 'right',
ArrowDown: 'down',
};

document.body.addEventListener('keydown', (e) => {
const newDirection = directions[e.key];
if (newDirection !== undefined) {
snake.setDirection(newDirection);
}
});

const drawGameField = () => {
drawScore();
drawMaxScore();
snake.draw();
apple.draw();
};

drawGameField();

start.addEventListener('click', () => {
gameLoop();
start.style.display = 'none';
});

restart.addEventListener('click', () => {
score = 0;
snake = new Snake();
apple = new Apple();
playing = true;
animationTime = 100;
gameLoop();
restart.style.visibility = 'hidden';
}); 