const express = require('express');

// Setup an Express server
const app = express();
app.use(express.static('dist'));
app.use(express.static('public'));

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = require('socket.io')(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);
});
