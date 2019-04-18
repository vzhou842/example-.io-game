const Constants = require('../shared/constants');
const Player = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.lastUpdateTime = Date.now();
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE / 2;
    const y = Constants.MAP_SIZE / 2;
    this.players[socket.id] = new Player(username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      player.update(dt);
      socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
    });
  }

  createUpdate(player) {
    const nearbyPlayers = Object.values(this.players).filter(p => (
      p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2
    ));
    return {
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
    };
  }
}

module.exports = Game;
