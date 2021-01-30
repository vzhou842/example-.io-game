// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';
import { updateCanvasSize } from './networking';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, MAP_GRID_SIZE, SMAP_SIZE } = Constants;

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
  updateCanvasSize(canvas.width, canvas.height);
//  console.log(canvas.width, canvas.height, scaleRatio);
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

// do nothing in the event handler except canceling the event
canvas.ondragstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
}
 
// do nothing in the event handler except canceling the event
canvas.onselectstart = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
}

let firstRenderUpdate = true;

function render() {

  if (firstRenderUpdate) {
    updateCanvasSize(canvas.width, canvas.height);
    firstRenderUpdate = false;
  }

  const { me, others, mybullets, otherbullets } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;

  const cx = canvas.width / 2 - me.x;
  const cy = canvas.height / 2 - me.y;

  context.strokeRect(cx, cy, MAP_SIZE, MAP_SIZE);

  let startX = cx;
  if (cx < 0) startX = MAP_GRID_SIZE + (~~(-cx / MAP_GRID_SIZE)) * MAP_GRID_SIZE + cx;
  let startY = cy;
  if (cy < 0) startY = MAP_GRID_SIZE + (~~(-cy / MAP_GRID_SIZE)) * MAP_GRID_SIZE + cy;
  let endX = canvas.width;
  let endY = canvas.height;

  if (cx + MAP_SIZE < endX ) endX = cx + MAP_SIZE;
  if (cy + MAP_SIZE < endY ) endY = cy + MAP_SIZE;

  context.beginPath();
  const drawStartX = Math.max(0, cx);
  const drawStartY = Math.max(0, cy);

  for (let i = startX; i <= endX; i += MAP_GRID_SIZE) {
      context.moveTo(i, drawStartY);
      context.lineTo(i, endY);
  }
  for (let i = startY; i <= endY; i += MAP_GRID_SIZE) {
      context.moveTo(drawStartX, i);
      context.lineTo(endX, i);
  }
/*
  for (let i = MAP_GRID_SIZE; i < MAP_SIZE; i += MAP_GRID_SIZE) {
      context.moveTo(cx, i+cy);
      context.lineTo(MAP_SIZE+cx, i+cy);
      context.moveTo(i+cx, cy);
      context.lineTo(i+cx, MAP_SIZE+cy);
  }
*/
  // set line color
  context.strokeStyle = '#505050';
  context.stroke();
  

  // Draw all bullets
  mybullets.forEach(renderBullet.bind(null, me));
  otherbullets.forEach(renderBullet2.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  renderSmallMap(me, others);
}

function renderSmallMap(me, others) {

  const canvasX = canvas.width - 110; 
  const canvasY = canvas.height - 110; 
  context.fillStyle = 'black';
  context.globalAlpha = 0.4;
  context.fillRect(
    canvasX,
    canvasY,
    SMAP_SIZE+4,
    SMAP_SIZE+4,
  );
  context.globalAlpha = 1;

  context.fillStyle = 'pink';
  const {x, y, d} = me;
  context.fillRect(
    canvasX + x * 100 / MAP_SIZE,
    canvasY + y * 100 / MAP_SIZE,
    4,
    4,
  );

  context.fillStyle = 'white';
//  console.log(others.length);
//  var l = 0;

  others.forEach( p => {
    const {x, y, d} = p;
    context.fillRect(
      canvasX + x * 100 / MAP_SIZE,
      canvasY + y * 100 / MAP_SIZE,
      2,
      2,
    );
//    l++;
  });
//  console.log("new log " + l);
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
/*
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
//  backgroundGradient.addColorStop(0, 'black');
//  backgroundGradient.addColorStop(1, 'gray');
  backgroundGradient.addColorStop(0, 'DeepSkyBlue');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
*/
  context.fillStyle = "#A0A0A0";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction,username } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  if (canvasX < -PLAYER_RADIUS || canvasY < -PLAYER_RADIUS || canvasX > canvas.width || canvasY > canvas.height) return;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    me == player? getAsset('ship-blue.svg') : getAsset('ship-red.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();


  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );

  // write the player's name
  context.font = "10px Arial";
  context.fillText(username,canvasX - PLAYER_RADIUS,canvasY + PLAYER_RADIUS + 20);

  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );
  context.fillText(player.hp, canvasX - PLAYER_RADIUS,canvasY + PLAYER_RADIUS + 2);

}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  if (canvasX < -PLAYER_RADIUS || canvasY < -PLAYER_RADIUS || canvasX > canvas.width || canvasY > canvas.height) return;

  context.drawImage(
    getAsset('bullet-blue.svg'),
    canvasX - BULLET_RADIUS,
    canvasY - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderBullet2(me, bullet) {
  const { x, y } = bullet;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  if (canvasX < -PLAYER_RADIUS || canvasY < -PLAYER_RADIUS || canvasX > canvas.width || canvasY > canvas.height) return;

  context.drawImage(
    getAsset('bullet-red.svg'),
    canvasX - BULLET_RADIUS,
    canvasY - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
