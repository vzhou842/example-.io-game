// @flow
const Constants = require('../shared/constants');
const Player = require('./player');
const Bullet = require('./bullet');
const applyCollisions = require('./collisions');

const MAX_GAME_SIZE = 24;

class Game {
  sockets: { [string]: Object };
  players: { [string]: Player };
  bullets: Array<Bullet>;
  lastUpdateTime: number;
  shouldSendUpdate: bool;

  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  // Returns true on success, false on failure.
  addPlayer(socket: Object, username: string) {
    if (Object.keys(this.sockets).length >= MAX_GAME_SIZE) {
      return false;
    }

    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);

    return true;
  }

  removePlayer(socket: Object) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket: Object, dir: number) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Debug logging
    if (Math.random() < 1 / 108000) {
      console.log('update() invoked', now);
      console.log(
        `${Object.keys(this.sockets).length} sockets, ${
          Object.keys(this.players).length
        } players, ${this.bullets.length} bullets`
      );
    }

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet instanceof Bullet) {
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions((Object.values(this.players): any), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return (Object.values(this.players): any)
      .sort((p1: Player, p2: Player) => p2.score - p1.score)
      .slice(0, 5)
      .map((p: Player) => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player: Player, leaderboard: Object) {
    const nearbyPlayers = (Object.values(this.players): any).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: (nearbyBullets.map(b => b.serializeForUpdate()): Array<Object>),
      leaderboard,
    };
  }
}

module.exports = Game;
