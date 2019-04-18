import { connect, play } from './networking';
import { startRendering, stopRendering } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    startCapturingInput();
    startRendering();
  };
}).catch(console.error);

function onGameOver() {
  alert('You died!');
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
}
