var player;

var teleporterGroup;
var wallGroup;
var shipImg;
function preload()
{

  wallGroup = new Group();
  player = createSprite(150,50, 32,32);
  player.maxSpeed = 2;
  player.friction = .01;

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


  drawSprites();


}

function onHitWall(player, wall)
{

}

function playerMovement()
{
  //player.velocity.x = 0;
  var speed = 3;
  if (keyDown('d')) {
        player.rotation += 3;
  }

  if (keyDown('a')) {
      player.rotation -= 3;
  }

  if (keyDown('w')) {
    //player.position.y = player.position.y - speed;

       player.addSpeed(.25, player.rotation);
      //player.velocity.y = -7;


  }

    if (keyWentDown('h')) {
      var bullet = createSprite(player.position.x,player.position.y, 8,8);
      bullet.setSpeed(8, player.rotation);
      bullet.life = 30;
  }
}
