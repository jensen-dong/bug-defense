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
        //scale variable to suit different resource sizing
        this.scale = scale;
        //set maximum frame to correctly loop animations
        this.maxFrame = maxFrame;
        //check for current frame position
        this.currentFrame = 0;
        //check for how many frame has elapsed
        this.elapsedFrame = 0;
        //set animation loop speed
        this.holdFrame = 5;
        //offset to account for transparent padding in resource imgs
        this.offset = offset;

        this.color = 'red';
        this.attacking;
        
    }

    draw() {
        /* if (!this.image.complete || this.image.naturalWidth === 0) {
            console.log("Image not loaded");
            return; 
        } */
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

    //function to slow down animation and check for targetted fps
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
        this.isInFront;
        
        //prep for switch case function, assign attribute to sprites
        for (const sprite in this.sprites) {
          sprites[sprite].image = new Image();
          sprites[sprite].image.src = sprites[sprite].imgSrc;
        }
      }

    update() {
        this.draw();
        this.frameCheck();

        //hitbox logic
        this.attackPosition.position.x = this.position.x + this.attackPosition.offset.x;
        this.attackPosition.position.y = this.position.y + this.attackPosition.offset.y;
        
        //velocity logic
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= game.height) {
            this.velocity.y = 0;
        }
    }

    //attack method for attack input
    attack() {
        this.attacking = true;
        this.switchState('attack');
        setTimeout(() => {
            this.attacking = false
        }, 100)
    }

    //push back method for player collision detection
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

    //switch state function to switch to different animation set
    switchState(sprite) {
        if (this.image === this.sprites.attack.image && this.currentFrame < this.sprites.attack.maxFrame -1) {
            return;
        };
        if (this.image === this.sprites.takeHit.image && this.currentFrame < this.sprites.takeHit.maxFrame - 1) {
            return;
        };
        switch (sprite) {
            case 'idle' :
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.maxFrame = this.sprites.idle.maxFrame;
                    this.frameCurrent = 0;
                }
                break;
            case 'run' :
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.maxFrame = this.sprites.run.maxFrame;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack' :
                if(this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.maxFrame = this.sprites.attack.maxFrame;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit' :
                if(this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.maxFrame = this.sprites.takeHit.maxFrame;
                    this.frameCurrent = 0;
                }
                break;
        }
    }
}

class Bug extends Sprite {
    constructor({
        position,
        velocity,
        color = 'green',
        imgSrc,
        scale = 1,
        maxFrame = 1,
        offset = { x: 0, y: 0 },
    }) {
        super({
            position,
            imgSrc,
            scale,
            maxFrame,
            offset
        });
        this.velocity = velocity;
        this.color = color;
        this.width = 50;
        this.height = 50;
        this.hp = 3;
        this.currentFrame = 0;
        this.elapsedFrame = 0;
        this.holdFrame = 5;
    }

    update() {
        this.draw();
        this.frameCheck();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    };
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
        x: 0,
        y: 0
    },

    imgSrc: './resources/player/idle.png',
    maxFrame: 8,
    scale: 2.5, 
    offset: {
        x: 215, 
        y: 167
    },
    sprites: {
        idle: {
            imgSrc: './resources/player/idle.png',
            maxFrame: 8,
        },
        run: {
            imgSrc: './resources/player/Run.png',
            maxFrame: 8,
        },
        attack: {
            imgSrc: './resources/player/Attack1.png',
            maxFrame: 6,
        },
        takeHit: {
            imgSrc: './resources/player/Take Hit - white silhouette.png',
            maxFrame: 4,
        }
    }, 
    attackPosition: {
        offset: {
            x: 100,
            y: 0
        },
        width: 160, 
        height: 100
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

    //set bug spawn limit
    if (now - lastBugSpawn > 2000 && bugCount < 15) {
        bugArr.push(new Bug({
            position: {
                x: 1280,
                y: randomIndex(bugSpawnY)
            },
            velocity: {
                x: -1,
                y: 0
            },
            offset: {
                x: 10,
                y: 10
            },
            imgSrc: './resources/bug/Walk.png',
            maxFrame: 4,
            scale: 2,
             
        }))
        lastBugSpawn = now;
        bugCount++;
    }

    bugArr.forEach(bug => {
        bug.update();
    });
    /* if (now > startBugUpdates) {
        bugArr.forEach(bug => {
            bug.update();
        });
    } */

    player.velocity.y = 0;
    player.velocity.x = 0;
    //movement
    //default animation
    player.switchState('idle');
    if (input.w.down && prevKey === 'w') {
        player.velocity.y = -3;
        player.switchState('run');
    } else if (input.s.down && prevKey === 's') {
        player.velocity.y = 3;
        player.switchState('run');
    } else if (input.a.down && prevKey === 'a') {
        player.velocity.x = -3;
        player.switchState('run');
    } else if (input.d.down && prevKey === 'd') {
        player.velocity.x = 3;
        player.switchState('run');
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
            //console.log('player hit', bugArr.indexOf(bug));
            bug.hp -= 1;
            //console.log('bug number', bugArr.indexOf(bug), ' health:', bug.hp);
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
                //console.log(bugArr.indexOf(bug), 'bug hit');
                player.switchState('takeHit');
                player.hp -= 1;
                health--;
                document.getElementById('health').innerHTML = health;
                //console.log('player health:', player.hp);
                lastHitTakenTime = now;
            }
        }
        //bug reaching end of screen
        if (bug.position.x === 0) {
            player.hp -= 1;
            health--;
            document.getElementById('health').innerHTML = health;
            bugArr.splice(bugArr.indexOf(bug), 1);
        }
    })

    //console.log(player.hp);

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
    //console.log(event.key);
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


//console.log(game.height);
//console.log(game.width);


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