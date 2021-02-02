const Constants = require('../shared/constants');
const Player = require('./player');

class Robot {
  constructor(idx) {
    // this.id = "bot" + (new Date()).getTime();
    const names = [ "Peter", "Igor", "Ivan", "Fighter",    "Flyer", "Rose",      "Scim", "Cheese", "Red", "Greenbean", 
                    "Becky", "Abby", "Addin", "Mr.Cheese", "Ali",   "Pretty",    "HotDog", "Pizza", "Sandwich", "Ele",
                    "Fish", "Fast", "Super", "Ada",        "Macy",   "Mope",     "Snake",   "Dog",   "Puma", "Checken",
                    "Deer", "Ship", "Loud", "Me!!!",       "PickMe", "Shooting", "Flagship", "Beer", "Glare", "Ocean", 
                    "Sky", "Runner", "Winer", "Shopper",   "Looking", "Better",  "High",     "Rachel", "Rain", "Beauty", "Iam51",];
    this.id = "bot" + idx;
    if (idx < 50) this.username = names[idx];
           else   this.username = this.id;
    this.ms = (new Date()).getTime();
    this.player = null;
    this.move = 0;
    this.direction = -3.1415926;
    this.directionTime = 0;
    this.clockwise = true;
    if (Math.random() < 0.5) this.clockwise = !this.clockwise;
    this.canvasWidth = 1;
    this.canvasHeight = 1;
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

      if (this.player.x == 0 || this.player.x == Constants.MAP_SIZE || this.player.y == 0 || this.player.y == Constants.MAP_SZIE) {
        if (Math.random() < 0.4) {
          if (this.player.x == 0) {
            this.move = 1; // right
          } else if (this.player.x == Constants.MAP_SIZE) {
            this.move = 5; // left
          } else if (this.player.y == 0) {
            this.move = 7; // down
          } else {
            this.move = 3; // up
          } 
        }
      } else if (Math.random() < 0.1) {
	this.move = Math.floor(Math.random() * 10);
        if (this.move > 8) this.move = 0; // range: 0 - 8
      }
    }

    // tell game this bot wants to move
    this.player.move = this.move

    // 20% of bots not fire
    if (Math.random() < 0.2) this.player.toggle('e');
  }
}

module.exports = Robot;
