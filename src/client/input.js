import { updateDirection } from './networking';

function onMouseMove(e) {
  const dir = Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
  updateDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
}
