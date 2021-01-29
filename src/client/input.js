// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from './networking';
import { updateFire } from './networking';
import { updateMove } from './networking';
import { updateToggle } from './networking';

let lastFireTime=(new Date()).getTime();
let lastKeydown = '';
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
  const code = translateKey(e.code);
  
  if (lastKeydown != code)
  	handleKeyDown(code);
//  if ((lastKeydown != code) && (lastKeydown != '')) handleKeyUp(lastKeydown);
  lastKeydown = code;
}

function onKeyUp(e) {
  const code = translateKey(e.code);

//  if ((lastKeydown != code) && (lastKeydown != '')) handleKeyUp(lastKeydown);
  handleKeyUp(code);
  lastKeydown = '';
}

function handleKeyDown(keyCode) {
  if (keyCode == 'up' || keyCode == 'down' || keyCode == 'left' || keyCode == 'right') {
    updateMove(keyCode);
    return;
  }
  if (keyCode == 'fire') {
    updateFire('on');
  }
  if (keyCode == 'e') {
    updateToggle(keyCode);
  }
}

function handleKeyUp(keyCode) {
  if (keyCode == 'up' || keyCode == 'down' || keyCode == 'left' || keyCode == 'right') {
    updateMove('');
    return;
  }
  if (keyCode == 'fire') {
    updateFire('off');
  }
}

function translateKey(keyCode) {
  if (keyCode == 'ArrowUp' || keyCode == 'KeyW') {
    return 'up';
  } else if (keyCode == 'ArrowDown' || keyCode == 'KeyZ') {
    return 'down';
  } else if (keyCode == 'ArrowLeft' || keyCode == 'KeyA') {
    return 'left';
  } else if (keyCode == 'ArrowRight' || keyCode == 'KeyS') {
    return 'right';
  } else if (keyCode == 'Space') {
    return 'fire';
  } else if (keyCode == 'KeyE') {
    return 'e'
  }
  return keyCode;
}

function handleDir(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}


export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('click', onMouseClick);
  window.removeEventListener('keydown', onKeyDown);
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

