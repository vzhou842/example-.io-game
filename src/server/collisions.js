const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {

  let players_arr = Object.values(players);
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
        bulletCollision = true;
        break;
      }
    }

    if (bulletCollision) continue;

    for (let j = 0; j < players_arr.length; j++) {
      const player = players_arr[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        if (players[bullet.parentID]) {
          players[bullet.parentID].onDealtDamage();
        }
	if (i == bullets.length - 1) {
          bullets.pop();
        } else {
          bullets[i] = bullets.pop();
        }
        player.takeBulletDamage();
        bulletCollision = true;
        break;
      }
    }

    if (!bulletCollision) i++;
  }

  for (let i = 0; i < players_arr.length; i++) {
    // Look for player collision
    for (let j = 0; j < players_arr.length; j++) {
      if (i == j) continue;
      const p1 = players_arr[i];
      const p2 = players_arr[j];
      if (p1.distanceTo(p2) <= Constants.PLAYER_RADIUS*2) {
        p1.takeBulletDamage();
        p2.takeBulletDamage();
      }
    }
  }
}

module.exports = applyCollisions;
