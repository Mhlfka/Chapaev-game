backgroundSound();
const SCREEN_WIDTH = 384;
const SCREEN_HEIGHT = 512;
const PIXEL_SIZE = 16;
const TOP_PADDING = PIXEL_SIZE*3;
const COLOR = 0X000000;
const BG_COLOR = 0X869174;
const pixiApp= new PIXI.Application({
    backgroundColor:BG_COLOR,
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT,
});

const scoreText = new PIXI.Text("Score: 0", new PIXI.TextStyle({fill: COLOR}));
const hero = drawPixel(SCREEN_WIDTH/2 - PIXEL_SIZE, SCREEN_HEIGHT - PIXEL_SIZE);


let bullets = [];
let enemies = [];
let delayCounter = 0;
let scoreCount = 0;
let enemySpeed = 0;

document.body.appendChild(pixiApp.view);
document.addEventListener("keydown", onKeyDown);
pixiApp.ticker.add(update, this);
pixiApp.stage.addChild(scoreText);

function onKeyDown(key) {
    switch(key.key){
        case "ArrowRight":{
            if(hero.x < SCREEN_WIDTH - PIXEL_SIZE){
                hero.x += PIXEL_SIZE; 
            }
            break;
        }
        case "ArrowLeft":{
            if(hero.x > 0){
                hero.x -= PIXEL_SIZE; 
            }
            break;
        }
        case " ":{
            let bullet = drawPixel(hero.x, hero.y);
            bullets.push(bullet);
            break;
        }
    }
}

function update() {
    if(isFail()){
        stopGame();
        return;
    }

   
   if(isEnemyCanMove()) {
    moveEnemies();
    addEnemyLine();
    }
    
    moveBullets();
    clear();
}

function stopGame() {
    document.removeEventListener("keydown", onKeyDown);
    pixiApp.ticker.remove(update, this);
    scoreText.text = "Score: " + scoreCount + " | GAME OVER"
}

function isEnemyCanMove() {
    delayCounter++;
    if(delayCounter < 100) {
        return false;
    }
    delayCounter = enemySpeed;
    return true;

}

function moveEnemies() {
    enemies.forEach(e => e.y += PIXEL_SIZE);
}

function addEnemyLine() {
    for(var i = 0; i < SCREEN_WIDTH/PIXEL_SIZE; i++){
        if(Math.random() <= 0.5) {
            let enemy = drawPixel(PIXEL_SIZE * i, TOP_PADDING);
            enemies.push(enemy);
        }
    }
}

function moveBullets() {
    bullets.forEach(b => {
        moveBullet(b);
        checkCollision(b);
    
    });
}
function moveBullet(bullet) {
    bullet.y -= PIXEL_SIZE;
    if(bullet.y < TOP_PADDING) {
        bullet.isDead = true;
    }
    
}

function checkCollision(bullet) {
    enemies.forEach(enemy => {
        if(enemy.x == bullet.x && enemy.y == bullet.y) {
            bullet.isDead =true;
            enemy.isDead = true;       
            scoreCount++;
            scoreText.text = "Score: " +scoreCount;  
            enemySpeed += 0.2;
        }
    })
}

function isFail() {
    return enemies.find(e => e.y == hero.y) !=undefined; 
}

function clear() {
    pixiApp.stage.children.filter(child => child.isDead).forEach(child => child.removeFromParent());
    bullets = bullets.filter(b => !b.isDead);
    enemies = enemies.filter(e => !e.isDead);
}

function drawPixel(x, y) {
    const view = new PIXI.Graphics();
    view.lineStyle(2,COLOR);
    view.beginFill(BG_COLOR);
    view.drawRect(0,0, PIXEL_SIZE,PIXEL_SIZE);
    view.beginFill(COLOR);
    view.drawRect(4,4, PIXEL_SIZE-8, PIXEL_SIZE-8);
    view.x = x;
    view.y = y;

    pixiApp.stage.addChild(view);
    return view;
}
function backgroundSound() {
    let back = new Audio("bg_sound.ogg")
    back.play()
}
