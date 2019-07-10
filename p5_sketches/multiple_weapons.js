var player;

var teleporterGroup;
var wallGroup;
var shipImg, explosion1;
var explosionSprite;
var explosionSound, shootSound;
var bulletGroup;
var loopyBulletGroup;

function currentWeapon(){
  return weapons[currentWeaponIdx];
}

var peaShooter = [];
var flameThrower = [];
var mineLayer = [];
var loopy = [];

var currentWeaponIdx = 0;
var weapons = [loopy, flameThrower, mineLayer, peaShooter];

function preload()
{
  explosionSound = loadSound("explosioin.wav");
    shootSound = loadSound("col_flop.wav");
frameRate(45);
 explosion1 = loadAnimation("explosion/1.png","explosion/2.png","explosion/3.png","explosion/4.png");
 explosion1.frameDelay  = 2;
  wallGroup = new Group();
  bulletGroup = new Group();
  loopyBulletGroup = new Group();
  player = createSprite(150,50, 32,32);
  player.maxSpeed = 2;
  //player.friction = .01;

  shipImg = loadImage("ship.png");
  player.addImage("xx",shipImg);
  player.changeAnimation("xx");
  //player.friction = 0.98;



  /*wallGroup.add(createSprite(300,350, 800, 32));

  //wallGroup.add( createSprite(500,250, 100, 32));

wallGroup.add( createSprite(500,300, 100, 100));

  wallGroup.add( createSprite(50,300, 32, 400));*/

  teleporterGroup = new Group();


peaShooter.name = "Peashooter";
peaShooter.triggerWentDown = function(){
  shootSound.play();
  var bullet = createSprite(player.position.x,player.position.y, 8,8);
  bullet.setSpeed(8, moveAngle);
  bullet.life = 64;
  bulletGroup.add(bullet);
};
peaShooter.triggerHeld = function(){};

flameThrower.name = "Flamethrower";
flameThrower.coolDown = 0;
flameThrower.triggerWentDown = function(){};
flameThrower.triggerHeld = function(){
  this.coolDown++;
  if (this.coolDown >= 2)
  {
    this.coolDown = 0;
    var bullet = createSprite(player.position.x,player.position.y, 10,10);
    bullet.depth = -10;
    bullet.setSpeed(random(4,8), moveAngle + random(-20,20));
    bullet.life = 14;
    bulletGroup.add(bullet);
  }

};

mineLayer.name = "Minelayer";
mineLayer.currentMine = null;
mineLayer.triggerWentDown = function(){

  if (mineLayer.currentMine == null)
  {
    mineLayer.currentMine = createSprite(player.position.x,player.position.y, 8,8);
  }
  else {
    createExplosion(mineLayer.currentMine.position.x, mineLayer.currentMine.position.y);

    for (let i =0; i < 360; i+= 25)
    {
      var bullet = createSprite(mineLayer.currentMine.position.x, mineLayer.currentMine.position.y, 10,10);
      bullet.depth = -10;
      bullet.setSpeed(random(4,8), i + random(-10,10));
      bullet.life = round(random(7,20));
      bulletGroup.add(bullet);
    }

    mineLayer.currentMine.remove();
    mineLayer.currentMine = null;

  }
};
mineLayer.triggerHeld = function(){};


loopy.name = "Loopy";
loopy.triggerWentDown = function(){

var bullet = createSprite(player.position.x, player.position.y, 3,3);
bulletGroup.add(bullet);
loopyBulletGroup.add(bullet);
//bullet.life = 32;

bullet.swingDirection = moveAngle == 0 ? 1 : -1;
bullet.radius = 10;
bullet.time = 0;
bullet.swingAngle = (-moveAngle + 90)/180.0 * 3.1415;
};
loopy.triggerHeld= function(){};

  //teleporterGroup.add(createTeleporter(500, 75, 50, 50, 50, 350));

}

function setup()
{
  createCanvas(600,400);

  wallGroup.add(createSprite(width/2,0, width, 32));
  wallGroup.add(createSprite(width/2,height, width, 32));

  wallGroup.add(createSprite(0,height/2, 32, height));
  wallGroup.add(createSprite(width,height/2, 32, height));
  wallGroup.forEach(function(wall)
  {
    wall.immovable= true;
  });
}


function draw()
{
  background(0);


  //player.velocity.y += .2;

  player.collide(wallGroup);
  playerMovement();

bulletGroup.overlap(wallGroup, function(bullet, wall){
createExplosion(bullet.position.x, bullet.position.y,4);
  bullet.remove();
});

//gravity
// bulletGroup.forEach(function(bullet){
//
//   bullet.velocity.y += .5;
// });

loopyBulletGroup.forEach(function(lb){
//lb.radius += 1;
let t = min(1,lb.time / 7.0);
  lb.position.x = player.position.x + 60 * sin((1-1.8*t)* .5* 3.1415 * lb.swingDirection + lb.swingAngle);
  lb.position.y = player.position.y + 60 * cos((1-1.8*t)*.5* 3.1415 * lb.swingDirection+ lb.swingAngle);
  stroke(random(0,255), random(0,255),random(0,255));
  strokeWeight(3);
  line(player.position.x, player.position.y, lb.position.x, lb.position.y);
  lb.time++;
  if (lb.time > 11)
  {
    lb.remove();
  }
});

  drawSprites();

fill(255);
noStroke();
text("current weapon:\n"+currentWeapon().name, 10,50);
}


function playerMovement()
{
  var speed = 3;
  if (keyDown('d')) {
    player.position.x = player.position.x + speed;
    moveAngle = 0;
  }

  if (keyDown('a')) {
    player.position.x = player.position.x - speed;
    moveAngle = 180;
  }

  if (keyDown('w')) {
    player.position.y = player.position.y - speed;
    moveAngle = 270;
  }

    if (keyDown('s')) {
    player.position.y = player.position.y + speed;
      moveAngle = 90;
  }

  if (keyWentDown('h'))
  {
    currentWeapon().triggerWentDown();
  }

  if (keyDown('h'))
  {
    currentWeapon().triggerHeld();
  }

  if (keyWentDown('1'))
  {
    currentWeaponIdx = (currentWeaponIdx + 1) % weapons.length;
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
