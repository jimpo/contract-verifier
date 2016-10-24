module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist/assets',
    publicPath: '/assets/',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.json$/,
        loaders: ['json']
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less']
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist'
  }
};
