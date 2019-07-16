var player;

var teleporterGroup;
var wallGroup;
var level;

var chaserKiller;

var alive = true;

function preload()
{
  level = new TiledLevel("endless_runner_level.txt");
}

function setup()
{
  var moveAnim = loadAnimation("assets/move/1.png","assets/move/2.png" ,"assets/move/3.png","assets/move/4.png","assets/move/5.png");
  moveAnim.frameDelay = 5;

  createCanvas(600,400);
  player = createSprite(150,50, 16*2,32*2);
  player.addAnimation("move", moveAnim);
  player.scale = .5;
  //player.debug = true;
    player.setCollider("rectangle", 0,10,16/player.scale,32/player.scale);//,0,12,20,20);
  //player.setCollider("circle");

  player.jumpCount = 1;
  wallGroup = level.getWallGroup();//populateWalls(level, wallGroup);
  var brickImg = loadImage("assets/walls/brick.png");
  wallGroup.forEach(function(wall){

    wall.addImage("xx", brickImg);
    wall.scale = .5;
    wall.immovable = true;
  });


chaserKiller = createSprite(0, 50, 64, 512)
  //teleporterGroup.add(createTeleporter(500, 75, 50, 50, 50, 350));
camera.position.y = 100;
}



function draw()
{
  if (alive)
  {
    camera.on();
    background(0);


    player.velocity.y += .2;

    player.jumpCount -= .1;
    player.collide(wallGroup, onHitWall);
    playerMovement();


    drawSprites();

    camera.position.x = player.position.x;

    chaserKiller.overlap(player, function(c,p){ alive = false;});

    if (player.position.y > height + 100)
    {
      alive = false;
    }
  }
  else
  {
      camera.off();
      background("#55AA33");
      textAlign(CENTER, CENTER);
      textSize(48);
      fill(255);
      text("jeux\nau vert", width/2, height/2);
  }
  //camera.position.y = player.position.y;
}



function playerMovement()
{

  var baseSpeed = 2;
  player.velocity.x = baseSpeed;

chaserKiller.position.x += baseSpeed + .1;

  var speed = 1;
  player.animation.frameDelay = 5;
  if (keyDown('d')) {
    player.velocity.x += .75;
    player.animation.frameDelay = 3;
    moveAngle = 0;
  }

  if (keyDown('a')) {
    player.velocity.x -= 1.75;
    moveAngle = 180;
    player.animation.frameDelay = 8;
  }

  if (keyWentDown('w')) {
    //player.position.y = player.position.y - speed;
    if (player.jumpCount > 0)
    {
      player.jumpCount--;
      moveAngle = 270;
      player.velocity.y = -6.5;
    }

  }

    /*if (keyDown('s')) {
    player.position.y = player.position.y + speed;
      moveAngle = 90;
  }*/
}

function onHitWall(player, wall)
{
  let pw = player.scale * player.width;
  let ph = player.scale * player.height;
  let ww = wall.scale * wall.width;
  let wh = wall.scale * wall.height;

  let horizontallyOverlapping =
    player.position.x +  pw/2 > wall.position.x - ww/2.0
    &&
    player.position.x - pw/2 < wall.position.x + ww/2.0;

  let standingOnPlatform =
  wall.position.y - wh/2.0  >= player.position.y - ph/2.0
  &&
  horizontallyOverlapping;

  let hitCeiling =
  wall.position.y + wh/2  <= player.position.y - ph/2
  &&
  horizontallyOverlapping;

//
  if (player.velocity.y > 0  && standingOnPlatform)
  {
    player.velocity.y = 0;
    player.jumpCount = 1;
  }

  if (player.velocity.y < 0 && hitCeiling)
  {
    player.velocity.y = 0;
  }
}
