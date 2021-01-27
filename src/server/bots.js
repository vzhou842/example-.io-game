const Constants = require('../shared/constants');
const Player = require('./player');

class Robot {
  constructor(idx) {
    // this.id = "bot" + (new Date()).getTime();
    const names = [ "Peter", "Igor", "Ivan", "Fighter", "Flyer", "YouNameMe", "Scim", "Cheese", "Red", "Mr.C", "Mr.A" ];
    this.id = "bot" + idx;
    this.username = names[idx];
    this.ms = (new Date()).getTime();
    this.player = null;
    this.move = "right";
    this.direction = -3.1415926;
    this.directionTime = 0;
    this.clockwise = true;
    if (Math.random() < 0.5) this.clockwise = !this.clockwise;
  }

  emit(event, context) {
    const d = (new Date()).getTime();

     if (d - this.directionTime > 100) {
         if (Math.random() < 0.01) this.clockwise = !this.clockwise;
         if (this.clockwise) {
             this.direction -= 3.1415926*2 / 100; // make a round in 10 seconds
             if (this.direction < -3.1415926) this.direction = 3.1415926;
         } else {
             this.direction += 3.1415926*2 / 100; // make a round in 10 seconds
             if (this.direction > 3.1415926) this.direction = -3.1415926;
         }
         this.player.direction = this.direction;
         this.directionTime = d;
     }

    if (event == Constants.MSG_TYPES.GAME_UPDATE && 
        // at least one sec
        (d - this.ms) >  1000) {

       this.ms = d;

      if (Math.random() < 0.1) {
	const r = Math.random();
        if (r < 0.2) {
          this.move = "";
        } else if (r < 0.4) {
          this.move = "right";
        } else if (r < 0.6) {
          this.move = "left";
        } else if (r < 0.8) {
          this.move = "up";
        } else {
          this.move = "down";
        }
      }
    }

    // tell game this bot wants to move
    this.player.move = this.move
  }
}

module.exports = Robot;
