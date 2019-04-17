import { downloadAssets, getAsset } from './assets';

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
  renderShip(canvas.width / 2, canvas.height / 2);
}

// Renders a ship at the given coordinates
function renderShip(x, y) {
  const r = Constants.PLAYER_RADIUS;
  context.drawImage(getAsset('ship.svg'), x - r, y - r, r * 2, r * 2);
}

export default function startRendering() {
  return downloadAssets().then(() => {
    // Render at 60 FPS
    console.log('Downloaded all assets.');
    setInterval(render, 1000 / 60);
  });
}
