// GLOBAL VARIABLES
const game = document.getElementById('game');
const score = document.getElementById('score');
const cash = document.getElementById('cash');
let player;
let turret1;
let turret2;
let turret3;
let bug;
const turretBtn1 = document.getElementById('buy-turret-1');
const turretBtn2 = document.getElementById('buy-turret-2');
const turretBtn3 = document.getElementById('buy-turret-3');
const bgi = document.getElementById('backgroundImg');
const ctx = game.getContext('2d');

//====== CANVAS RENDERING SETUP ======
game.width = 1280;
game.height = 720;

ctx.drawImage(bgi, 0, 0);


//====== CRAWLER CLASS ======
class Crawler {
    constructor(x, y, color, width, height) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.height = height;
      this.width = width;
      this.alive = true;
  
      this.render = function () {
        ctx.fillStyle = this.color; // change the color of the context (ctx)
        ctx.fillRect(this.x, this.y, this.width, this.height);
      };
    }
  }

class Turret {
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.height = height;
        this.width = width;
        this.alive = true;
        this.tripN;
        this.tripS;
        this.tripNId;
        this.tripSId;
    
        this.render = function () {
          ctx.strokeStyle = this.color; // change the color of the context (ctx)
          ctx.strokeRect(this.x, this.y, this.width, this.height);
        };
    }
}

class Character {
    constructor(x, y, image, width, height) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.height = height;
        this.width = width;
        this.alive = true;

        this.render = function() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

//TODO: rethink trip wire methods


/* let testCrawler = new Crawler(20, 185, 'blue', 20, 70);
testCrawler.render();

let testTurret1 = new Turret(100, 54, 'yellow', 40, 40);
testTurret1.render();

let testTurret2 = new Turret(100, 201, 'yellow', 40, 40);
testTurret2.render();

let testTurret3 = new Turret(100, 348, 'yellow', 40, 40);
testTurret3.render();

//drawing tripwire
//north tripwire of T1
ctx.beginPath();
ctx.moveTo(120, 54);
ctx.lineTo(120, 0);
ctx.strokeStyle = 'red';
ctx.stroke();

//south trip of T1
ctx.beginPath();
ctx.moveTo(120, 94);
ctx.lineTo(120, 144);
ctx.strokeStyle = 'red';
ctx.stroke(); */

console.log(game.height);
console.log(game.width);

//====== EVENT LISTENER ======
window.addEventListener('DOMContentLoaded', function() {

    /* donkey = new Crawler(10,20,'grey', 20, 20); */
    player = new Crawler(20, 170, 'yellow', 20, 100);
    player.render();
    //run a game loop
    /* const runGame = this.setInterval(gameLoop, 60); */
});





//====== COORDINATE FUNCTION ***TESTING ONLY*** ======
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}

game.addEventListener('mousedown', function(e) {
    getCursorPosition(game, e);
});