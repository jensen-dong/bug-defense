// GLOBAL VARIABLES
const game = document.getElementById('game');
let score = 0;
let health = 10;
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
const bgi = document.getElementById('backgroundImg');
const ctx = game.getContext('2d');

//====== CANVAS RENDERING SETUP ======
game.width = 1280;
game.height = 720;

ctx.drawImage(bgi, 0, 0);


//====== CLASSES ======
class Sprite {
    constructor({ position, velocity, imgSrc, scale = 1, maxFrame = 1, offset = {x: 0, y: 0} }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.maxFrame = maxFrame;
        this.currentFrame = 0;
        this.elapsedFrame = 0;
        this.holdFrame = 5;
        this.offset = offset;

        this.color = 'red';
        this.attacking;
        
    }

    draw() {
        /* ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); */
        ctx.drawImage(
            this.image, 
            (this.image.width / this.maxFrame) * this.currentFrame,
            0,
            this.image.width / this.maxFrame,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.maxFrame) * this.scale, 
            this.image.height * this.scale
        )
    }
    frameCheck() {
        this.elapsedFrame++;
        if (this.elapsedFrame % this.holdFrame === 0) {
            if (this.currentFrame < this.maxFrame - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }

    update() {
        this.draw();
        this.frameCheck();
        
        /* this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= game.height) {
            this.velocity.y = 0;
        } */
    }


}

class Player extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imgSrc,
        scale = 1,
        maxFrame = 1,
        offset = { x: 0, y: 0 },
        sprites, 
        attackPosition = { offset: {}, width: undefined, height: undefined }
      }) {
        super({
          position,
          imgSrc,
          scale,
          maxFrame,
          offset
        })
    
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackPosition = {
          position: {
            x: this.position.x,
            y: this.position.y
          },
          offset: attackPosition.offset,
          width: attackPosition.width,
          height: attackPosition.height
        };
        this.color = color;
        this.isAttacking;
        this.hp = 10;
        this.currentFrame = 0;
        this.elapsedFrame = 0;
        this.holdFrame = 10;
        this.sprites = sprites;
        this.dead = false;
        this.isInFront;
    
        for (const sprite in this.sprites) {
          sprites[sprite].image = new Image()
          sprites[sprite].image.src = sprites[sprite].imageSrc
        }
      }

    /* draw() {
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
    } */

    update() {
        this.draw();
        this.frameCheck();

        this.attackPosition.position.x = this.position.x + this.attackPosition.offset.x;
        this.attackPosition.position.y = this.position.y + this.attackPosition.offset.y;
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
        y: 0
    },
    offset :{
        x: -50,
        y: 0
    },

    imgSrc: './resources/player/idle.png',
    maxFrame: 4,
    scale: 2.5, 
    offset: {
        x: 215, 
        y: 167
    }
});

//====== enemy spawn ======

const bugSpawnY = [275, 325, 375, 425, 475, 525];
const bugArr = [];
for (i = 0; i < 10; i++) {

}

//====== create animation function ======
//setting up for throttling
let lastBugSpawn = Date.now();
let lastHitTakenTime = 0;
let bugCount = 0;
let bugKill = 0;

function animate() {
    const animation = requestAnimationFrame(animate);
    ctx.drawImage(bgi, 0, 0);
    //console.log('move');

    let now = Date.now();
    player.update();
    if (now - lastBugSpawn > 2000 && bugCount < 10) {
        bugArr.push(new Bug({
            position: {
                x: 1280,
                y: randomIndex(bugSpawnY)
            },
            velocity: {
                x: -1,
                y: 0
            },
            imgSrc: './resources/bug/Walk.png',
            maxFrame: 9
        }))
        lastBugSpawn = now;
        bugCount++;
    }

    bugArr.forEach(bug => {
        bug.update();
    })

    player.velocity.y = 0;
    player.velocity.x = 0;
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
                bugKill++;
                score++;
                document.getElementById('score').innerHTML = score;
            }
        }

        //push back detection
        if (bug.position.x <= player.position.x + player.width
            && bug.position.x + bug.width >= player.position.x
            && bug.position.y + bug.height >= player.position.y
            && bug.position.y <= player.position.y + player.height) {
            if (player.position.x <= bug.position.x + bug.width / 2) {
                player.isInFront = true;
                player.pushBack();
            } else if (player.position.x > bug.position.x + bug.width / 2) {
                player.isInFront = false;
                player.pushBack();
            }
            if (now - lastHitTakenTime > 200) {
                console.log(bugArr.indexOf(bug), 'bug hit');
                player.hp -= 1;
                health--;
                document.getElementById('health').innerHTML = health;
                console.log('player health:', player.hp);
                lastHitTakenTime = now;
            }
        }
    })

    console.log(player.hp);

    if (bugKill === 10) {
        cancelAnimationFrame(animation);
        document.getElementById('you-win').style.display = 'flex';
    } else if (player.hp === 0) {
        cancelAnimationFrame(animation);
        document.getElementById('game-over').style.display = 'flex';
    }
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