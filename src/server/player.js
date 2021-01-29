const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.hp_recover = 1;
    this.fireCooldownCount = 0;
    this.fireCooldown = Constants.PLAYER_FIRE_COOLDOWN;
    this.score = 0;
    this.bullets = 0;
    this.autofire = false;
    this.move = '';
    this.isBot = false;
    this.shieldTime = 5; // Player will be shielded damage for 5 seconds
  }

  restart() {
    this.hp = Constants.PLAYER_MAX_HP;
    this.hp_recover = 1;
    this.fireCooldownCount = 0;
    this.score = 0;
    this.bullets = 0;
    this.move = '';
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    // We are not going to move automatically
    // super.update(dt);

    if (this.shieldTime > 0) this.shieldTime -= dt;

    if (this.move != '') {
      if (this.move == 'up') {
        this.y -= dt * Constants.PLAYER_SPEED;
      }
      if (this.move == 'down') {
        this.y += dt * Constants.PLAYER_SPEED;
      }
      if (this.move == 'left') {
        this.x -= dt * Constants.PLAYER_SPEED;
      }
      if (this.move == 'right') {
        this.x += dt * Constants.PLAYER_SPEED;
      }
    }

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    this.hp_recover -= dt;
    if (this.hp_recover <= 0) {
      if (this.hp < Constants.PLAYER_MAX_HP) this.hp ++;
      this.hp_recover += Constants.PLAYER_HP_RECOVERY_RATE;
    }

    // Fire a bullet, if needed
    this.fireCooldownCount -= dt;
    if (this.fireCooldownCount <= 0 && this.autofire || this.bullets > 0) {
      this.fireCooldownCount += this.fireCooldown;
      this.bullets--;
      return new Bullet(this.id, this.x, this.y, this.direction);
    }

    return null;
  }

  setMoveDirection(dir) {
    this.move = dir;
  }

  toggle(tog) {
    if (tog == 'e') {
      this.autofire = ! this.autofire;
      this.bullets = 0;
      if (this.fireCooldownCount < 0) this.fireCooldownCount = 0;
    }
  }

  openFire(start) {
//    if (! this.autofire) {
//      this.bullets ++;
//    }
    if (start == 'once') {
       this.bullets ++;
    }
    this.autofire = (start == 'on');
    if (this.fireCooldownCount < 0) this.fireCooldownCount = 0;
  }

  takeBulletDamage() {
    if (this.shieldTime < 0)
      this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      username: this.username,
      hp: this.hp,
    };
  }
}

module.exports = Player;
