const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    game: './src/client/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
