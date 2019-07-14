var player;

var teleporterGroup;
var wallGroup;
var levelMap;
var levelJson;

var chaserKiller;

var alive = true;

function preload()
{
  levelJson = loadJSON('endless_runner_level_1.txt');
  console.log(levelMap.tiles);
  //loadMapFromFile('endless_runner_level_1.txt');
}

function setup()
{
  createCanvas(600,400);
  wallGroup = new Group();
  player = createSprite(150,50, 16,32);
  levelMap = new TiledLevel(levelJson);
    //player.setCollider("circle", 0,12, 10,10);//,0,12,20,20);
  //player.setCollider("circle");

  player.jumpCount = 1;
  populateWalls(levelMap, wallGroup);




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
  if (keyDown('d')) {
    player.velocity.x += .5;
    moveAngle = 0;
  }

  if (keyDown('a')) {
    player.velocity.x -= 1.75;
    moveAngle = 180;
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
  let horizontallyOverlapping =
    player.position.x + player.width/2 > wall.position.x - wall.width/2.0
    &&
    player.position.x - player.width/2 < wall.position.x + wall.width/2.0;

  let standingOnPlatform =
  wall.position.y - wall.height/2.0  >= player.position.y - player.height/2.0
  &&
  horizontallyOverlapping;

  let hitCeiling =
  wall.position.y + wall.height/2  <= player.position.y - player.height/2
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
