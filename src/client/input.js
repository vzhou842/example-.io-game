// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection } from './networking';
import { updateFire } from './networking';
import { updateMove } from './networking';
import { updateToggle } from './networking';

function onMouseClick(e) {
  updateFire();
}

function onMouseMove(e) {
  handleDir(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function onKeyDown(e) {
  let moveDir = ''
  if (e.code == 'ArrowUp' || e.code == 'KeyW') {
    moveDir = 'up';
  } else if (e.code == 'ArrowDown' || e.code == 'KeyZ') {
    moveDir = 'down';
  } else if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
    moveDir = 'left';
  } else if (e.code == 'ArrowRight' || e.code == 'KeyS') {
    moveDir = 'right';
  } else if (e.code == 'Space') {
    updateFire();
    return;
  } else if (e.code == 'KeyE') {
    updateToggle('e');
  }

  if (moveDir != '') {
    updateMove(moveDir);
  }
}

function handleDir(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}


export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('click', onMouseClick);
  window.addEventListener('keydown', onKeyDown);
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

