const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/dandanapi': {
        target: 'https://api.dandanplay.net/',//后台接口
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。
        pathRewrite: {  //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
          '^/dandanapi': ''
        }
      },
      '/api': {
        target: 'http://localhost:8081/',//后台接口
        ws: false, //如果要代理websockets
        secure: false, // 使用的是http协议则设置为false，https协议则设置为true
        changeOrigin: true, //将选项changeOrigin设置true为基于名称的虚拟托管站点。

      }
    }
  }
})
