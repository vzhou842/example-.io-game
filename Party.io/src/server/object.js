class Object {
  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = dir;
    this.speed = speed;
  }

  update(dt) {
    this.x += dt * this.speed * Math.sin(this.direction);
    this.y -= dt * this.speed * Math.cos(this.direction);
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

class staticObject {
    constructor(x,y,length,height) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.height = height;
    }
    
    // Object being one of them round tings
    distanceTo(object) {
        const dx = Math.min(Math.abs(object.x-this.x),Math.abs((object.x-(this.x+this.length))));
        const dy = Math.min(Math.abs(object.y-this.y),Math.abs((object.y-(this.y+this.height))));
        
        return (Math.sqrt(dx * dx + dy * dy));
    }
    
  serializeForUpdate() {
    return {
      x: this.x,
      y: this.y,
      height: this.height,
      length: this.length,
    };
}
}

module.exports = {Object,staticObject};
