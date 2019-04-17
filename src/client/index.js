import { connect } from './networking';
import { startRendering } from './render';

import './css/main.css';

Promise.all([
  connect(),
  startRendering(),
]).catch(console.error);
