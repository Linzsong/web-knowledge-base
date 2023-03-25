// webpack 是基于nodeJS，需要遵循commonJS
// webpack 配置就是一个对象
const path = require("path")
module.exports = {
  // development 生产模式   production  开发模式
  mode: 'development',

  // 上下文 项目打包的相对路径,必须填写绝对路径
  context: process.cwd(),    // 默认值 process.cwd()

  // 入口 执行构建入口 项目入口（支持三种数据类型： String  Array Object）
  // 单入口 
  entry: "./src/index.js",
  // 数组 多 和 一
  // entry: ["./src/index.js", './src/other.js'],

  // 对象可以多入口打包；有多入口，就会有多出口，不能指定filename
  // 对象 多对多映射
  // entry: {
  //   index: "./src/index.js",
  //   other: "./src/other.js"
  // },
  // 出口
  output: {
    // 构建的文件资源放哪里，必须是绝对路径
    path: path.resolve(__dirname, "./dist"),
    // 构建的文件资源名称
    // filename: "main.js",
    // 多出口使用占位符指定名称
    filename: "[name].js",
  }
}