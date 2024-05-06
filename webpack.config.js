const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "proton.min.js",
    path: path.resolve(__dirname, "build"),
  },
  target: "node",
  externalsPresets: { node: true },
  externals: [/node_modules/],
};
