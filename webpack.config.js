module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist/assets',
    publicPath: '/assets/',
    filename: 'app.bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist'
  }
};
