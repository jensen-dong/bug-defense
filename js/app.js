// GLOBAL VARIABLES
const game = document.getElementById('game');
const score = document.getElementById('score');
const cash = document.getElementById('cash');
const input = {
    w: {
        down: false
    },
    s: {
        down: false
    },
}
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
class Sprite {
    constructor({position, velocity}) {
      this.position = position;
      this.velocity = velocity;
      this.height = 150;
      this.attackPosition = {
        position: this.position,
        width: 100,
        height: 50,
      }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 50, this.height);

        ctx.fillRect(this.attackPosition.x, this.attackPosition.y)
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= game.height) {
            this.velocity.y = 0;
        }
    }
}

const player = new Sprite({
    position: {
    x: 40,
    y: 300
    },
    velocity: {
        x: 0,
        y: 10
    }
});



const bug = new Sprite({
    position: {
    x: 1000,
    y: 300
    },
    velocity: {
        x: 0,
        y: 0
    }
});


//====== create animation function ======


function animate() {
    window.requestAnimationFrame(animate);
    ctx.drawImage(bgi, 0, 0);
    //console.log('move');
    player.update();
    bug.update();

    player.velocity.y = 0;

    if (input.w.down) {
        player.velocity.y = -3;
    } else if (input.s.down) {
        player.velocity.y = 3;
    }
}

animate();

//====== EVENT LISTENER ======
window.addEventListener('DOMContentLoaded', function() {

    /* donkey = new Crawler(10,20,'grey', 20, 20); */
    //run a game loop
    /* const runGame = this.setInterval(gameLoop, 60); */
});

window.addEventListener('keydown', (event) => {
    console.log(event.key);
    switch (event.key) {
        case 'w':
            input.w.down = true;
            break;
        case 's':
            input.s.down = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            input.w.down = false;
            break;
        case 's':
            input.s.down = false;
            break;
    }
});

/* class Turret {
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
} */

/* class Sprite {
    constructor(position, image, width, height) {
        this.position = position;
        this.image = image;
        this.height = height;
        this.width = width;
        this.alive = true;

        this.render = function() {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
} */

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