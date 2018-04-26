const path = require("path");
const webpack = require("webpack");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

module.exports = {
  entry: "./index.js",
  mode: "production",
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          plugins: ["lodash"],
          presets: [["env", { modules: false, targets: { node: 6 } }]]
        }
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
