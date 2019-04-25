// @flow
// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking
import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = (onGameOver: Function) => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on(Constants.MSG_TYPES.GAME_FULL, () => {
      document.getElementById('game-full-modal').classList.remove('hidden');
      document.getElementById('retry-button').onclick = () => {
        window.location.reload();
      };
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      (document.getElementById('disconnect-modal'): any).classList.remove('hidden');
      (document.getElementById('reconnect-button'): any).onclick = () => {
        window.location.reload();
      };
    });
  })
);

export const play = (username: string) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = throttle(20, dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
});
