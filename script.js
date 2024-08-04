// Define all variables
const mainBoard = document.querySelector('#mainCanvas');
const UpBtn = document.getElementById('up');
const DownBtn = document.getElementById('down');
const RightBtn = document.getElementById('right');
const LeftBtn = document.getElementById('left');
const scoreText = document.querySelector('#ScoreText');
const resetBtn = document.getElementById('ResetBTN');
const EasyDiff = document.getElementById('Easy');
const MidDiff = document.getElementById('Mid');
const HardDiff = document.getElementById('Hard');
const SpeedBtn = document.getElementById('SpeedBtn');

// Set canvas dimensions
const Wdith = window.innerWidth;
let unitsize = Wdith > 767 ? 22.5 : 17;
const gameUnits = 20;
const gameWidth = unitsize * gameUnits;
const gameHeight = unitsize * gameUnits;

mainBoard.width = gameWidth;
mainBoard.height = gameHeight;

const ctx = mainBoard.getContext("2d");

// Game settings
const SnakeColor = 'green';
const HeadColor = 'blue';
const SnakeBorder = 'black';
const foodColor = 'red';
let score = 0;
let running = false;
let xVel = unitsize;
let yVel = 0;
let foodX, foodY;
let Snake = [
    { x: unitsize * 2, y: 0 },
    { x: unitsize, y: 0 },
    { x: 0, y: 0 }
];    
let TimeOut = 125;
let gameLoop;

// Event listeners
window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);
EasyDiff.addEventListener('click', () => chooseDiff('Easy'));
MidDiff.addEventListener('click', () => chooseDiff('Mid'));
HardDiff.addEventListener('click', () => chooseDiff('Hard'));

// Add event listeners for direction buttons
UpBtn.addEventListener('click', () => updateDirection('up'));
DownBtn.addEventListener('click', () => updateDirection('down'));
RightBtn.addEventListener('click', () => updateDirection('right'));
LeftBtn.addEventListener('click', () => updateDirection('left'));

// Start the game
startGame();

// Functions
function startGame() {
    drawFood();
    // Clear any existing game loop
    if (gameLoop) {
        clearTimeout(gameLoop);
    }
    
    running = true;
    scoreText.textContent = score;
    createFood();
    nextTick();
}

function chooseDiff(Chosen) {
    switch (Chosen) {
        case 'Easy':
            TimeOut = 175;
            SpeedBtn.textContent = 'Slow'
            break;
        case 'Mid':
            TimeOut = 125;
            SpeedBtn.textContent = 'Normal'
            break;
        case 'Hard':
            TimeOut = 75;
            SpeedBtn.textContent = 'Fast'
            break;
    }
    resetGame();
}

function nextTick() {
    if (running) {
        gameLoop = setTimeout(() => {  // Save the current timeout ID
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, TimeOut);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitsize) * unitsize;
    }
    foodX = randomFood(0, gameWidth - unitsize);
    foodY = randomFood(0, gameHeight - unitsize);
    // Ensure food is not placed on the snake
    Snake.forEach(part => {
        if (part.x === foodX && part.y === foodY) {
            createFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitsize, unitsize);
}

function moveSnake() {
    const head = { x: Snake[0].x + xVel, y: Snake[0].y + yVel };
    Snake.unshift(head);

    // Check if the snake has eaten the food
    if (Snake[0].x === foodX && Snake[0].y === foodY) {
        score++;
        scoreText.textContent = score;
        createFood();
    } else {
        Snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = SnakeColor;
    ctx.strokeStyle = SnakeBorder;
    
    // Separate the head from the body
    const head = Snake[0];
    const body = Snake.slice(1);
    
    // Draw the head with a different color
    ctx.fillStyle = HeadColor;
    ctx.fillRect(head.x, head.y, unitsize, unitsize);
    ctx.strokeRect(head.x, head.y, unitsize, unitsize);

    // Draw the rest of the body
    ctx.fillStyle = SnakeColor;
    ctx.strokeStyle = SnakeBorder;
    body.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitsize, unitsize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitsize, unitsize);
    });
}

function updateDirection(direction) {
    const goingUp = (yVel == -unitsize);
    const goingDown = (yVel == unitsize);
    const goingRight = (xVel == unitsize);
    const goingLeft = (xVel == -unitsize);

    switch (direction) {
        case 'left':
            if (!goingRight) {
                xVel = -unitsize;
                yVel = 0;
            }
            break;
        case 'right':
            if (!goingLeft) {
                xVel = unitsize;
                yVel = 0;
            }
            break;
        case 'up':
            if (!goingDown) {
                xVel = 0;
                yVel = -unitsize;
            }
            break;
        case 'down':
            if (!goingUp) {
                xVel = 0;
                yVel = unitsize;
            }
            break;
    }
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const left = 37, up = 38, right = 39, down = 40;

    switch (keyPressed) {
        case left:
            updateDirection('left');
            break;
        case right:
            updateDirection('right');
            break;
        case up:
            updateDirection('up');
            break;
        case down:
            updateDirection('down');
            break;
    }
}

function checkGameOver() {
    switch (true) {
        case (Snake[0].x < 0):
        case (Snake[0].x >= gameWidth):
        case (Snake[0].y < 0):
        case (Snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < Snake.length; i++) {
        if (Snake[i].x === Snake[0].x && Snake[i].y === Snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.fillText('Game Over', gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame() {
    // Clear any existing game loop
    if (gameLoop) {
        clearTimeout(gameLoop);
    }
    
    score = 0;
    xVel = unitsize;
    yVel = 0;
    Snake = [
        { x: unitsize * 2, y: 0 },
        { x: unitsize, y: 0 },
        { x: 0, y: 0 }
    ];
    startGame();
}