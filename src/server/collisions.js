const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage();
        break;
      }
    }
  }

  for (let i = 0; i < players.length; i++) {
    // Look for player collision
    for (let j = 0; j < players.length; j++) {
      if (i == j) continue;
      const p1 = players[i];
      const p2 = players[j];
      if (p1.distanceTo(p2) <= Constants.PLAYER_RADIUS*2) {
        p1.takeBulletDamage();
        p2.takeBulletDamage();
      }
    }
  }

  return destroyedBullets;
}

module.exports = applyCollisions;
