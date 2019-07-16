var player;

var wallGroup;
var shipImg, explosion1;
var explosionSprite;
var explosionSound, shootSound;
var bulletGroup;
var loopyBulletGroup;

var levelMap;

var alive = true;

var enemyGroup;

  var baseSpeed = 2;

function currentWeapon(){
  return peaShooter;
}

var peaShooter = [];

var currentWeaponIdx = 0;
var moveAngle = 270;
var score = 0;
var hp = 5;
var invincibleCounter = 0;
var alive = true;

function preload()
{



  explosionSound = loadSound("explosioin.wav");
    shootSound = loadSound("col_flop.wav");
frameRate(60);
 explosion1 = loadAnimation("explosion/1.png","explosion/2.png","explosion/3.png","explosion/4.png");
 explosion1.frameDelay  = 2;
  bulletGroup = new Group();

  loopyBulletGroup = new Group();
  player = createSprite(150,50, 32,32);
  player.maxSpeed = 2;




peaShooter.name = "Peashooter";
peaShooter.triggerWentDown = function(){
  shootSound.play();
  var bullet = createSprite(player.position.x,player.position.y, 8,8);
  bullet.setSpeed(16, moveAngle);
  bullet.life = 64;
  bulletGroup.add(bullet);
};
peaShooter.triggerHeld = function(){};

let mapUrl = 'topdown_level.txt';

let url ='topdown_level.txt';
levelMap = new TiledLevel('vertical_shooter_level.txt');

}

function setup()
{
  createCanvas(1200,600);

levelMap.TILE_SZ = 50;
wallGroup = levelMap.getWallGroup();
levelMap.addSideWalls(wallGroup);
enemyGroup = levelMap.getGroup();


  wallGroup.forEach(function(wall)
  {
    wall.immovable= true;
    wall.shapeColor = color(128)
  });

  enemyGroup.forEach(function(enemy)
  {
    enemy.shapeColor = color("magenta")
  });

  player.position = levelMap.gridToPixelPosition(levelMap.w/2, levelMap.h);

  camera.position.x = 500;//player.position.x;
  camera.position.y = player.position.y - .9 *.5 * height;;
}


function draw()
{

  if (!alive)
  {
    background(0);
    camera.off();
    textAlign(CENTER, CENTER);
    textSize(48);
    text("GAME\nOVER", width/2, height/2);
    return;
  }

  background(0);


  //player.velocity.y += .2;

  player.overlap(wallGroup, onPlayerHitWall);
  player.overlap(enemyGroup, onPlayerHitWall);
  playerMovement();

bulletGroup.overlap(wallGroup, function(bullet, wall){
  bullet.remove();
});

bulletGroup.overlap(enemyGroup, function(bullet, enemy){
createExplosion(bullet.position.x, bullet.position.y,4);
  bullet.remove();
  enemy.remove();
  score += 100;
});


camera.position.y -= baseSpeed;


camera.on();
  drawSprites();



////
camera.off();
fill(255);
noStroke();
textAlign(LEFT, TOP)
//textIgnoreCamera("current weapon:\n"+currentWeapon().name, 10, 10);

text("SCORE: "+ score + "\nLIFE: " + hp, 10, 10);

player.visible = true;
if (invincibleCounter > 0)
{
  invincibleCounter--;
  player.visible = floor(invincibleCounter/5) % 2 == 0;
}
}

function onPlayerHitWall(player, wall)
{
  playerTakeDamage();
}

function playerTakeDamage()
{
  if (invincibleCounter <= 0)
  {
    invincibleCounter = 75;
    hp --;
    createExplosion(player.position.x, player.position.y);
    if (hp <= 0)
    {
      player.remove();
      setTimeout(function(){
      alive = false;
    }, 3000);
    }
  }
}
function playerMovement()
{

  player.position.y -=baseSpeed;
  var verticalSpeed = 4;
  var horizontalSpeed = 4;

  if (keyDown('d')) {
    player.position.x = player.position.x + horizontalSpeed;
  }

  if (keyDown('a')) {
    player.position.x = player.position.x - horizontalSpeed;
  }

  if (keyDown('w')) {
    player.position.y = player.position.y - verticalSpeed;
  }

    if (keyDown('s')) {
    player.position.y = player.position.y + verticalSpeed;
  }

  if (keyWentDown('h'))
  {
    currentWeapon().triggerWentDown();
  }

  if (keyDown('h'))
  {
    currentWeapon().triggerHeld();
  }




}

function createExplosion(x,y)
{
  var explo = createSprite(x,y, 64,64);
  explo.addAnimation("e", explosion1);
  explo.height *= 3;
  explo.life = 8;
  explosionSound.play();
}
