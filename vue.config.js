//打包配置文件
module.exports = {
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  devServer: {
    port: 8080,
    proxy:{
      '/api': {
        target: 'http://localhost:5555',
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    client:{
      overlay: false
    },
  }
};