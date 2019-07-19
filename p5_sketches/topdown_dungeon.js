var player;
var moveAngle = 0; //default to right

var wallGroup;
var collectibles;
var bulletGroup;
var enemyGroup;
var level;
var enemyAnimation;
var explosionAnimation;
var attackFlareAnim;
var bulletAnim;

var wall1;
function preload()
{
  level = new TiledLevel('topdown_dungeon_level.txt');
  enemyAnimation = loadAnimation("imgs/enemy1/1.png","imgs/enemy1/2.png","imgs/enemy1/3.png","imgs/enemy1/2.png");

  explosionAnimation = loadAnimFromFolder("imgs/explosion", 5);
  explosionAnimation.looping = false;

  attackFlareAnim = loadAnimFromFolder("imgs/attackFlare", 3);
    attackFlareAnim.looping = false;
    attackFlareAnim.frameDelay = 3;

  wall1 = loadImage("imgs/walls/1.png");
  enemyAnimation.frameDelay = 12;
}


function setup() {

//----------------
var idleAnim = loadAnimFromFolder("imgs/idle", 3);

idleAnim.frameDelay = 16;
  var walkAnim = loadAnimFromFolder("imgs/moving", 3);
  walkAnim.frameDelay = 4;

  var attackAnim =loadAnimation("imgs/attack/1.png","imgs/attack/2.png","imgs/attack/3.png","imgs/attack/3.png","imgs/attack/3.png");
  attackAnim.looping = false;
  attackAnim.frameDelay = 3;

  bulletAnim = loadAnimFromFolder("imgs/bullet", 3);
  bulletAnim.frameDelay = 12;


//var collectibleAnim = loadAnimFromFolder("imgs/collectible", 3);
//--------------------


  bulletGroup = new Group();
  enemyGroup = new Group();



  useQuadTree(false);
  collectibles = new Group();


  //collectibles.add(createSprite(50,350, 16,16));
  //create 3 enemies
  createEnemy(200, 200);
  createEnemy(250, 200);
  createEnemy(300, 200);


  player = createSprite(50,75, 32,32);
  player.addAnimation("moving", walkAnim);
  player.addAnimation("idle", idleAnim);
    player.addAnimation("attack", attackAnim);

level.TILE_SZ = 80;
  wallGroup = level.getWallGroup();
  wallGroup.forEach(
    function(wall) {
      wall.addImage(wall1);
    }
  );

  createCanvas(16 * 90, 9 * 90);

}

function createEnemy(xPos, yPos)
{
   var enemy = createSprite(xPos, yPos, 64,64);
  enemy.addAnimation("moving", enemyAnimation);
  enemy.animation.changeFrame(round(random(0, 3)));
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
var wallCollisionsOn = true;
function draw() {
  background(255);
      camera.position.x = player.position.x;
  camera.position.y = player.position.y;


  //playerDraw();
 playerMovement();
  if(wallCollisionsOn)
  {
  player.collide(wallGroup);
  }
  if (keyWentDown('c'))
  {
    wallCollisionsOn = !wallCollisionsOn;
  }
  enemyGroup.collide(enemyGroup);
  enemyGroup.collide(wallGroup);



  blendMode(MULTIPLY);
  //bulletGroup.bounce(wallGroup);//, function(b, w){b.remove();});



  updateEnemies();
  drawSprites();

  fill(color("white"));
  //text("enemy1 hp: " + enemy1.hp, 10,30);


}
function onBulletHitWall(bullet, wall)
{
    createExplosion(bullet.position.x, bullet.position.y, .75);
    bullet.remove();
}

function updateEnemies()
{
  for (var i = 0; i < enemyGroup.length; i++)
  {

    var enemy = enemyGroup[i];


    enemy.timer--;
    if (enemy.timer <= 0)
    {
      //enemy.timer = random(20, 80);
      enemy.moving = !enemy.moving;
      if (enemy.moving && enemy.onScreen)
      {
        //towards player =
        var angleTowardsPlayer = angleTowards(enemy.position,  player.position);
        enemy.setSpeed(8, angleTowardsPlayer);//random(0,360));


        enemy.timer = 15;
      }
      else
      {
        enemy.setSpeed(0);
        enemy.timer = random(60, 180);
      }
    }
  }
}

function bulletOverlapsEnemy(bullet, hitEnemy)
{
  createExplosion(bullet.position.x, bullet.position.y,.5);
  bullet.remove();

  //subtract 1 hp from enemy each time they are hit by a bullet
  hitEnemy.hp--;

  //if the enemy's hp is 0, remove it
  if (hitEnemy.hp <= 0)
  {
createExplosion(hitEnemy.position.x, hitEnemy.position.y,2);
    hitEnemy.remove();
  }
}
function createExplosion(x,y, scale = 1)
{
  var explosion = createSprite(x, y);
  explosion.addAnimation("xx", explosionAnimation);
  explosion.life = 15;
  explosion.depth = -9000;
  explosion.scale = scale;
}


function playerMovement()
{

//camera.off();
//text( (player.getAnimationLabel() === "attack") + " - " + (player.animation.playing), 50,50);
//text("!" + attackAnimIsPlaying, 50,50);
//camera.on();
  if ( keyWentDown('h')) {
    print("!!");
    player.changeAnimation("attack");
    player.animation.rewind();
    player.animation.play();
    this.setTimeout(function(){

      var freshBullet = createSprite(player.position.x, player.position.y, 8, 8);
      freshBullet.setSpeed(8,moveAngle);
      freshBullet.scale =.5;
      bulletGroup.add(freshBullet);
      freshBullet.life = 120;
      freshBullet.addAnimation("main", bulletAnim);
    },150);
  }
  bulletGroup.overlap(enemyGroup, bulletOverlapsEnemy);
  bulletGroup.overlap(wallGroup, onBulletHitWall);
var attackAnimIsPlaying = player.getAnimationLabel() === "attack" && player.animation.playing;


  let moving = false;
  var speed = 3;



  if (keyDown('d')) {
    player.position.x = player.position.x + speed;
    moveAngle = 0;
    moving = true;
  }

  if (keyDown('a')) {
    player.position.x = player.position.x - speed;
    moveAngle = 180;
      moving = true;
  }

  if (keyDown('w')) {
    player.position.y = player.position.y - speed;
    moveAngle = 270;
    if (keyDown('a')) {
      moveAngle -= 45;
    }
    else if (keyDown('d')) {
      moveAngle += 45;
    }
      moving = true;
  } else if (keyDown('s')) {
    player.position.y = player.position.y + speed;
      moveAngle = 90;
      if (keyDown('a')) {
        moveAngle += 45;
      }
      else if (keyDown('d')) {
        moveAngle -= 45;
      }

        moving = true;
  }

  if (!attackAnimIsPlaying)// || !player.animation.playing)//attackingCtr <= 0)
  {
	  if (moving)
    {
      player.changeAnimation("moving");
    }
    else
    {
      player.changeAnimation("idle");
    }
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
}






/*
//Fancy shot bullet with perpendicular to player component
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
    newBullet.addAnimation("main", bulletAnim);

    bulletGroup.add(newBullet);
    }
}
//*/
