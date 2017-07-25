var path = require("path");
module.exports = {
  entry: {
    app: ['./src/main.js']
  },
  output: {
    path: path.resolve(__dirname  + path.sep +"dist"),
    publicPath: "/assets/",
    filename: "bundle.js"
  },
  //My host is windows so inotify does not happen over NFS, so we need to poll for file changes
  watchOptions: {
    poll: true
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
};