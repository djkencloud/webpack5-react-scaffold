const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const imageMinOpts = {
  mozjpeg: {
    quality: 65,
  },
  optipng: {
    enabled: false,
  },
  pngquant: {
    quality: '65-90',
    speed: 4,
  },
  gifsicle: {
    interlaced: false,
    optimizationLevel: 3,
  },
};

module.exports = {
  entry: path.resolve(__dirname, '..', './src/app/index.js'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, '..', 'babel.config.json'),
          },
        },
      },
      {
        test: /\.(gif|png|jpg|jpeg|svg)$/i,
        include: /images/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: false,
              name: './images/[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: { bypassOnDebug: false, ...imageMinOpts },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, '..', './dist'),
    filename: 'main.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/static/data', to: 'data' },
        { from: './src/static/js', to: 'js' },
      ],
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, '..', './src/app/index.html'),
      inject: true,
      filename: 'index.html',
      cache: false,
    }),
    new ImageminWebpackPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      ...imageMinOpts,
    }),
    new ESLintPlugin(),
  ],
};
