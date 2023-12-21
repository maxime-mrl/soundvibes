const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = 
    {
        mode: 'production',
        entry: './index.js',
        output: {
            path: path.join(__dirname, "..", 'build'),
            publicPath: '/',
            filename: 'server.js',
        },
        target: 'node',
        plugins: [
          new Dotenv(), // transform any .env usage to hard coded in the code
          new CopyWebpackPlugin({ // copy songs folder because it's needed for frontend
              patterns: [
                  { from: 'songs', to: "songs" }
              ]
          })
        ],
        optimization: {
          minimizer: [new TerserPlugin({
            extractComments: false,
          })],
        },
    };