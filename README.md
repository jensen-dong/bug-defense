# Bug Defense Samurai

This is a 2D sidescroll horde mode game. 
You are a samurai that appears in a medieval world that is infested with scorpions. 

The only thing that appeared alongside you is your battle tested sword, which only needs `3` hits to kill a scorpions. 

Scorpion poison is lethal, but you have 9 antivenom at your disposal, thanks to the villagers you are protecting, which means you can only take `10` hits before you are down! 

If one scorpion get past you, you will have to lose 1 antivenom to give them to the villagers. 

Your goal is to kill 10 scorpions as possible before they get past you, or your health runs out!

`A` `W` `S` `D` to move, `SPACE` to attack. 

# How to play

1. Click [repo](https://github.com/jensen-dong/bug-defense) to open game source page
2. `fork` and `clone`
3. run `index.html` in your local browser

# Game design process

The original idea for this game was going to be a tower defense game, where the player will be shooting projectiles at waves of enemies. 
However, in the midst of shopping for resources, I found a very cool looking samurai resource package, ended up switch the game idea to a melee based horde mode game. 

The game used primarily JavaScript for game logic, resource fetching, and determine win/loss states. HTML is used for general structure of the webpage, and CSS is used for general Canvas and UI layouts. 

The game design started with simple rectangles using `fillRect()` to draw out shapes of player, hitbox, and enemies. 
After creating rough shapes and size for sprites(elements in game), I moved on to adding animation to them using `requestAnimationFrame()`, which updates the browser 1 frame every set interval. 
While I was in the state with rectangle sprites, I wrote out logics for hit detection, collision, and pushbacks. 
Logics will be applied in similar manner when switching from rectangles to actual game resources. 
Once game logic was roughly done, it was time to introduce sprite animation and .png resources. 
Animation is purely done in JS without the help of any framework. 
It is achieved by using .png files that contains all frames of the animation, then crop and display one part(frame) of the image once every interval. 
Depending on which animation the player is currently in, I used a set of switch cases to change the image source `imgSrc` to the correct png file based on which state character is in. 

Win/loss states are based on HTML `<div>`s and set the correct div to flex display, and use `cancelAnimationFrame()` to stop the game. 

# Known Issues and finetuning TODOs

1. Attack animation sometimes will not display fully when spamming attack.
2. Game end state happens as soon as end condition is achieved. 
3. No hit animation for enemies yet. (When implementing switch case to enemy, image would not load before `draw()`, which resulted in sprites not spawning)
4. TODO implement waves.

# Credits

[bug_sprite_craftpix](https://craftpix.net/freebies/free-desert-enemy-sprite-sheets-pixel-art/)

[samurai_sprite_LuizMelo](https://luizmelo.itch.io/martial-hero)

[background_craftpix](https://craftpix.net/freebies/free-rpg-battleground-asset-pack/)