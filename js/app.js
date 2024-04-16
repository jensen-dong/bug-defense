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
let bugHit = true;
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

        this.color = 'red';
        this.attacking;
        this.isInFront;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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

class Player extends Sprite {
    constructor(options) {
        super(options);
        this.attackPosition = {
            position: this.position,
            width: 150,
            height: 50,
        }
        this.attacking;
        this.isInFront;
        this.hp = 10;
    }

    draw() {
        super.draw();
        
        //attack position
        if (this.attacking) {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.attackPosition.position.x,
                this.attackPosition.position.y,
                this.attackPosition.width,
                this.attackPosition.height
            )
        }
    }
    attack() {
        this.attacking = true;
        setTimeout(() => {
            this.attacking = false
        }, 100)
    }

    pushBack() {
        if (this.isInFront) {
            setTimeout(() => {
                this.velocity.x = -10
            }, 50)
        } else if (!this.isInFront) {
            setTimeout(() => {
                this.velocity.x = 10
            }, 50)
        }
    }
}

class Bug extends Sprite {
    constructor(options) {
        super(options);
        this.color = 'green';
        this.height = 50;
        this.hp = 3;
    }
}


const player = new Player({
    position: {
        x: 40,
        y: 300
    },
    velocity: {
        x: 0,
        y: 10
    }
});



/* const bug = new Bug({
    position: {
        x: 800,
        y: 300
    },
    velocity: {
        x: 0,
        y: 0
    },
}); */


//====== enemy spawn ======

const bugSpawnY = [275, 325, 375, 425, 475, 525];
const bugArr = [];
for (i = 0; i < 10; i++) {
    
}

//====== create animation function ======
let lastBugSpawn = Date.now();
let bugCount = 0;

function animate() {
    window.requestAnimationFrame(animate);
    ctx.drawImage(bgi, 0, 0);
    //console.log('move');

    let now = Date.now();
    player.update();
    //bug.update();
    if (now - lastBugSpawn > 2000 && bugCount < 10) {
        bugArr.push(new Bug({
            position: {
                x: 1280,
                y: randomIndex(bugSpawnY)
            },
            velocity: {
                x: -.5,
                y: 0
            }
        }))
        lastBugSpawn = now;
        bugCount++;
    }

    bugArr.forEach(bug => {
        bug.update();
    })

    player.velocity.y = 0;
    player.velocity.x = 0;
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
    bugArr.forEach(bug => {
        if (player.attackPosition.position.x + player.attackPosition.width >= bug.position.x 
            && player.attackPosition.position.x <= bug.position.x + bug.width
            && player.attackPosition.position.y + player.attackPosition.height >= bug.position.y
            && player.attackPosition.position.y <= bug.position.y + bug.height
            && player.attacking
            ) {
                player.attacking = false;
                console.log('player hit', bugArr.indexOf(bug));
                bug.hp -= 1;
                console.log('bug number', bugArr.indexOf(bug), ' health:', bug.hp);
                //despawn bug
                if (bug.hp === 0) {
                    bugArr.splice(bugArr.indexOf(bug), 1);
                }
        }

        //push back detection
        if (bug.position.x <= player.position.x + player.width
            && bug.position.x + bug.width >= player.position.x
            && bug.position.y + bug.height >= player.position.y
            && bug.position.y <= player.position.y + player.height) {
                if(player.position.x <= bug.position.x + bug.width / 2) {
                    player.isInFront = true;
                    player.pushBack();
                } else if (player.position.x > bug.position.x + bug.width / 2) {
                    player.isInFront = false;
                    player.pushBack();
                }
            if (bugHit) {
                console.log(bugArr.indexOf(bug), 'bug hit');
                bugHit = false;
                player.hp -= 1;
                console.log('player health:', player.hp)
            }
        } else {
            bugHit = true;
        }
    })

    
    
    
    
}


animate();

//====== Helper functions ======
function randomIndex(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

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