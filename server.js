const express = require('express');

// Setup an Express server
const app = express();
app.use(express.static('public'));
const server = app.listen(process.env.PORT || 3000);

// Setup socket.io
const io = require('socket.io')(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);
});
