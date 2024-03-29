var player;

var buttonGroup;
var gate1;
var gate2;
  var button;
function setup()
{
  createCanvas(600,400);
  player = createSprite(50,50, 32,32);
  gate1 = createSprite(150,200, 300, 32);

  gate2 = createSprite(450,200, 300, 32);

makeGate(gate1, -32, 0);
makeGate(gate2, 32, 0);
  buttonGroup = new Group();

  button = createSprite(200, 75, 35,35);
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
  player.collide(gate1);
    player.collide(gate2);


    if (button.held)
    {
      button.shapeColor = color('green');
      //gate1.position.x--;
      //gate2.position.x++;
      gate1.gateOpen = true;
      gate2.gateOpen = true;
    }
    else {
      button.shapeColor = color('red');
      gate1.gateOpen = false;
      gate2.gateOpen = false;
      //gate1.position.x++;
      //gate2.position.x--;
    }
    let openAmt = 150;
    //gate1.position.x = constrain(gate1.position.x, 150-openAmt, 150);
    //gate2.position.x = constrain(gate2.position.x, 450,450+openAmt);

  buttons();
  drawSprites();
}


function buttons()
{
  buttonGroup.forEach(function(button){
    button.held = false;
  });
  buttonGroup.overlap(player, function(button){
    //print("!!!");
    button.held = true;
  });
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
