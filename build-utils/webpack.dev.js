const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  // plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    // hot: true,
  },
};
