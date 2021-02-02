const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const CollisionMap = require('./collisions');

// 0: still
// 1: right, 2: upright, 3: up,   4: upleft 
// 5: left,  6: downleft 7: down, 8:downright
const playermovedir=[ [0,0],
                      [1, 0], [1/Math.sqrt(2), -1/Math.sqrt(2)],
                      [0, -1], [-1/Math.sqrt(2), -1/Math.sqrt(2)],
                      [-1,0], [-1/Math.sqrt(2), 1/Math.sqrt(2)],
                      [0,1], [1/Math.sqrt(2), 1/Math.sqrt(2)]];
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
    this.move = 0;
    this.isBot = false;
    this.shieldTime = 5; // Player will be shielded damage for 5 seconds
    this.canvasWidth = Constants.MAP_SIZE / 4;
    this.canvasHeight = Constants.MAP_SIZE / 4;
    this.collisionCooldown = Constants.PLAYER_COLLISION_COOLDOWN;
    this.type = 20;
  }

  restart() {
    this.hp = Constants.PLAYER_MAX_HP;
    this.hp_recover = 1;
    this.fireCooldownCount = 0;
    this.score = 0;
    this.bullets = 0;
    this.move = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    // We are not going to move automatically
    // super.update(dt);

    if (this.shieldTime > 0) this.shieldTime -= dt;

    this.x += dt * Constants.PLAYER_SPEED * playermovedir[this.move][0];
    this.y += dt * Constants.PLAYER_SPEED * playermovedir[this.move][1];

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
 
    CollisionMap.updateObject(this);

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

    if (this.collisionCooldown > 0) this.collisionCooldown -= dt;

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

  handleCanvasSize(w, h) {
    this.canvasWidth = w;
    this.canvasHeight = h;
    console.log("Player canvas size:", w, h);
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

  takeCollisionDamage() {
    if (this.collisionCooldown < 0) {
      this.takeBulletDamage();
      this.collisionCooldown = Constants.PLAYER_COLLISION_COOLDOWN;
    }
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
      shieldTime: this.shieldTime,
    };
  }
}

module.exports = Player;
