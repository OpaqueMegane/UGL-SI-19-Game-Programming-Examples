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


  getGroupGeneric(role, swatchName)
  {

    var retGroup = new Group();
    var TILE_SZ = this.TILE_SZ;
    //console.log("---"+this.swatches["WALL"]);
    var swatchSource = this.swatches[role];
      for (var xi =0; xi < this.w; xi++)
      {
        for (var yi = 0; yi < this.h; yi++)
        {
          var mabyeTile = this.tiles[xi][yi];

          if (mabyeTile  )//maybeTile != null && maybeTile != undefined)
          {
            let tilesSwatchName = null;
            if (swatchSource[mabyeTile.tileSwatchIdx])
            {
              tilesSwatchName = swatchSource[mabyeTile.tileSwatchIdx].name;
            }

            if (mabyeTile.tileType === role && (!swatchName || swatchName === tilesSwatchName))
            {
              var s = createSprite(xi * TILE_SZ, yi*TILE_SZ,TILE_SZ,TILE_SZ);
              s.tileSwatchIdx = mabyeTile.tileSwatchIdx;
              if(mabyeTile.tileCustomData)
              {
                s.tileCustomData = mabyeTile.tileCustomData;
              }

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

    return this.getGroupGeneric("OTHER", tileType);



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
