import aidkit from './assets/aid.svg';
import mfer from './assets/default.png';

const assets = {
  aidkit: { src:aidkit, loaded:false},
  mfer:{ src:mfer, loaded:false}
}

export function downloadAssets() {
  Object.keys(assets).forEach(key => {
    const image = new Image();
    image.onload = () => {
      assets[key]['src'] = image;
      assets[key]['loaded'] = true;
    }
    image.src = assets[key]['src'];
  });
}

export const getAsset = assetName => assets[assetName];

const mfers = {};

export const getmfer = (id) => {

  if (typeof mfers[id] === 'undefined') {
    mfers[id] = {
      loaded: false
    }

    const asset = new Image();
    asset.onload = () => {
      mfers[id]['src'] = asset;
      mfers[id]['loaded'] = true;
    };
    asset.src = `https://outerlumen.com/mfer/mfers/${id}.png`;
    asset.onerror = () => {
      mfers[id] = assets['mfer']; // default mfer
    }
  }
  return mfers[id];
}
