import { connect, play } from './networking';
import { startRendering } from './render';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

Promise.all([
  connect(),
  startRendering(),
]).then(() => {
  playMenu.classList.remove('hidden');
  playButton.onclick = () => {
    play();
    playMenu.classList.add('hidden');
  };
}).catch(console.error);
