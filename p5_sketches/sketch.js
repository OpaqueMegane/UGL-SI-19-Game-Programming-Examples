var player;
var moveAngle = 0; //default to right

var wallGroup;
var collectibleGroup;
var bulletGroup;
var enemyGroup;
var curMap;

function preload()
{
  curMap = new TiledLevel('simple_level.txt');
}

function setup() {
  bulletGroup = new Group();
  enemyGroup = new Group();



  useQuadTree(false);
  collectibleGroup = curMap.getGroup("collectible");
  var collectibleAnim = loadAnimation("assets/item/1.png","assets/item/2.png");
collectibleGroup.forEach(function(c){
  var cc = collectibleAnim.clone();
  cc.frameDelay = floor(random(4,8));
  c.addAnimation("xxx", cc);
  c.scale = .5;
  //c.animation.setCycles(floor(random(0, 120))); ///hack to randomize animation
})



  player = createSprite(50,75, 32,32);
  player.scale = .5;
  var moveAnim = loadAnimation("assets/move/1.png","assets/move/2.png" ,"assets/move/3.png","assets/move/4.png","assets/move/5.png");
  moveAnim.frameDelay = 3;
var idleAnim = loadAnimation("assets/idle/1.png","assets/idle/2.png" ,"assets/idle/3.png");
idleAnim.frameDelay = 7;
player.addAnimation("idle", idleAnim);
player.addAnimation("move", moveAnim);

  wallGroup = curMap.getWallGroup();

  var brickWallImg = loadImage("assets/walls/brick.png");

  wallGroup.forEach(
    function(wall){
      wall.addImage(brickWallImg);
      wall.scale = .5;
    }
  );
/*
wall.scale = .5;
  wall.scale = .5;
    wall.immovable = true;
    */



  createCanvas(800, 800);

  //
}

function createEnemy(xPos, yPos)
{
   var enemy = createSprite(xPos, yPos, 16,64);
  enemyGroup.add(enemy);

  enemy.moving = false; //true if enemy moving, false if waiting
  enemy.timer = 0; //use to control how long to wait, how long to move
  enemy.hp = 5;
}

function playerTouchesCollectible(player, collectible)
{
  collectible.remove();
}

var movDir = {x: 0, y: -1};

var coolDown = 0;

function draw() {
  background(0);



  //playerDraw();
 playerMovement();
  player.collide(wallGroup);


  if (keyWentDown('h')) {
    var freshBullet = createSprite(player.position.x, player.position.y, 8, 8);
    freshBullet.setSpeed(5,moveAngle);
    bulletGroup.add(freshBullet);
  }
  bulletGroup.overlap(enemyGroup, bulletOverlapsEnemy);
  player.overlap(collectibleGroup, playerTouchesCollectible);

  //bulletGroup.bounce(walls);//, function(b, w){b.remove();});



  updateEnemies();
  drawSprites();

  fill(color("white"));
  //text("enemy1 hp: " + enemy1.hp, 10,30);

    camera.position.x = player.position.x;
  camera.position.y = player.position.y;
}

function updateEnemies()
{
  for (var i = 0; i < enemyGroup.length; i++)
  {
    var enemy = enemyGroup[i];
    enemy.timer--;
    if (enemy.timer <= 0)
    {
      enemy.timer = random(20, 80);
      enemy.moving = !enemy.moving;
      if (enemy.moving)
      {
        enemy.setSpeed(1, 90 * random(0,360));
      }
      else
      {
        enemy.setSpeed(0);
      }
    }
  }
}

function bulletOverlapsEnemy(bullet, hitEnemy)
{
  bullet.remove();

  //subtract 1 hp from enemy each time they are hit by a bullet
  hitEnemy.hp--;

  //if the enemy's hp is 0, remove it
  if (hitEnemy.hp <= 0)
  {
    hitEnemy.remove();
  }
}

function shootBullet()
{
      coolDown = 5;
      moveDirPerp = {x:-movDir.y, y:movDir.x};

    for (var i = 0; i < 1; i++)
    {

      let newBullet = createSprite(player.position.x, player.position.y - 10,8,8);
          newBullet.position.x = player.position.x + movDir.x * 32;
    newBullet.position.y = player.position.y +  movDir.y * 32;
    newBullet.velocity.x = movDir.x * 20 + moveDirPerp.x * random(-1,1);
    newBullet.velocity.y = movDir.y * 20+ moveDirPerp.y * random(-1,1);
    newBullet.life = 10;

    bulletGroup.add(newBullet);
    }
}

function playerMovement()
{
  var speed = 3;
  var moving = false;
  if (keyDown('d')) {
    player.position.x = player.position.x + speed;
    moveAngle = 0;
    moving = true;
    player.mirrorX(1);
  }

  if (keyDown('a')) {
    player.position.x = player.position.x - speed;
    moveAngle = 180;
    moving = true;
    player.mirrorX(-1);
  }

  if (keyDown('w')) {
    player.position.y = player.position.y - speed;
    moveAngle = 270;
    moving = true;
  }

    if (keyDown('s')) {
    player.position.y = player.position.y + speed;
      moveAngle = 90;
      moving = true;
  }

  if (moving)
  {
    player.changeAnimation("move");
  }
  else {
    player.changeAnimation("idle");
  }
}

function playerDraw()
{

  var isMoving = false;
  if (keyDown('w'))
  {
    isMoving = true;
    player.position.y = player.position.y - 3;
    //player.position.y += 2*sin(millis()/20);
    movDir.x = 0;
    movDir.y = -1;
  }

  if (keyDown('s'))
  {
    isMoving = true;
    player.position.y = player.position.y + 3;
     //player.position.y += 2*sin(millis()/20);
    movDir.x = 0;
    movDir.y = 1;
  }

  if (keyDown('a'))
  {
    isMoving = true;
    player.position.x = player.position.x - 3;
    //player.position.y += 2*sin(millis()/20);
        movDir.x = -1;
    movDir.y = 0;
  }

  if (keyDown('d'))
  {
    isMoving = true;
    player.position.x = player.position.x + 3;
    //player.position.y += 2*sin(millis()/20);
            movDir.x = 1;
    movDir.y = 0;
  }

  if (!isMoving)
  {
    //player.position.y += .5*sin(millis()/200);
  }
}
