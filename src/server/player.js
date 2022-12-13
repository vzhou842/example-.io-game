const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, user, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = user.name;
    this.tokenId = user.tokenId;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Make sure the player stays in bounds
    this.x = Math.max(Constants.PLAYER_RADIUS, Math.min(Constants.MAP_SIZE-Constants.PLAYER_RADIUS, this.x));
    this.y = Math.max(Constants.PLAYER_RADIUS, Math.min(Constants.MAP_SIZE-Constants.PLAYER_RADIUS, this.y));

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

  onDealtDamage() {
    this.score += 1;
  }

  useAidKit(aidkit) {
    this.hp += aidkit.hp;
    if (this.hp > Constants.PLAYER_MAX_HP) {
      this.hp = Constants.PLAYER_MAX_HP;
    }
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      tokenId:this.tokenId
    };
  }
}

module.exports = Player;
