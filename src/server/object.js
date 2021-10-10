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

  setPos(pos) {
    let targetX = pos.x;
    let targetY = pos.y;
    let startX = this.x;
    let startY = this.y
    let diffX = targetX - startX;
    let diffY = targetY - startY;
    let duration = 1000;
    
    let intervalId = null;
    let startTime = Date.now();
    intervalId = setInterval(() => {
      let currentTime = Date.now();
      let elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        this.x = targetX;
        this.y = targetY;
        clearInterval(intervalId);
        return;
      }
      this.x = startX + diffX * (elapsedTime / duration);
      this.y = startY + diffY * (elapsedTime / duration);
    }, 1000/60) // 60fps
    // this.x = pos.x;
    // this.y = pos.y;
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
