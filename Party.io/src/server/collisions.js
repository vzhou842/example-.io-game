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
  return destroyedBullets;
}

// Given two players changes their tagged value
function playerCollision(players){
    for (let i = 0; i < players.length; i++) {
        for (let j = 0; j < players.length; j++) {
            const player1 = players[i];
            const player2 = players[j];
            
            if (player1 != player2 && player1.distanceTo(player2) <= (Constants.PLAYER_RADIUS * 2) && player1.tagLag == 0 && player2.tagLag == 0) {
                // Only changes their tagLag if it's a real tag
                if (player1.tagged != player2.tagged) {
                        const tagValue = player1.tagged;
                        player1.tagged = player2.tagged;
                        player2.tagged = tagValue;

                        player1.tagLag = 60
                        player2.tagLag = 60
                }
            }
        }
    }
    
}

// Collisions between players and walls and shit
function playerWallCollisions(players, walls) {
    //for (let i = 0; i < )
    console.log()
}

module.exports = {playerCollision,playerWallCollisions};