const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Load fish image
const fishImage = new Image();
fishImage.src = 'fish.png'; // Make sure this file exists



// Fish properties
const fishWidth = 150;
const fishHeight = 200;
let fishX = (canvas.width - fishWidth) / 2;
const fishY = canvas.height - fishHeight - 10;
const fishSpeed = 7;

// Diamond properties
const diamondRadius = 10;
let diamondX = Math.random() * (canvas.width - diamondRadius * 2) + diamondRadius;
let diamondY = 0;
let diamondSpeed = 3;

// Game state
let rightPressed = false;
let leftPressed = false;
let score = 0;
let gameRunning = true;  // Track whether the game is running

// Event listeners for keyboard input
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = true;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        rightPressed = false;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

// Draw fish
function drawFish() {
    context.drawImage(fishImage, fishX, fishY, fishWidth, fishHeight);
}

// Draw diamond
function drawDiamond() {
    context.beginPath();
    context.moveTo(diamondX, diamondY - diamondRadius);
    context.lineTo(diamondX + diamondRadius, diamondY);
    context.lineTo(diamondX, diamondY + diamondRadius);
    context.lineTo(diamondX - diamondRadius, diamondY);
    context.closePath();
    context.fillStyle = '#B9F2FF';
    context.fill();
}

// Update game state
function update() {
    if (!gameRunning) return;  // If game is over, do not update

    // Move fish
    if (rightPressed && fishX < canvas.width - fishWidth) {
        fishX += fishSpeed;
    } else if (leftPressed && fishX > 0) {
        fishX -= fishSpeed;
    }

    // Move diamond
    diamondY += diamondSpeed;

    // Diamond collision with fish
    if (
        diamondY + diamondRadius > fishY &&
        diamondX > fishX &&
        diamondX < fishX + fishWidth
    ) {
        score++;
        resetDiamond();
    }

    // Diamond out of bounds
    if (diamondY - diamondRadius > canvas.height) {
        gameOver();
    }
}

// Reset diamond position
function resetDiamond() {
    diamondX = Math.random() * (canvas.width - diamondRadius * 2) + diamondRadius;
    diamondY = 0;
    if (score % 5 === 0) {
        diamondSpeed += 1; // Increase speed every 5 points
    }
}

// Game over logic
function gameOver() {
    gameRunning = false;
    alert('Game Over! Your score was: ' + score);
    setTimeout(restartGame, 1000); // Restart the game after a 1-second delay
}

// Restart the game
function restartGame() {
    score = 0;
    fishX = (canvas.width - fishWidth) / 2;
    diamondX = Math.random() * (canvas.width - diamondRadius * 2) + diamondRadius;
    diamondY = 0;
    diamondSpeed = 3;
    gameRunning = true;
}

// Draw everything
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawFish();
    drawDiamond();

    // Draw score
    context.font = '16px Arial';
    context.fillStyle = '#333';
    context.fillText('Score: ' + score, 8, 20);

    update();
}

// Main game loop
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Ensure the game starts only when the image is loaded
fishImage.onload = gameLoop;
