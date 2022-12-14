const ASSET_NAMES = [
  'aid.svg',
  'default.png'
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];


const mfers = {};

export const getmfer = (id) => {
  if (typeof mfers[id] === 'undefined') {
    mfers[id] = {
      loaded: false
    }

    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${id}`);
      mfers[id]['src'] = asset;
      mfers[id]['loaded'] = true;
    };
    asset.src = `/assets/mfers/${id}.png`;
    asset.onerror = () => {
      mfers[id].src = assets['default.png'];
      mfers[id]['loaded'] = true;
    }
  }

  return mfers[id];
}
