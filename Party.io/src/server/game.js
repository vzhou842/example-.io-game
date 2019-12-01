const Constants = require('../shared/constants');
const Player = require('./player');
const Collisions = require('./collisions');
const Walls = require('./object').staticObject;

class Game {

  constructor() {
    this.sockets = {};
    this.players = {};
    this.epic = {};
    this.walls = {};
    
    this.walls[0] = new Walls(0,0,100,100);

      
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.playerNum = 0;
      
      
    setInterval(this.update.bind(this), 1000 / 60);
  }
    



  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      
    if (this.playerNum == 0) {
        this.players[socket.id] = new Player(socket.id, username, x, y, true);
    } else {
        this.players[socket.id] = new Player(socket.id, username, x, y, false);
    }
    this.playerNum++;
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
      const player = this.players[playerID];
      const newBullet = player.update(dt);
    });
      
    // Apply collisions, switch tag values
    Collisions.playerCollision(Object.values(this.players));

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
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
      
    // OPTIMISE THIS - MAKE IT LIKE THE ONE ABOVE  
    const nearbyWalls = Object.values(this.walls);
      
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      walls: (new Walls(100,100,100,100)).serializeForUpdate(),
      leaderboard,
    };
  }
}

module.exports = Game;
