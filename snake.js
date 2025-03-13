// === Game Settings ===
var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;

// === Snake ===
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];

// === Food ===
var foodX;
var foodY;

// === Game State ===
var gameOver = false;
var gameStarted = false;
var gameInterval;
var gameSpeed = 100;

// === Score ===
var score = 0;
var topScore = 0;

// === Tongue Animation ===
var tongueVisible = false;
var tongueTimer = 0;
var tongueInterval = 3000; // 3 seconds
var tongueDisplayTime = 1000; // 1 second

// === Slow Power-up ===
var slowPowerupX = -1;
var slowPowerupY = -1;
var isSlowActive = false;
var slowTimer = 0;
var slowDuration = 10000; // 10s effect
var powerupSpawnTimer = 0;
var powerupSpawnInterval = 10000; // every 10s
var powerupActiveTimer = 0;
var powerupActiveTime = 10000; // disappear after 10s

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");

    const playButton = document.getElementById("playButton");
    const replayButton = document.getElementById("replayButton");

    playButton.addEventListener("click", startGame);
    replayButton.addEventListener("click", startGame);

    document.addEventListener("keydown", function (e) {
        if ((!gameStarted || gameOver) && (e.code === "Space" || e.code.startsWith("Arrow"))) {
            startGame();
        }
    });

    context.fillStyle = "#18230F";
    context.fillRect(0, 0, board.width, board.height);
};

function startGame() {
    if (!gameStarted || gameOver) {
        gameSpeed = 100;
        isSlowActive = false;
        slowTimer = 0;
        powerupSpawnTimer = 0;
        powerupActiveTimer = 0;
        slowPowerupX = -1;
        slowPowerupY = -1;
        gameStarted = true;
        score = 0;
        updateScore();
        document.getElementById("playButton").classList.add("hidden");
        document.getElementById("replayButton").classList.add("hidden");
        const statsElement = document.querySelector('.game-over-stats');
        if (statsElement) statsElement.remove();
        resetGame();
        document.addEventListener("keyup", changeDirection);
        restartGameInterval();
    }
}

function resetGame() {
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 1;
    velocityY = 0;
    snakeBody = [
        [snakeX - blockSize, snakeY],
        [snakeX - blockSize * 2, snakeY]
    ];
    placeFood();
}

function restartGameInterval() {
    clearInterval(gameInterval);
    gameInterval = setInterval(update, gameSpeed);
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function updateScore() {
    document.getElementById("score").textContent = score;
    if (score > topScore) {
        topScore = score;
        document.getElementById("topScore").textContent = topScore;
    }
}

function handleGameOver() {
    gameOver = true;
    clearInterval(gameInterval);
    const statsDiv = document.createElement('div');
    statsDiv.className = 'game-over-stats';
    statsDiv.innerHTML = `
        <div>Final Score: ${score}</div>
        <div>Top Score: ${topScore}</div>
    `;
    document.getElementById('game-container').appendChild(statsDiv);
    document.getElementById("replayButton").classList.remove("hidden");
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

function update() {
    if (gameOver) return;

    let nextX = snakeX + velocityX * blockSize;
    let nextY = snakeY + velocityY * blockSize;

    if (nextX < 0 || nextX >= cols * blockSize || nextY < 0 || nextY >= rows * blockSize) {
        handleGameOver();
        return;
    }

    context.fillStyle = "#18230F";
    context.fillRect(0, 0, board.width, board.height);

    // Draw apple
    context.beginPath();
    context.fillStyle = "#FF0000";
    context.arc(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2 - 2, 0, 2 * Math.PI);
    context.fill();
    context.fillStyle = "#4B2504";
    context.fillRect(foodX + blockSize / 2 - 2, foodY + 2, 4, 6);
    context.fillStyle = "#4CAF50";
    context.beginPath();
    context.ellipse(foodX + blockSize / 2 + 4, foodY + 6, 6, 4, Math.PI / 4, 0, 2 * Math.PI);
    context.fill();

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 1;
        updateScore();
    }

    // Update snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX = nextX;
    snakeY = nextY;

    // Draw snake body
    context.fillStyle = "#F6DC43";
    for (let i = 0; i < snakeBody.length; i++) {
        let segment = snakeBody[i];
        context.fillRect(segment[0], segment[1], blockSize, blockSize);
        context.fillStyle = "#DAC339";
        context.beginPath();
        context.arc(segment[0] + blockSize / 3, segment[1] + blockSize / 2, 3, 0, 2 * Math.PI);
        context.arc(segment[0] + 2 * blockSize / 3, segment[1] + blockSize / 2, 3, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = "#F6DC43";
    }

    // Draw head and eyes
    context.fillStyle = "#F6DC43";
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    context.fillStyle = "black";
    let eyeOffset = 4;
    if (velocityX === 1) {
        drawEyes(snakeX + blockSize - eyeOffset, snakeY);
    } else if (velocityX === -1) {
        drawEyes(snakeX + eyeOffset, snakeY);
    } else if (velocityY === -1) {
        drawEyes(snakeX, snakeY + eyeOffset, true);
    } else if (velocityY === 1) {
        drawEyes(snakeX, snakeY + blockSize - eyeOffset, true);
    }

    // Tongue logic
    tongueTimer += 100;
    if (tongueTimer >= tongueInterval) {
        tongueVisible = true;
        tongueTimer = 0;
    } else if (tongueTimer >= tongueDisplayTime) {
        tongueVisible = false;
    }

    if (tongueVisible) drawTongue();

    // Collision with self
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            handleGameOver();
        }
    }

    // === Power-up Logic ===
    powerupSpawnTimer += 100;
    if (powerupSpawnTimer >= powerupSpawnInterval) {
        powerupSpawnTimer = 0;
        if (Math.random() < 0.5 && !isSlowActive && slowPowerupX === -1) {
            slowPowerupX = Math.floor(Math.random() * cols) * blockSize;
            slowPowerupY = Math.floor(Math.random() * rows) * blockSize;
        }
    }

    // Draw slow powerup
    if (slowPowerupX >= 0 && slowPowerupY >= 0) {
        powerupActiveTimer += 100;
        if (powerupActiveTimer >= powerupActiveTime) {
            slowPowerupX = -1;
            slowPowerupY = -1;
            powerupActiveTimer = 0;
        } else {
            const centerX = slowPowerupX + blockSize / 2;
            const centerY = slowPowerupY + blockSize / 2;
            const radius = blockSize / 3;
    
            // Clock face
            context.fillStyle = "#ffffff";
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            context.fill();
            context.strokeStyle = "#4169E1";
            context.lineWidth = 3;
            context.stroke();
    
            // Tick marks
            context.strokeStyle = "#000";
            context.lineWidth = 1;
            for (let angle = 0; angle < 360; angle += 30) {
                const rad = angle * Math.PI / 180;
                const x1 = centerX + radius * 0.85 * Math.cos(rad);
                const y1 = centerY + radius * 0.85 * Math.sin(rad);
                const x2 = centerX + radius * Math.cos(rad);
                const y2 = centerY + radius * Math.sin(rad);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();
            }
    
            // Minute hand (rotates)
            const progress = powerupActiveTimer / powerupActiveTime;
            const handAngle = -Math.PI / 2 + progress * 2 * Math.PI; // start at top
            const handLength = radius * 0.7;
    
            context.strokeStyle = "#4169E1";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(centerX, centerY);
            context.lineTo(
                centerX + handLength * Math.cos(handAngle),
                centerY + handLength * Math.sin(handAngle)
            );
            context.stroke();
    
            // Center dot
            context.fillStyle = "#4169E1";
            context.beginPath();
            context.arc(centerX, centerY, 2, 0, 2 * Math.PI);
            context.fill();
        }
    }
    

    // Collect slow power-up
    if (snakeX === slowPowerupX && snakeY === slowPowerupY) {
        isSlowActive = true;
        slowTimer = 0;
        slowPowerupX = -1;
        slowPowerupY = -1;
        powerupActiveTimer = 0;
        gameSpeed = 200;
        restartGameInterval();
    }

    // Handle slow effect timeout
    if (isSlowActive) {
        slowTimer += 100;
    
        // Percentage of time remaining
        const progress = 1 - slowTimer / slowDuration;
        const totalLength = board.width * 2 + board.height * 2;
        const visibleLength = totalLength * progress;
    
        context.strokeStyle = "#4169E1";
        context.lineWidth = 6;
    
        context.beginPath();
    
        let remaining = visibleLength;
    
        // Top
        let topLen = Math.min(remaining, board.width);
        if (topLen > 0) {
            context.moveTo(0, 0);
            context.lineTo(topLen, 0);
            remaining -= topLen;
        }
    
        // Right
        let rightLen = Math.min(remaining, board.height);
        if (rightLen > 0) {
            context.moveTo(board.width, 0);
            context.lineTo(board.width, rightLen);
            remaining -= rightLen;
        }
    
        // Bottom
        let bottomLen = Math.min(remaining, board.width);
        if (bottomLen > 0) {
            context.moveTo(board.width, board.height);
            context.lineTo(board.width - bottomLen, board.height);
            remaining -= bottomLen;
        }
    
        // Left
        let leftLen = Math.min(remaining, board.height);
        if (leftLen > 0) {
            context.moveTo(0, board.height);
            context.lineTo(0, board.height - leftLen);
        }
    
        context.stroke();
    
        // Label
        context.fillStyle = "#4169E1";
        context.font = "16px Arial";
        context.fillText("0.5x Speed", 10, 20);
    
        if (slowTimer >= slowDuration) {
            isSlowActive = false;
            gameSpeed = 100;
            restartGameInterval();
        }
    }
    
}

// Helper to draw snake eyes
function drawEyes(x, y, vertical = false) {
    context.beginPath();
    if (vertical) {
        context.arc(x + 4, y, 2, 0, 2 * Math.PI);
        context.arc(x + blockSize - 4, y, 2, 0, 2 * Math.PI);
    } else {
        context.arc(x, y + 4, 2, 0, 2 * Math.PI);
        context.arc(x, y + blockSize - 4, 2, 0, 2 * Math.PI);
    }
    context.fill();
}

// Helper to draw snake tongue
function drawTongue() {
    context.strokeStyle = "#FF0066";
    context.lineWidth = 2;

    const shaftLength = 12;
    const forkLength = 6;
    const forkAngle = Math.PI / 6; // 30 degrees for fork split
    let startX, startY, endX, endY;

    if (velocityX === 1) { // right
        startX = snakeX + blockSize;
        startY = snakeY + blockSize / 2;
        endX = startX + shaftLength;
        endY = startY;
    } else if (velocityX === -1) { // left
        startX = snakeX;
        startY = snakeY + blockSize / 2;
        endX = startX - shaftLength;
        endY = startY;
    } else if (velocityY === -1) { // up
        startX = snakeX + blockSize / 2;
        startY = snakeY;
        endX = startX;
        endY = startY - shaftLength;
    } else if (velocityY === 1) { // down
        startX = snakeX + blockSize / 2;
        startY = snakeY + blockSize;
        endX = startX;
        endY = startY + shaftLength;
    } else {
        return; // Snake is stationary
    }

    // Main tongue shaft
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();

    // Forked ends (Y shape)
    context.beginPath();
    if (velocityX !== 0) {
        const forkY1 = endY - forkLength * Math.tan(forkAngle);
        const forkY2 = endY + forkLength * Math.tan(forkAngle);
        const forkX = (velocityX === 1) ? endX + forkLength : endX - forkLength;

        context.moveTo(endX, endY);
        context.lineTo(forkX, forkY1);
        context.moveTo(endX, endY);
        context.lineTo(forkX, forkY2);
    } else {
        const forkX1 = endX - forkLength * Math.tan(forkAngle);
        const forkX2 = endX + forkLength * Math.tan(forkAngle);
        const forkY = (velocityY === 1) ? endY + forkLength : endY - forkLength;

        context.moveTo(endX, endY);
        context.lineTo(forkX1, forkY);
        context.moveTo(endX, endY);
        context.lineTo(forkX2, forkY);
    }

    context.stroke();
}

