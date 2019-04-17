const Player = require('./player');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    setInterval(this.update, 1000 / 60);
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
    for (const playerID in this.players) {
      const player = players[playerID];
    }
  }
}

module.exports = Game;
