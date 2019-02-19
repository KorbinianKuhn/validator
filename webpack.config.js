const path = require('path');

const config = {
  entry: {
    'build/validator': './src/validator/default/public_api.ts',
    'build/express': './src/validator/express/public_api.ts',
    'build/mongoose': './src/validator/mongoose/public_api.ts',
    'build/angular': './src/validator/angular/public_api.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  // devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/typescript',
            [
              '@babel/env',
              {
                modules: false,
                targets: {
                  node: 8
                }
              }
            ]
          ]
        }
      },
      {
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

module.exports = config;
