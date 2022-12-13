const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyBullets(players, bullets) {
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
        destroyedBullets.push({
          bullet,
          hitId:player.id
        });
        player.takeBulletDamage();
        break;
      }
    }
  }
  return destroyedBullets;
}

function applyAidKits(players, aidkits) {
  const usedAidKits = [];
  for (let i = 0; i < aidkits.length; i++) {
    if (!aidkits[i].exist) continue;
    for (let j = 0; j < players.length; j++) {
      const aidkit = aidkits[i];
      const player = players[j];
      if (
        player.distanceTo(aidkit) <= Constants.PLAYER_RADIUS + Constants.AID_KIT_RADIUS
      ) {
        usedAidKits.push(aidkit);
        player.useAidKit(aidkit);
        break;
      }
    }
  }
  return usedAidKits;
}

module.exports = {
  applyBullets,
  applyAidKits
}