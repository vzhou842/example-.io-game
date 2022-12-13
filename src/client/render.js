// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset, getmfer } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

let animationFrameRequestId;

function render() {
  const { me, others, bullets, aidkits } = getCurrentState();

  if (me) {
    // Draw background
    renderBackground(me.x, me.y);

    // Draw boundaries
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

    // Draw all bullets
    bullets.forEach(renderBullet.bind(null, me));

    // Draw all players
    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));

    // Draw first aid kits
    aidkits.forEach(renderAidKit.bind(null, me));
    // aidkits.forEach(aidkit => {
    //   //console.log(aidkit)
    //   renderAid(aidkit)
    // });
  }

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, '#F3B87A');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, tokenId, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.lineWidth = 2;

  context.translate(canvasX, canvasY);
  context.rotate(direction - 0.5*Math.PI);
  
  context.beginPath();
  context.arc(0, 0, PLAYER_RADIUS, 0, 2 * Math.PI);
  context.closePath();
  context.stroke();
  context.clip();
    
  const img = getmfer(tokenId);
  if (img['loaded']) {
    context.drawImage(
      img['src'],
      -PLAYER_RADIUS,
      -PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
    );
  }
  
  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;

  context.fillStyle = '#FFF';

  context.beginPath();
  context.arc(
    canvas.width / 2 + x - me.x,
    canvas.height / 2 + y - me.y,
    BULLET_RADIUS, 
    0, 2 * Math.PI
  );
  context.closePath();
  context.stroke();
  context.fill();

  // context.drawImage(
  //   getAsset('bullet.svg'),
  //   canvas.width / 2 + x - me.x - BULLET_RADIUS,
  //   canvas.height / 2 + y - me.y - BULLET_RADIUS,
  //   BULLET_RADIUS*2,
  //   BULLET_RADIUS*2,
  // );
}

function renderAidKit(me,aidkit) {
  
  const { x, y, hp } = aidkit;
  
  context.drawImage(
    getAsset('aid.svg'),
    canvas.width / 2 + x - me.x,
    canvas.height / 2 + y - me.y,
    Constants.AID_KIT_RADIUS,
    Constants.AID_KIT_RADIUS
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}
