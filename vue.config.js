// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    port: 8089
  },
  css: {
    loaderOptions: {
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: `@import "~@/assets/style/BaseVariable.sass";
        @import "~@/assets/style/BaseStyle.sass";`
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
  }
}
