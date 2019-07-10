var player;

var teleporterGroup;
var wallGroup;
var shipImg, explosion1;
var explosionSprite;
var explosionSound, shootSound;
var bulletGroup;

function preload()
{
  explosionSound = loadSound("explosioin.wav");
    shootSound = loadSound("col_flop.wav");
frameRate(45);
 explosion1 = loadAnimation("explosion/1.png","explosion/2.png","explosion/3.png","explosion/4.png");
 explosion1.frameDelay  = 2;
  wallGroup = new Group();
  bulletGroup = new Group();
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

  player.bounce(wallGroup, onHitWall);
  playerMovement();

bulletGroup.overlap(wallGroup, function(bullet, wall){
createExplosion(bullet.position.x, bullet.position.y);
  bullet.remove();
});

//gravity
bulletGroup.forEach(function(bullet){

  bullet.velocity.y += .5;
});

  drawSprites();


}

function onHitWall(player, wall)
{

}

function playerMovement()
{
  if (keyDown('w')) {
    //player.position.y = player.position.y - speed;

       player.setSpeed(2, player.rotation);
      //player.velocity.y = -7;


  }

  else if (keyDown('s')) {
    //player.position.y = player.position.y - speed;

       player.setSpeed(-1, player.rotation);
      //player.velocity.y = -7;


  }
  else {
    player.setSpeed(0);//, player.rotation);
  }

  //player.velocity.x = 0;
  var speed = 3;
  if (keyDown('d')) {
        player.rotation += 3;
  }

  if (keyDown('a')) {
      player.rotation -= 3;
  }



    if (keyWentDown('h')) {
      //animation(explosion1, player.position.x,player.position.y);
      shootSound.play();
      var bullet = createSprite(player.position.x,player.position.y, 8,8);
      bullet.setSpeed(8, player.rotation);
      bullet.life = 64;
      bulletGroup.add(bullet);
      //player.position.x,player.position.y
  }
}

function createExplosion(x,y)
{
  var explo = createSprite(x,y, 64,64);
  explo.addAnimation("e", explosion1);
  explo.life = 8;
  explosionSound.play();
}
