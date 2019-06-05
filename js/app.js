// declaring important variable of different modales
let modal = document.querySelector(".start-game");
let overlay = document.querySelector(".overlay");
let gameover = document.querySelector(".game-over");
let winnerModal = document.querySelector(".winner");
//game started
let game = true;
// points and player lives
var playerPoints = 0;
var playerLives = 3;

//this function starts the game
function startGame(){
    modal.classList.add("hide");
    overlay.classList.add("hide");
    // Initial figures
    playerPoints = 0;
}

//when player lost all lives
function gameOver(){
    overlay.classList.add("show");
    gameover.classList.add("show");
}

// this function resets the game
function resetGame(){
    window.location.reload(true);
    let game = true;
}

// funtion runs to check lives
function checkLives(){
    if (alllives.length === 0){
        gameOver();
    }
}

// function for when player gets all 5 keys and wins game
function youWin(){
    overlay.classList.add("show");
    winnerModal.classList.add("show");
}
// Enemies our player must avoid
var Enemy = function(enemyX, enemyY, enemySprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = enemyX;
    this.y = enemyY;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = enemySprite;
    this.height= 65;
    this.width= 95;
    //collision check
    this.collisionCheck = false;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  //reset the bug position, bring the bug again to the left of the screen
  // by multiply the x position to -ve number and random number
    if (this.x > (ctx.canvas.width + this.width)){
        this.x = -200 * Math.floor(Math.random() * 5) + 1;
    } else {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
        this.x += 150 * dt;
    }
    // check if there is collisionDetected
    if (collisionDetected(player.x, player.y, player.width, player.height, this.x, this.y, this.width, this.height)){
        this.collisionCheck = true;
        //if collision happens reset player position to original
        if (player){
        player.resetPosition();
        alllives.pop();
        playerLives -= 1;
        if (playerPoints >= 50){
            playerPoints -= 50;
          }
        }
        } else {
          this.collisionCheck = false;
        }
    checkLives();
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Player = function(playX, playY, playSprite) {
  this.x = playX;
  this.y = playY;
  this.sprite = playSprite;
  this.height= 75;
  this.width= 65;
};
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function() {
    if ( game && this.y < 40){
      allKeys.push(new Key(this.x, this.y));
      playerPoints += 100;
      player.resetPosition();
    }
    if (allKeys.length == 5){
    game = false;
    youWin();
}
}
Player.prototype.handleInput = function(movementDirection){
  const horizontal = 100;
  const vertical = 83;

  if (movementDirection === "left" && this.x - horizontal >= 0 ){
    this.x -= horizontal;
  }
  else if (movementDirection === "right" && ((this.x + horizontal) < (ctx.canvas.width - 5))){
      this.x += horizontal;
  }
  else if (movementDirection === "down" && this.y + vertical < (ctx.canvas.height - 200)) {
    this.y += vertical;
  }
  else if (movementDirection === "up" && ((this.y - vertical) > (0 - player.height))) {
    this.y -= vertical;
  }
};
//Move player back to its initial position after collision with enemy and dropping the key on the ground
Player.prototype.resetPosition = function () {
    this.x = 202;
    this.y = 400;
};
// Lives class
var Lives = function(lx, ly){
    this.x = lx;
    this.y = ly
    this.sprite = 'images/Heart.png';
};
// render method for Lives class
Lives.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 28, 42);
};
// Key class
var Key = function(x, y){
    this.x = x;
    this.y = y;
    this.sprite = 'images/Key.png';
}
// draws keys on the canvas
Key.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, 35, 90, 110);
}


// class to give player points
var Points = function(x, y, score){
    this.x = x;
    this.y = y;
    this.score = "Your points: "+ playerPoints
};
Points.prototype.render = function(){
    ctx.font = '20px serif';
    ctx.fillText(this.score, this.x, this.y);
};
Points.prototype.update = function(){
    this.score = "Your points: "+ playerPoints
};
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
// Define Enemy possible Y-axis positions on board
enemyYPositions = [60, 140, 220];
// Now instantiate your objects.
// Place the player object in a variable called player
var player = new Player(200, 400, 'images/char-princess-girl.png');
// Place all enemy objects in an array called allEnemies
let allEnemies = enemyYPositions.map((y, index) => {
  return new Enemy((-200 * (index +1)), y, 'images/enemy-bug.png');
});
// instantiate lives
var alllives = [ new Lives(10, 540), new Lives(40, 540), new Lives(70, 540)];

var allKeys = [ ];

var points = new Points(350, 570);

//Collision Detection
function collisionDetected(pX, pY, pW, pH, eX, eY, eW, eH){
  //Solution Copied from stack overflow post regarding collision detection
  return (Math.abs(pX - eX) * 2 < pW + eW) && (Math.abs(pY - eY) * 2 < pH + eH);
}
