const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.liveTime = 5; // 5 seconds
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    // The bullet will be removed after 5 seconds
    this.liveTime -= dt;
    return this.liveTime < 0 || this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }
}

module.exports = Bullet;
