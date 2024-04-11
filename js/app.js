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
const ctx = game.getContext('2d');

//====== CANVAS RENDERING SETUP ======
game.setAttribute('height', getComputedStyle(game)['height']);
game.setAttribute('width', getComputedStyle(game)['width']);

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
    
        this.render = function () {
          ctx.strokeStyle = this.color; // change the color of the context (ctx)
          ctx.strokeRect(this.x, this.y, this.width, this.height);
        };
    }
  }

let testCrawler = new Crawler(20, 170, 'blue', 20, 100);
testCrawler.render();

let testTurret1 = new Turret(100, 54, 'yellow', 40, 40);
testTurret1.render();

let testTurret2 = new Turret(100, 201, 'yellow', 40, 40);
testTurret2.render();

let testTurret3 = new Turret(100, 348, 'yellow', 40, 40);
testTurret3.render();

  console.log(game.height);

  //====== EVENT LISTENER ======
window.addEventListener('DOMContentLoaded', function() {
    /* donkey = new Crawler(10,20,'grey', 20, 20); */
    player = new Crawler(20, 170, 'yellow', 20, 100);
    //run a game loop
    /* const runGame = this.setInterval(gameLoop, 60); */
});

//====== COORDINATE FUNCTION ======
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}

canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(game, e);
});