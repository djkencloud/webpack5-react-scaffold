const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "..", "./src/app/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            configFile: path.resolve(__dirname, "..", "babel.config.json"),
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset",
        generator: {
          filename: "images/[name][hash][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // Images smaller than 8 KB
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".*", ".js", ".jsx"],
  },
  output: {
    path: path.resolve(__dirname, "..", "./dist"),
    filename: "main.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "./src/static/data", to: "data" },
        { from: "./src/static/js", to: "js" },
        /* { from: "./src/static/images", to: "images" },
         { from: './src/static/video', to: 'video' }, */
      ],
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "..", "./src/app/index.html"),
      inject: true,
      filename: "index.html",
      cache: false,
    }),
    new ESLintPlugin(),
  ],
};
