import io from 'socket.io-client';

const socket = io(`ws://${window.location.host}`);

socket.on('connect', () => {
  console.log('Connected to server!');
});
