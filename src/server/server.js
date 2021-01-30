const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT_FIRE, handleInputFire);
  socket.on(Constants.MSG_TYPES.INPUT_DIRECTION, handleInputDir);
  socket.on(Constants.MSG_TYPES.INPUT_MOVE, handleInputMove);
  socket.on(Constants.MSG_TYPES.INPUT_TOGGLE, handleInputToggle);
  socket.on(Constants.MSG_TYPES.UPDATE_CANVAS_SIZE, handleCanvasSize);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

function handleCanvasSize(w, h) {
  game.handleCanvasSize(this, w, h);
}

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInputFire(start) {
  game.handleInputFire(this, start);
}

function handleInputDir(dir) {
  game.handleInputDir(this, dir);
}

function handleInputToggle(tog) {
  game.handleInputToggle(this, tog);
}

function handleInputMove(dir) {
  game.handleInputMove(this, dir);
}

function onDisconnect() {
  game.removePlayer(this);
}
