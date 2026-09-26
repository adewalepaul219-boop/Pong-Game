// ===============================
// CANVAS
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerScoreText = document.getElementById("playerScore");
const computerScoreText = document.getElementById("computerScore");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");


// ===============================
// SCORE
// ===============================

let playerScore = 0;
let computerScore = 0;

const winningScore = 10;

let gameRunning = true;


// ===============================
// PLAYER
// ===============================

const player = {
    x: 20,
    y: 100,
    width: 14,
    height: 100,
    speed: 8
};


// ===============================
// COMPUTER
// ===============================

const computer = {
    x: 0,
    y: 100,
    width: 14,
    height: 100,
    speed: 5
};


// ===============================
// BALL
// ===============================

const ball = {
    x: 0,
    y: 0,
    radius: 10,
    speed: 6,
    dx: 6,
    dy: 3
};


// ===============================
// KEYBOARD
// ===============================

const keys = {
    ArrowUp: false,
    ArrowDown: false
};

document.addEventListener("keydown", function (event) {

    if (event.key === "ArrowUp") {
        keys.ArrowUp = true;
        event.preventDefault();
    }

    if (event.key === "ArrowDown") {
        keys.ArrowDown = true;
        event.preventDefault();
    }

});

document.addEventListener("keyup", function (event) {

    if (event.key === "ArrowUp") {
        keys.ArrowUp = false;
    }

    if (event.key === "ArrowDown") {
        keys.ArrowDown = false;
    }

});


// ===============================
// RESIZE GAME
// ===============================

function resizeGame() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    player.x = 20;

    player.y =
        canvas.height / 2 -
        player.height / 2;

    computer.x =
        canvas.width -
        computer.width -
        20;

    computer.y =
        canvas.height / 2 -
        computer.height / 2;

    resetBall();
}


// ===============================
// RESET BALL
// ===============================

function resetBall(direction) {

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    if (!direction) {
        direction =
            Math.random() > 0.5 ? 1 : -1;
    }

    ball.dx = ball.speed * direction;

    ball.dy =
        Math.random() * 4 - 2;

    if (Math.abs(ball.dy) < 1) {
        ball.dy = ball.dy < 0 ? -1.5 : 1.5;
    }
}


// ===============================
// MOUSE CONTROL
// ===============================

canvas.addEventListener("mousemove", function (event) {

    const rect =
        canvas.getBoundingClientRect();

    const mouseY =
        event.clientY - rect.top;

    player.y =
        mouseY - player.height / 2;

    keepPlayerInside();

});


// ===============================
// TOUCH CONTROL
// ===============================

canvas.addEventListener("touchmove", function (event) {

    const rect =
        canvas.getBoundingClientRect();

    const touchY =
        event.touches[0].clientY - rect.top;

    player.y =
        touchY - player.height / 2;

    keepPlayerInside();

    event.preventDefault();

}, { passive: false });


// ===============================
// PLAYER MOVEMENT
// ===============================

function updatePlayer() {

    if (keys.ArrowUp) {
        player.y -= player.speed;
    }

    if (keys.ArrowDown) {
        player.y += player.speed;
    }

    keepPlayerInside();
}


function keepPlayerInside() {

    if (player.y < 0) {
        player.y = 0;
    }

    if (
        player.y + player.height >
        canvas.height
    ) {
        player.y =
            canvas.height - player.height;
    }
}


// ===============================
// COMPUTER MOVEMENT
// ===============================

function updateComputer() {

    const computerCenter =
        computer.y +
        computer.height / 2;

    if (ball.y > computerCenter) {
        computer.y += computer.speed;
    }

    if (ball.y < computerCenter) {
        computer.y -= computer.speed;
    }

    if (computer.y < 0) {
        computer.y = 0;
    }

    if (
        computer.y + computer.height >
        canvas.height
    ) {
        computer.y =
            canvas.height - computer.height;
    }
}


// ===============================
// BALL MOVEMENT
// ===============================

function updateBall() {

    ball.x += ball.dx;
    ball.y += ball.dy;


    // TOP WALL

    if (ball.y - ball.radius <= 0) {

        ball.y = ball.radius;

        ball.dy *= -1;
    }


    // BOTTOM WALL

    if (
        ball.y + ball.radius >=
        canvas.height
    ) {

        ball.y =
            canvas.height - ball.radius;

        ball.dy *= -1;
    }


    // PLAYER COLLISION

    if (
        ball.x - ball.radius <=
        player.x + player.width &&

        ball.x + ball.radius >=
        player.x &&

        ball.y >= player.y &&

        ball.y <=
        player.y + player.height &&

        ball.dx < 0
    ) {

        ball.x =
            player.x +
            player.width +
            ball.radius;

        ball.dx *= -1;

        changeBallAngle(player);
    }


    // COMPUTER COLLISION

    if (
        ball.x + ball.radius >=
        computer.x &&

        ball.x - ball.radius <=
        computer.x + computer.width &&

        ball.y >= computer.y &&

        ball.y <=
        computer.y + computer.height &&

        ball.dx > 0
    ) {

        ball.x =
            computer.x -
            ball.radius;

        ball.dx *= -1;

        changeBallAngle(computer);
    }


    // COMPUTER SCORES

    if (ball.x < 0) {

        computerScore++;

        computerScoreText.textContent =
            computerScore;

        if (checkWinner()) {
            return;
        }

        resetBall(-1);
    }


    // PLAYER SCORES

    if (ball.x > canvas.width) {

        playerScore++;

        playerScoreText.textContent =
            playerScore;

        if (checkWinner()) {
            return;
        }

        resetBall(1);
    }
}


// ===============================
// BALL ANGLE
// ===============================

function changeBallAngle(paddle) {

    const paddleCenter =
        paddle.y +
        paddle.height / 2;

    const difference =
        ball.y - paddleCenter;

    const percentage =
        difference /
        (paddle.height / 2);

    ball.dy = percentage * 5;

    ball.dx *= 1.03;
}


// ===============================
// WINNER
// ===============================

function checkWinner() {

    if (playerScore >= winningScore) {

        message.textContent =
            "🎉 YOU WIN!";

        gameRunning = false;

        return true;
    }

    if (computerScore >= winningScore) {

        message.textContent =
            "🤖 COMPUTER WINS!";

        gameRunning = false;

        return true;
    }

    return false;
}


// ===============================
// DRAW BACKGROUND
// ===============================

function drawBackground() {

    ctx.fillStyle = "#111111";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // CENTER LINE

    ctx.beginPath();

    ctx.setLineDash([10, 10]);

    ctx.moveTo(
        canvas.width / 2,
        0
    );

    ctx.lineTo(
        canvas.width / 2,
        canvas.height
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.3)";

    ctx.lineWidth = 2;

    ctx.stroke();

    ctx.setLineDash([]);
}


// ===============================
// DRAW PADDLE
// ===============================

function drawPaddle(paddle) {

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );
}


// ===============================
// DRAW BALL
// ===============================

function drawBall() {

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";

    ctx.fill();

    ctx.closePath();
}


// ===============================
// DRAW EVERYTHING
// ===============================

function draw() {

    drawBackground();

    drawPaddle(player);

    drawPaddle(computer);

    drawBall();
}


// ===============================
// GAME LOOP
// ===============================

function gameLoop() {

    if (gameRunning) {

        updatePlayer();

        updateComputer();

        updateBall();
    }

    draw();

    requestAnimationFrame(gameLoop);
}


// ===============================
// RESTART BUTTON
// ===============================

restartBtn.addEventListener("click", function () {

    playerScore = 0;
    computerScore = 0;

    playerScoreText.textContent = "0";
    computerScoreText.textContent = "0";

    message.textContent = "";

    gameRunning = true;

    player.y =
        canvas.height / 2 -
        player.height / 2;

    computer.y =
        canvas.height / 2 -
        computer.height / 2;

    resetBall();
});


// ===============================
// START GAME
// ===============================

window.addEventListener(
    "resize",
    resizeGame
);

resizeGame();

gameLoop();