const Constants = require('../shared/constants');
const Player = require('./player');
const Robot = require('./bots');
const CollisionMap = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);

    CollisionMap.init();

//    for (let i = 0; i < 500; i++) // would not start with collision
//    for (let i = 0; i < 300; i++) // would not start with collision
//    for (let i = 0; i < 200; i++) // can start after 1 min, very slow, unable to control at all
//    for (let i = 0; i < 150; i++) // can start after half min, very lagging, control is very lagging and unable to play
//    for (let i = 0; i < 100; i++) // normal performance on puma01
//    for (let i = 0; i < 250; i++) // lagging even without collision detection. // need a better way to handle other parts as well
    for (let i = 0; i < 100; i++) // normal performance on puma01
      this.addBot(new Robot(i));
  }

  addBotWithTimer(bot) {
    // check if bot is passed in
    // if this.addBotWithTimer.arguments.length == 1
    // bot = bot || "other value? null?"
    // if (bot === undefined)

    this.addBot(bot);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.1 + Math.random() * 0.8);
    const y = Constants.MAP_SIZE * (0.1 + Math.random() * 0.8);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  addBot(bot) {
    this.addPlayer(bot, bot.username);
    bot.player = this.players[bot.id];
    this.players[bot.id].isBot = true;
    this.players[bot.id].autofire = true;
//    this.players[bot.id].fireCooldown *= 4;
  }

  removePlayer(socket) {
    this.players[socket.id].remove();
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleCanvasSize(socket, w, h) {
    if (this.players[socket.id]) {
      this.players[socket.id].handleCanvasSize(w, h);
    }
  }

  handleInputDir(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleInputMove(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setMoveDirection(dir);
    }
  }

  handleInputToggle(socket, tog) {
    if (this.players[socket.id]) {
      this.players[socket.id].toggle(tog);
    }
  }

  handleInputFire(socket, start) {
    if (this.players[socket.id]) {
      this.players[socket.id].openFire(start);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
        bullet.remove();
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, give players score for hitting bullets
    CollisionMap.applyCollisions(this.players, this.bullets);

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);

        if (player.isBot) {
	  setTimeout(() => { this.addBotWithTimer(socket) }, 5000);
        }
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard(me) {
    const playerlist = Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score);
//      .slice(0, 5)
//      .map(p => ({ username: p.username, score: Math.round(p.score) }));

   let leaderboard = [];
   let place = 0;
   let num = 0;
   let meinlist = false;

   while (num < 6 && place < playerlist.length) {
     let p = playerlist[place++];
     if (num < 5 || meinlist) {
       leaderboard.push({place: place, username: p.username, score: Math.round(p.score) });
       if (me.id == p.id) meinlist = true;
       num ++;
     } else if (me.id == p.id) {
       leaderboard.push({place: place, username: p.username, score: Math.round(p.score) });
       num ++;
     }
   }

   return leaderboard;
  }

  createUpdate(player) {
    const nearbyPlayers = Object.values(this.players).filter(
                         // Just filter out the player itself, we need all players inf to make the map
      p => p !== player, //  && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const otherNearbyBullets = this.bullets.filter(
 //     b => (b.distanceTo(player) <= Constants.MAP_SIZE / 2) && (b.parentID != player.id),
      b => (b.parentID != player.id) && (Math.abs(b.x - player.x) < player.canvasWidth) && (Math.abs(b.y - player.y) < player.canvasHeight),
    );
    const myNearbyBullets = this.bullets.filter(
      b => (b.parentID == player.id) && (Math.abs(b.x - player.x) < player.canvasWidth) && (Math.abs(b.y - player.y) < player.canvasHeight),
    );

    const leaderboard = this.getLeaderboard(player);

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      mybullets: myNearbyBullets.map(b => b.serializeForUpdate()),
      otherbullets: otherNearbyBullets.map(b => b.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
