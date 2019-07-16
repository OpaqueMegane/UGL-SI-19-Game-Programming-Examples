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
    loadJSON(levelFile, this.applyJson.bind(this));
  }

  applyJson(jsonLevel)
  {
    Object.assign(this, jsonLevel);
  }

  gridToPixelPosition(gridX, gridY)
  {
    var ret = createVector((gridX + .5) * this.TILE_SZ,(gridY + .5) * this.TILE_SZ);
    return ret;
  }


  getGroupGeneric(role, tileType)
  {
    var retGroup = new Group();
    var TILE_SZ = this.TILE_SZ;
    var swatchSource = role === "WALL" ? this.swatches.wall : this.swatches.other;
      for (var xi =0; xi < this.w; xi++)
      {
        for (var yi = 0; yi < this.h; yi++)
        {
          var mabyeTile = this.tiles[xi][yi];

          if (mabyeTile  )//maybeTile != null && maybeTile != undefined)
          {
            if (mabyeTile.type === role && (!tileType || tileType === mabyeTile.tileType))
            {
              var s = createSprite(xi * TILE_SZ, yi*TILE_SZ,TILE_SZ,TILE_SZ);
              s.levelSwatchIdx = mabyeTile.textureIdx;
              s.levelCustomData = mabyeTile.custom;
              //s.levelSwatch = swatchSource[mabyeTile.textureIdx];
              retGroup.add(s);
            }
          }
        }
      }
      return retGroup;
  }

  getGroup(tileType)
  {

    return this.getGroupGeneric("DECO", tileType);



  }

  getWallGroup()
  {
      return this.getGroupGeneric("WALL", null);
    }

    addSideWalls(wallGroup)
    {
      var ul = this.gridToPixelPosition(-1.5,-1.5);
      var lr = this.gridToPixelPosition(this.w + 1.5,this.h + 1.5);
      wallGroup.add(createSprite(ul.x, (ul.y + lr.y) /2, this.TILE_SZ, lr.y - ul.y));
      wallGroup.add(createSprite(lr.x, (ul.y + lr.y) /2, this.TILE_SZ, lr.y - ul.y));

      wallGroup.add(createSprite(
        (ul.x + lr.x) /2, ul.y,
       lr.x - ul.x, this.TILE_SZ));

       wallGroup.add(createSprite(
         (ul.x + lr.x) /2, lr.y,
        lr.x - ul.x, this.TILE_SZ));
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
