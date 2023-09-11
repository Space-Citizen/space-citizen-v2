const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  devServer: {
    historyApiFallback: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].bundle.js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          filter: (resourcePath) => resourcePath.indexOf("index.html") === -1,
        },
      ],
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: "index.html",
    }),
  ],
};
