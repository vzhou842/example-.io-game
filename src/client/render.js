const Constants = require('../shared/constants');

// Setup the canvas and get the graphics context
const canvas = document.getElementById('game-canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

function render() {
  // Clear everything
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player in the center of our screen
  renderCircle(canvas.width / 2, canvas.height / 2, Constants.PLAYER_RADIUS, 'blue');
}

// Renders an circle with the given attributes
function renderCircle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}

export function startRendering() {
  // Render at 60 FPS
  setInterval(render, 1000 / 60);
}
