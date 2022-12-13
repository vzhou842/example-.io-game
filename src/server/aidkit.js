const shortid = require('shortid');

class AidKit {
  constructor(x, y, hp, t0) {
    this.id = shortid();
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.t0 = t0;
    this.exist = false;
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  update(now) {
    if (now > this.t0) {
      this.exist = true;
    }
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      hp: this.hp,
      exist: this.exist
    };
  }
}

module.exports = AidKit;
