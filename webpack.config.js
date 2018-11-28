var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: nodeModules,
  output: {
    path: path.join(__dirname, 'generated'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: /(elm-stuff|node_modules)/,
        use: {
          loader: 'elm-webpack-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  }
};
