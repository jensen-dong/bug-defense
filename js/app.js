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
    a: {
        down: false
    },
    d: {
        down: false
    }
}
let prevKey;
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
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        /* this.headHeight = {
          x: this.position.x + this.width / 2,
          y: this.position.y + 20
        } */

        this.attackPosition = {
            position: this.position,
            width: 100,
            height: 50,
        }
        this.color = 'orange';
        this.isPlayer = true;
        this.attacking;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        //attack position
        if (this.isPlayer) {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.attackPosition.position.x,
                this.attackPosition.position.y,
                this.attackPosition.width,
                this.attackPosition.height
            )
        }


    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= game.height) {
            this.velocity.y = 0;
        }
    }

    attack() {
        this.attacking = true;
        setTimeout(() => {
            this.attacking = false
        }, 100)
    }
}



/* class Fireball {
    constructor(position){
        this.position = position;
        this.width = 20;
        this.height = 5;
        this.speed = 10
      }
      render() {
        ctx.fillStyle = 'orange';
        ctx.fillRect(
            this.position.x + this.speed, 
            this.position.y, 
            this.width,
            this.height,
        )
      }
    
} */

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
        x: 500,
        y: 300
    },
    velocity: {
        x: 0,
        y: 0
    },
});




//====== create animation function ======


function animate() {
    window.requestAnimationFrame(animate);
    ctx.drawImage(bgi, 0, 0);
    //console.log('move');
    player.update();
    bug.update();

    player.velocity.y = 0;
    player.velocity.x = 0;
    bug.isPlayer = false;
    //bug.velocity.x = -1;
    //movement
    if (input.w.down && prevKey === 'w') {
        player.velocity.y = -3;
    } else if (input.s.down && prevKey === 's') {
        player.velocity.y = 3;
    } else if (input.a.down && prevKey === 'a') {
        player.velocity.x = -3;
    } else if (input.d.down && prevKey === 'd') {
        player.velocity.x = 3;
    }

    //hit detection
    if (player.attackPosition.position.x + player.attackPosition.width >= bug.position.x 
        && player.attackPosition.position.x <= bug.position.x + bug.width
        && player.attackPosition.position.y + player.attackPosition.height >= bug.position.y
        && player.attackPosition.position.y <= bug.position.y + bug.height
        && player.attacking
        ) {
        console.log('hit');
    }
}


animate();

//====== EVENT LISTENER ======

window.addEventListener('keydown', (event) => {
    console.log(event.key);
    switch (event.key) {
        case 'w':
            input.w.down = true;
            prevKey = 'w';
            break;
        case 's':
            input.s.down = true;
            prevKey = 's';
            break;
        case 'a':
            input.a.down = true;
            prevKey = 'a';
            break;
        case 'd':
            input.d.down = true;
            prevKey = 'd';
            break;
        case ' ':
            player.attack();
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
        case 'a':
            input.a.down = false;
            break;
        case 'd':
            input.d.down = false;
            break;
    }
});


console.log(game.height);
console.log(game.width);




//====== COORDINATE FUNCTION ***TESTING ONLY*** ======
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}

game.addEventListener('mousedown', function (e) {
    getCursorPosition(game, e);
});