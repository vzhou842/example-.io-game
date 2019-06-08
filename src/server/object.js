// @flow
class ObjectClass {
  id: string;
  x: number;
  y: number;
  direction: number;
  speed: number;

  constructor(id: string, x: number, y: number, dir: number, speed: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
  }

  update(dt: number) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
  }

  distanceTo(object: ObjectClass) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir: number) {
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

module.exports = ObjectClass;
