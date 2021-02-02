const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parent, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parent = parent;
    this.parentID = parent.id;
    this.liveTime = 5; // 5 seconds
    this.type = 10;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    // The bullet will be removed after 5 seconds
    this.liveTime -= dt;
    if (this.liveTime < 0 || this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE) {
      this.remove();
    }
  }

  collision(obj) {
    // do nothing
    if (obj.getType() >= 20) {
      let ret=obj.collision(this);
      
      return ((ret & 1) << 1) | ((ret & 2) >>> 1) ;
    }
    // Now both are bullets

    if (this.parentID == obj.parentID ||  
        this.distanceTo(obj) > Constants.BULLET_RADIUS * 2) return 0;

    // collision
    return 0b11;
  }
}

module.exports = Bullet;
