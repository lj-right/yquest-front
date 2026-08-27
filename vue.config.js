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
      },
      // WebSocket 通知通道代理到后端
      '/chicken': {
        target: 'http://localhost:5555',
        ws: true,
        changeOrigin: true
      }
    },
    client:{
      overlay: false
    },
  }
};