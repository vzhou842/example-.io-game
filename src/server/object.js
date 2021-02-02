const CollisionMap = require('./collisions');

class Object {
  constructor(id, x, y, dir, speed, radius) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
    this.radius = radius;

    this.mapX = -1;
    this.mapY = -1;
    this.mapPos = -1;

    this.type = 0;

    CollisionMap.addObject(this);
  }

  getType() {
    return this.type;
  }

  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);

    CollisionMap.updateObject(this);
  }

  collision(obj) {
    // do nothing
    return 0;
  }

  remove() {
    CollisionMap.removeObject(this);
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    this.direction = dir;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
