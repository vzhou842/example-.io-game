const Constants = require('../shared/constants');
const Player = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(username);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  update() {
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      socket.emit(Constants.MSG_TYPES.GAME_UPDATE, {});
    });
  }
}

module.exports = Game;
