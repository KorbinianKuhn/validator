const path = require('path');

module.exports = {
  entry: './index.js',
  mode: 'production',
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          presets: [
            ['@babel/preset-env', { modules: false, targets: { node: 8 } }]
          ]
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
