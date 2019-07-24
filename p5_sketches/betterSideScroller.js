var player;

var teleporterGroup;
var wallGroup;
var nDoubleJumpsAllowed = 0;
function setup()
{
  createCanvas(600,400);
  wallGroup = new Group();
  player = createSprite(150,50, 32,32);
  //player.setCollider("circle");

  player.jumpCount = 1;

  wallGroup.add(createSprite(300,350, 800, 32));

  //wallGroup.add( createSprite(500,250, 100, 32));

wallGroup.add( createSprite(500,300, 100, 100));

  wallGroup.add( createSprite(50,300, 32, 400));

  teleporterGroup = new Group();



  //teleporterGroup.add(createTeleporter(500, 75, 50, 50, 50, 350));

}



function draw()
{
  background(0);


  player.velocity.y += .2;

  if (prevWasTouching && !player.touching.bottom)
  {
    player.jumpCount = 0;
  }
  prevWasTouching = player.touching.bottom;

  player.collide(wallGroup, onHitWall);
  playerMovement();


  drawSprites();

}

function onHitWall(player, wall)
{
  if (player.touching.bottom)
  {
    player.jumpCount = 1;
  }
  if (player.touching.top || player.touching.bottom)
  {
    player.velocity.y = 0;
  }
}

var prevWasTouching = false;
function playerMovement()
{
  player.velocity.x = 0;
  var speed = 3;
  if (keyDown('d')) {
    player.velocity.x = speed;
    moveAngle = 0;
  }

  if (keyDown('a')) {
    player.velocity.x = -speed;
    moveAngle = 180;
  }

  if (keyWentDown('w')) {
    //player.position.y = player.position.y - speed;
    if (player.jumpCount + nDoubleJumpsAllowed > 0)
    {
      player.jumpCount--;
      moveAngle = 270;
      player.velocity.y = -7;
    }

  }

  fill("white");
  text(player.jumpCount, 80,80);

    /*if (keyDown('s')) {
    player.position.y = player.position.y + speed;
      moveAngle = 90;
  }*/
}
