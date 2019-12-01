const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass.Object {
  constructor(id, username, x, y, tag) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.tagged = tag;
    this.tagLag = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    if(this.tagged == false){
        this.score += dt * Constants.SCORE_PER_SECOND;
        this.speed = Constants.PLAYER_SPEED;
    } else {
        this.speed = Constants.PLAYER_SPEED + 100;
    }
      
    // decrease tag lag
    if (this.tagLag > 0) {
        this.tagLag--;
    }

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }


  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      tagged: this.tagged,
    };
  }
}

module.exports = Player;
