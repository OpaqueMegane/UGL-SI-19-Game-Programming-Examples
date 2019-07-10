var player;

var teleporterGroup;
var singleWall;
function setup()
{
  createCanvas(600,400);
  player = createSprite(50,50, 32,32);
  singleWall = createSprite(300,200, 800, 32);

  teleporterGroup = new Group();


  teleporterGroup.add(createTeleporter(500, 75, 50, 50, 50, 350));

  teleporterGroup.add(createTeleporter(500, 350, 50, 50, 50, 50));
  //teleporterGroup.add(createTeleporter(500, 75, 50, 50, 50, 350));

}

function createTeleporter(x, y, w, h, destinationX, destinationY)
{
  var teleporter = createSprite(x, y, w, h);//(500, 75, 50, 50);
  teleporter.destination = createVector(destinationX, destinationY);
  return teleporter;
}

function draw()
{
  background(0);
  playerMovement();
  player.collide(singleWall);
  teleporters();
  drawSprites();

  var teleporterNumber = 0;
  teleporterGroup.forEach(function(teleporter01)
  {
    teleporterNumber++;
  fill(255);
  stroke(1);
  textAlign(RIGHT,CENTER);
  text("Teleporter " + teleporterNumber, teleporter01.position.x, teleporter01.position.y);

  textAlign(LEFT,CENTER);
  text("<-- teleporter destination "+ teleporterNumber, teleporter01.destination.x, teleporter01.destination.y);
});
}

function teleporters()
{
  teleporterGroup.overlap(player, onEnterTeleporter);
}

function onEnterTeleporter(teleporter, thingThatEntered)
{
  thingThatEntered.position.x = teleporter.destination.x;
  thingThatEntered.position.y = teleporter.destination.y;
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
}
