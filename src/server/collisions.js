const Constants = require('../shared/constants');

let objectMap = []
let objectMapMaxIndex = Math.floor( (Constants.MAP_SIZE - 1) / Constants.MAP_OBJ_GRID_SIZE);
function init() {
  for (let x = 0; x <= objectMapMaxIndex; x++) {
    objectMap[x] = [];
    for (let y = 0; y <= objectMapMaxIndex; y++) {
      objectMap[x][y] = [0];
    }
  }
}

// expect obj has 5 attributes:
// (x, y): obj's position in the game map
// (mapX, mapY): obj's position in the objectMap
// mapPos: the index of the obj in (mapX, mapY)
function addObject(obj) {
  obj.mapX = Math.max(0, Math.min(objectMapMaxIndex, Math.floor(obj.x / Constants.MAP_OBJ_GRID_SIZE)));
  obj.mapY = Math.max(0, Math.min(objectMapMaxIndex, Math.floor(obj.y / Constants.MAP_OBJ_GRID_SIZE)));
  objectMap[obj.mapX][obj.mapY][0]++;
  obj.mapPos = objectMap[obj.mapX][obj.mapY][0];
  objectMap[obj.mapX][obj.mapY].push(obj);

//  console.log("add obj:" + obj.id + " " + obj.mapPos + " " + objectMap[obj.mapX][obj.mapY][obj.mapPos]);
}

function removeObject(obj) {

//  if (obj.mapX < 0 || obj.mapX > objectMapMaxIndex
//	|| obj.mapY < 0 || obj.mapY > objectMapMaxIndex 
//	|| obj.mapPos < 1 || 
  if (objectMap[obj.mapX][obj.mapY][obj.mapPos] != obj) {
    console.log("Error: an object(id:" + obj.id + ") to be removed is not in the object map!");
    return;
  }
//  console.log("An object(id:" + obj.id + ") is removed");

  if (obj.mapPos == objectMap[obj.mapX][obj.mapY][0]) {
    objectMap[obj.mapX][obj.mapY].pop();
  } else {
    const mvObj = objectMap[obj.mapX][obj.mapY].pop();
    objectMap[obj.mapX][obj.mapY][obj.mapPos] = mvObj;
    mvObj.mapPos = obj.mapPos;
  }
  objectMap[obj.mapX][obj.mapY][0]--;
}

function updateObject(obj) {
  let mapX = Math.max(0, Math.min(objectMapMaxIndex, Math.floor(obj.x / Constants.MAP_OBJ_GRID_SIZE)));
  let mapY = Math.max(0, Math.min(objectMapMaxIndex, Math.floor(obj.y / Constants.MAP_OBJ_GRID_SIZE)));

  // no change
  if (obj.mapX == mapX && obj.mapY == mapY) return;

  if (objectMap[obj.mapX][obj.mapY][obj.mapPos] != obj) {
    console.log("Error: an object(id:" + obj.id + ") to be updated is not in the object map!");
    return;
  }

  if (obj.mapPos == objectMap[obj.mapX][obj.mapY][0]) {
    objectMap[obj.mapX][obj.mapY].pop();
  } else {
    const mvObj = objectMap[obj.mapX][obj.mapY].pop();
    objectMap[obj.mapX][obj.mapY][obj.mapPos] = mvObj;
    mvObj.mapPos = obj.mapPos;
  }
  objectMap[obj.mapX][obj.mapY][0]--;

  obj.mapX = mapX;
  obj.mapY = mapY;
  objectMap[obj.mapX][obj.mapY][0]++;
  obj.mapPos = objectMap[obj.mapX][obj.mapY][0];
  objectMap[obj.mapX][obj.mapY].push(obj);
}

function applyCollisions2() {
  for (let x = 0; x <= objectMapMaxIndex; x++) {
    for (let y = 0; y <= objectMapMaxIndex; y++) {
      objectMap[x][y] = [0];
    }
  }
}


// Returns an array of bullets to be destroyed.
function applyCollisions(playersObj, bulletsObj) {

  let players = Object.values(playersObj);
  let bullets = Object.values(bulletsObj);
  let i = 0;
  while (i < bullets.length) {

    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.

    const bullet = bullets[i];
    let bulletCollision = false;

    for (let j = i + 1; j < bullets.length; j++) {
      const bullet2 = bullets[j];
      if (
        bullet.parentID !== bullet2.parentID &&
        bullet.distanceTo(bullet2) <= Constants.BULLET_RADIUS * 2
      ) {
	if (j == bullets.length - 1) {
          bullets.pop();
        } else {
          bullets[j] = bullets.pop();
        }
	if (i == bullets.length - 1) {
          bullets.pop();
        } else {
          bullets[i] = bullets.pop();
        }
        bullet.remove();
        bullet2.remove();
        delete bulletsObj[bullet.id];
        delete bulletsObj[bullet2.id];
        bulletCollision = true;
        break;
      }
    }

    if (bulletCollision) continue;

    for (let j = 0; j < players.length; j++) {
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        if (playersObj[bullet.parentID]) {
          playersObj[bullet.parentID].onDealtDamage();
        }
	if (i == bullets.length - 1) {
          bullets.pop();
        } else {
          bullets[i] = bullets.pop();
        }
        player.takeBulletDamage();
        bulletCollision = true;
        bullet.remove();
        delete bulletsObj[bullet.id];
        break;
      }
    }

    if (!bulletCollision) i++;
  }

  for (let i = 0; i < players.length; i++) {
    // Look for player collision
    for (let j = 0; j < players.length; j++) {
      if (i == j) continue;
      const p1 = players[i];
      const p2 = players[j];
      if (p1.distanceTo(p2) <= Constants.PLAYER_RADIUS*2) {
        p1.takeCollisionDamage();
        p2.takeCollisionDamage();
      }
    }
  }
}

function getObjectUpdates(player) {

    const halfw = Math.round ( (Math.floor(player.canvasWidth / Constants.MAP_OBJ_GRID_SIZE) + 1) / 2);
    const halfh = Math.round ( (Math.floor(player.canvasHeight / Constants.MAP_OBJ_GRID_SIZE) + 1) / 2);

    const mapX1 = Math.max(0, player.mapX - halfw);
    const mapX2 = Math.min(objectMapMaxIndex, player.mapX + halfw);
    const mapY1 = Math.max(0, player.mapY - halfh);
    const mapY2 = Math.min(objectMapMaxIndex, player.mapY + halfh);

    let nearbyPlayers = [];
    let otherNearbyBullets = [];
    let myNearbyBullets = [];
    let c = 0;
    for (let x = mapX1; x <= mapX2; x++) {
      for (let y = mapY1; y <= mapY2; y++) {
        for (let i = 1; i <= objectMap[x][y][0]; i++) {
          c++;
          const obj = objectMap[x][y][i];
          if (obj.getType() < 20) {
            // bullets and raw objects
            if (obj.parentID != player.id) {
              otherNearbyBullets.push(obj);
            } else {
              myNearbyBullets.push(obj);
            }
          } else if (obj.getType() < 30) {
            // players
            if (obj.id != player.id) {
              nearbyPlayers.push(obj);
            }
          }
        }
      }
    }
 
//    if (c > 10)
//    console.log("for player:" + player.username + " obj:" + c + " hx:" + halfw + " hy:" + halfh + " cw:" + player.canvasWidth + " cy:" + player.canvasHeight);
 
    return {nearbyPlayers, otherNearbyBullets, myNearbyBullets};
}

module.exports = {
  init, 
  applyCollisions,
  applyCollisions2,
  addObject,
  updateObject,
  removeObject,
  getObjectUpdates
}

