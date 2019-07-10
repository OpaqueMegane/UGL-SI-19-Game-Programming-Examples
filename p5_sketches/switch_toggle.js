var player;

var buttonGroup;
var singleWall;
function setup()
{
  createCanvas(600,400);
  player = createSprite(50,50, 32,32);
  singleWall = createSprite(300,200, 800, 32);

  buttonGroup = new Group();

  //var b = createButton(200, 75, 35,35, function(){});//, function(){"blink!"});
  var buttonFunction =  function(button){
  //  print(button.shapeColor);

    if ( red(button.shapeColor) == 255)
    {
        button.shapeColor = color(0,255,0);
    }
    else
    {
      button.shapeColor = color(255,0,0);
    }

  };
  var button = createSprite(200, 75, 35,35);
  button.shapeColor = color(255,0,0);
  button.action = buttonFunction;
  //button.held = false;
  //button.heldLastFrame = false;
  buttonGroup.add(button);


}

function createButton(x, y, w, h, buttonFunction)
{
  var button = createSprite(x, y, w, h);
  button.action = buttonFunction;
  //button.held = false;
  //button.heldLastFrame = false;
  return button;
}

function draw()
{
  background(0);
  playerMovement();
  player.collide(singleWall);
  buttons();
  drawSprites();

  /*var teleporterNumber = 0;
  teleporterGroup.forEach(function(teleporter01)
  {
    teleporterNumber++;
  fill(255);
  stroke(1);
  textAlign(RIGHT,CENTER);
  text("Teleporter " + teleporterNumber, teleporter01.position.x, teleporter01.position.y);

  textAlign(LEFT,CENTER);
  text("<-- teleporter destination "+ teleporterNumber, teleporter01.destination.x, teleporter01.destination.y);
});*/
}

function buttons()
{
  buttonGroup.overlap(player, function(button){
    //print("!!!");
    button.held = true;
  });

  buttonGroup.forEach(function(button){

    if (!button.heldLastFrame && button.held)
    {
      //print("aaa");
      button.action(button);
    }

    button.heldLastFrame = button.held;
    button.held = false;
  });
}

function onEnterTeleporter(button, thingThatTouchedButton)
{

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
