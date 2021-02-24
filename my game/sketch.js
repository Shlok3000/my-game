var ground;
var knight, princess, enimies, dagger;
var knightimage, knightimageattack, princessimage;
var ground, backgroundImage;
var invisibleGround;
var stoneimage;
var treeimage;
var obstacle, obstaclegroup, enemygroup, daggerGroup;
var vampireimage, ghostimage, daggerimage;
var score = 0;
var kills = 0;
var gameState = "play"
var gameOver, gameOverimage;
var restart, restartimage;
var jumpSound,dieSound,checkPointSound;

function preload() {
    knightimage = loadImage("Shlok_s Sprites/Knight.png");
    backgroundImage = loadImage("Shlok_s Sprites/Background.png");
    princessimage = loadImage("Shlok_s Sprites/Princess.png");
    knightimageattack = loadImage("Shlok_s Sprites/Knightattack.png");
    stoneimage = loadImage("Shlok_s Sprites/rock.png");
    treeimage = loadImage("Shlok_s Sprites/tree.png");
    vampireimage = loadImage("Shlok_s Sprites/Vampire.png");
    ghostimage = loadImage("Shlok_s Sprites/Ghost1-1.png");
    daggerimage = loadImage("Shlok_s Sprites/Dagger-1.png");
    gameOverimage = loadImage("Shlok_s Sprites/gameOver.png");
    restartimage = loadImage("Shlok_s Sprites/restart.png");
    jumpSound = loadSound("jump.mp3")
    dieSound = loadSound("die.mp3")
    checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
    createCanvas(1200, 800);
    ground = createSprite(600, 100, 1200, 20);
    ground.addImage("ground", backgroundImage);
    ground.x = ground.width / 2;
    ground.velocityX = -(4 + 3*score/100);
    ground.scale = 5.5;

    knight = createSprite(610, 600, 100, 100);
    knight.addImage(knightimage);

    princess = createSprite(550, 700, 100, 100);
    princess.addImage(princessimage);
    princess.scale = 1.5;

    restart = createSprite(600,500,50,50);
    restart.addImage(restartimage);

    gameOver = createSprite(600,600,50,50);
    gameOver.addImage(gameOverimage);

    obstaclegroup = new Group();
    enemygroup = new Group();
    daggerGroup = new Group();

    invisibleGround = createSprite(600,750,1200,30);
    invisibleGround.visible = false;
}

function draw() {
    background(0);

    princess.y = knight.y;
   
    if(gameState ==="play"){
        ground.velocityX = -(4 + 3*score/100);
        gameOver.visible = false;
        restart.visible = false;
    if (ground.x < 0) {
        ground.x = 600;
    }

    if(keyDown("space") && knight.y >= 650){
        knight.velocityY = -15;
        jumpSound.play();
    }

    if(keyDown("k")){
        knight.addImage(knightimageattack);
        createDagger();
    }

    if(score>0 && score%100 === 0){
        checkPointSound.play() 
     }

    if(keyWentUp("k")){
        knight.addImage(knightimage);
    }

    knight.velocityY = knight.velocityY + 0.7


    if(daggerGroup.isTouching(enemygroup)){
        enemygroup.destroyEach();
        kills += 1;
    }

    if(enemygroup.isTouching(princess) || obstaclegroup.isTouching(princess)) {
        gameState = "end";
        dieSound.play();
    }

    spawnObstacles();
    spawnenimies();
    score = score + Math.round(getFrameRate()/60);
    }
    knight.collide(invisibleGround);
    drawSprites();
    if(gameState === "end"){
        restart.visible = true;
        gameOver.visible = true;
        
        ground.velocityX = 0;
        knight.velocityX = 0;
        obstaclegroup.setVelocityEach(0);
        enemygroup.setVelocityEach(0);

        obstaclegroup.setLifetimeEach(-1);
        enemygroup.setLifetimeEach(-1);

        obstaclegroup.destroyEach();
        enemygroup.destroyEach();

        if(mousePressedOver(restart)){
            reset();
        }
    }
    
    
    textSize(20);
    fill("red");
    text("Score: "+ score,400,50);
    
    text("Monster kills: " + kills,700,50);
}

function spawnObstacles(){
    if(frameCount % 100 === 0){
        obstacle = createSprite(1200, 700, 50, 50);
        obstacle.debug = true;
        obstacle.setCollider("rectangle", 0, 0,200,200);
        var rand = Math.round(random(1,2));
        obstacle.velocityX = -(6 + 3*score/100);
        obstacle.scale = 0.3;
        obstacle.lifetime = 120;

        if(rand === 1){
            obstacle.addImage(stoneimage);
        }
        if(rand === 2){
            obstacle.addImage(treeimage);
        }
        obstaclegroup.add(obstacle);
    }
   
}

function spawnenimies(){
    if(frameCount % 150 === 0){
        enimies = createSprite(1500, 675, 50, 50);
        var rand = Math.round(random(1,2));
        enimies.debug = true;
        enimies.setCollider("rectangle",0,0,100,150);
        enimies.velocityX = -(4 + 2*kills/1);
        enimies.scale = 0.9;
        enimies.lifetime = 1200/7;

        if(rand === 1){
            enimies.addImage(vampireimage);
        }
        if(rand === 2){
            enimies.addImage(ghostimage);
        }
        enemygroup.add(enimies);
    }
}

function createDagger(){
    if(frameCount % 45 === 0){
    dagger = createSprite(knight.x, knight.y, 50, 10);
    dagger.addImage(daggerimage);
    dagger.lifetime = 120;
    dagger.velocityX = 6;
    daggerGroup.add(dagger);
    }
}

function reset(){
    gameState = "play"
    gameOver.visible = false;
    restart.visible = false;

    score = 0;
    kills = 0;
}