const ASSET_NAMES = [
  'ship.svg',
];

const assets = {};

export function downloadAssets() {
  return Promise.all(ASSET_NAMES.map(downloadAsset));
}

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

export const getAsset = assetName => assets[assetName];
