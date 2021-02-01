// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from './networking';
import { updateFire } from './networking';
import { updateMove } from './networking';
import { updateToggle } from './networking';

let lastFireTime=(new Date()).getTime();
let keydownMap = {};

function handleFireInput() {
  let curTime = (new Date()).getTime();
  if (curTime - lastFireTime > 500) {
    lastFireTime = curTime;
    updateFire('once');
  }
}

function onMouseClick(e) {
  handleFireInput();
}

function onMouseMove(e) {
  handleDir(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function onKeyDown(e) {
  const keyCode = e.code;

// console.log(keydownMap);

  if (keyCode == 'ArrowUp' || keyCode == 'KeyW' || keyCode == 'ArrowDown' || keyCode == 'KeyZ' ||
      keyCode == 'ArrowLeft' || keyCode == 'KeyA' || keyCode == 'ArrowRight' || keyCode == 'KeyS' ||
      keyCode == 'Space') {

    if (keydownMap[keyCode]) return;
    keydownMap[keyCode] = true;

    if (keyCode == 'Space') {
      updateFire('on');
    } else {
      handleKeyChangeMove();
    }

    e.preventDefault();
  }
}

function onKeyUp(e) {
  const keyCode = e.code;

  if (keyCode == 'KeyE') {
    updateToggle('e');
    e.preventDefault();
    return;
  }

  if (keyCode == 'ArrowUp' || keyCode == 'KeyW' || keyCode == 'ArrowDown' || keyCode == 'KeyZ' ||
      keyCode == 'ArrowLeft' || keyCode == 'KeyA' || keyCode == 'ArrowRight' || keyCode == 'KeyS' ||
      keyCode == 'Space') {

    if (!keydownMap[keyCode]) return;
    keydownMap[keyCode] = false;
    if (keyCode == 'Space') {
      updateFire('off');
    } else {
      handleKeyChangeMove();
    }
    e.preventDefault();
  }
}

function handleKeyChangeMove() {
  let dir = 0;
  let u = keydownMap['ArrowUp'] || keydownMap['KeyW'];
  let l = keydownMap['ArrowLeft'] || keydownMap['KeyA'];
  let r = keydownMap['ArrowRight'] || keydownMap['KeyS'];
  let d = keydownMap['ArrowDown'] || keydownMap['KeyZ'];

  if (u && d) {
    if (l && r) dir = 0;
    else if (l) dir = 5; // left
    else if (r) dir = 1; // right
  } else if (l && r) {
    if (u) dir = 3; // up;
    else if (d) dir = 7; // down;
  } else if (l) {
    if (u) dir = 4; // up left
    else if (d) dir = 6; // down left
    else dir = 5; // left
  } else if (r) {
    if (u) dir = 2; // up right
    else if (d) dir = 8; // down right
    else dir = 1; // right
  } else if (u) dir = 3; // up
  else if (d) dir = 7; // down;

  updateMove(dir);
}

function handleDir(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

function onLostFocus() {
  if (keydownMap['Space']) updateFire('off');
  if (keydownMap['ArrowUp'] || keydownMap['KeyW'] ||
    keydownMap['ArrowLeft'] || keydownMap['KeyA'] ||
    keydownMap['ArrowRight'] || keydownMap['KeyS'] ||
    keydownMap['ArrowDown'] || keydownMap['KeyZ']) {

    updateMove(0);
  }
  keydownMap={};
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onLostFocus);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('click', onMouseClick);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeventListener('blur', onLostFocus);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
}

// Test URL: https://javascript.info/article/keyboard-events/keyboard-dump/
// keydown event decoding
//  let text = e.type +
//    ' key=' + e.key +
//    ' code=' + e.code +
//    (e.shiftKey ? ' shiftKey' : '') +
//    (e.ctrlKey ? ' ctrlKey' : '') +
//    (e.altKey ? ' altKey' : '') +
//    (e.metaKey ? ' metaKey' : '') +
//    (e.repeat ? ' (repeat)' : '')
// keydown key=ArrowUp code=ArrowUp
// keyup key=ArrowUp code=ArrowUp
// keydown key=ArrowDown code=ArrowDown
// keyup key=ArrowDown code=ArrowDown
// keydown key=Backspace code=Backspace
// keyup key=Backspace code=Backspace
// keydown key=e code=KeyE
// keydown key=e code=KeyE (repeat)
// keydown key=Shift code=ShiftLeft shiftKey
// keydown key=E code=KeyE shiftKey
// keydown key=E code=KeyE shiftKey
// keydown key=  code=Space

