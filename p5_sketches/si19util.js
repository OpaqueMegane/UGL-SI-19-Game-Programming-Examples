
function addSideWalls(levelMap, wallGroup)
{
  var ul =levelMap.gridToPixelPosition(-1.5,-1.5);
  var lr =levelMap.gridToPixelPosition(levelMap.w + 1.5,levelMap.h + 1.5);
  wallGroup.add(createSprite(ul.x, (ul.y + lr.y) /2, levelMap.TILE_SZ, lr.y - ul.y));
  wallGroup.add(createSprite(lr.x, (ul.y + lr.y) /2, levelMap.TILE_SZ, lr.y - ul.y));

  wallGroup.add(createSprite(
    (ul.x + lr.x) /2, ul.y,
   lr.x - ul.x, levelMap.TILE_SZ));

   wallGroup.add(createSprite(
     (ul.x + lr.x) /2, lr.y,
    lr.x - ul.x, levelMap.TILE_SZ));
}

function populateWalls(levelMap, wallGroup)
{
  levelMap.populateWalls(wallGroup);
}
function textIgnoreCamera(txt, x, y, x2, y2)
{
  text(txt, x + camera.position.x - width/2, y+ camera.position.y - height/2, x2, y2);
}

function resetCamera()
{
  camera.position.x = width/2;
  camera.position.y = height/2;
}

class TiledLevel
{
  constructor(levelFile)
  {
    this.w = 0;
    this.h = 0;
    this.TILE_SZ = 40;
    this.tiles= {};
    this.hello = "hello";
    loadJSON(levelFile, this.applyJson.bind(this));
  }
  
  applyJson(jsonLevel)
  {
    console.log(this + "   "+  this.hello);
    Object.assign(this, jsonLevel);
  }

  gridToPixelPosition(gridX, gridY)
  {
    var ret = createVector((gridX + .5) * this.TILE_SZ,(gridY + .5) * this.TILE_SZ);
    return ret;
  }

  getGroup(tileId)
  {

    console.log("XXXX " + this.w);
      var retGroup = new Group();

      var TILE_SZ = this.TILE_SZ;

        for (var xi =0; xi < this.w; xi++)
        {
          console.log("xi" + xi);
          for (var yi = 0; yi < this.h; yi++)
          {
            //
            var mabyeTile = this.tiles[xi][yi];

            if (mabyeTile  )//maybeTile != null && maybeTile != undefined)
            {
              console.log(mabyeTile.type);
              if (mabyeTile.type === "DECO")
              {
                retGroup.add(createSprite(xi * TILE_SZ, yi*TILE_SZ,TILE_SZ,TILE_SZ));
              }
              //print(":!"+xi + ", " +yi);


            }
          }
        }
        return retGroup;

  }

  populateWalls(wallGroup)
  {
    var TILE_SZ = this.TILE_SZ;

      for (var xi =0; xi < this.w; xi++)
      {

        for (var yi = 0; yi < this.h; yi++)
        {
          //
          var mabyeTile = this.tiles[xi][yi];

          if (mabyeTile && mabyeTile.type === "WALL")//maybeTile != null && maybeTile != undefined)
          {
            //print(":!"+xi + ", " +yi);
            wallGroup.add(createSprite(xi * TILE_SZ, yi*TILE_SZ,TILE_SZ,TILE_SZ));
          }
        }
      }
    }
}

function makeGate(sprite, xMove, yMove)
{
  sprite.gateOpen = false;
  sprite.fullGateOffset = createVector(xMove, yMove);
  sprite.basePosition = createVector(sprite.position.x, sprite.position.y);
  sprite.gateSpeed = 10;
  //sprite.currentGateOffset = createVector(0,0);

var oldDraw = sprite.draw;
  var nuDraw =function()
  {
    if (sprite.gateOpen)
    {
        sprite.position.x = moveTowards(sprite.position.x, sprite.basePosition.x + sprite.fullGateOffset.x, sprite.gateSpeed);
        sprite.position.y = moveTowards(sprite.position.y, sprite.basePosition.y + sprite.fullGateOffset.y, sprite.gateSpeed);
    }
    else
    {
      sprite.position.x = moveTowards(sprite.position.x, sprite.basePosition.x, sprite.gateSpeed);
      sprite.position.y = moveTowards(sprite.position.y, sprite.basePosition.y, sprite.gateSpeed);
    }
    oldDraw.call(sprite);
  }
  sprite.draw = nuDraw;
  return sprite;
}

function moveTowards(val, target, maxSpeed)
{

  if (val < target)
  {
    return Math.min(val + maxSpeed, target);
  }
  else if (val > target)
  {
    return Math.max(val - maxSpeed, target);
  }
  return val;
}
