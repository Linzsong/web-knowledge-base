

##  1.webpack介绍

webpack 是一个用于现代JavaScript应用程序的静态模块打包工具，当webpack处理应用程序时，它会在内部构建一个依赖图(dependency graph),此依赖图对应映射到项目所需的每个模块，并生成一个或多个bundle；

> Webpack是⼀个打包模块化JavaScript的⼯具，它会从⼊⼝模块出发，识别出源码中的模块化导⼊语句，递归地找出⼊⼝⽂件的所有依赖，将⼊口和其所有的依赖打包到⼀个单独的⽂件中。

大白话：把src目录的入口文件处理成浏览器可以执行的文件，输出到指定目录。

### 1.1 安装

```bash
npm init -y
npm install webpack webpack-cli --save-dev
```

### 1.2 入口(entry)

- 入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图(dependency graph)的开始。进入入口起点后，webpack会找出有哪些模块和库是入口起点（直接和间接）依赖的;
- 认值是`/src/index.js`,但你可以通过在`webpack configuration`中配置`entry`属性，来指定一个（或多个）不同的入口起点;

```js
// webpack.config.js
const path require('path');
module.exports = {
    entry:'./src/index.js',
}
```

**entry参数类型**

- 字符串
- 数组（多入口，打包成一个）
- 对象（多入口打包，也有对应的多出口--映射，不需要指定filename）（多入口一般对应的filename为chunkhash）

### 1.3 输出（output）

- `output` 属性告诉webpack在里输出它所创建的 bundle ,以及如何命名这些文件；
- 主要输出文件的默认值是 `/dist/main.js` ,其他生成文件默认放置在 `./dist` 文件夹中；

```js
// webpack.config.js
const path require('path');
module.exports = {
    entry:'./src/index.js',
 +  output: {
 +      path:path.resolve(dirname,'dist'),
 +      filename: 'main.js'
 +  }
}
```

### 1.4 loader

- webpack只能理解JavaScript和JSON文件；
- loader让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块供应用程序使用，以及被添加到依赖图中;

```js
// webpack.config.js
const path require('path');
module.exports = {
    entry:'./src/index.js',
       output: {
          path:path.resolve(dirname,'dist'),
          filename: 'main.js'
      },
 +    module: {
 +        rules: [ {test: /\/.txt$/, use: 'raw-loader'} ]   
 +    }
}
```

### 1.5 plugins  插件

- loader用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量等；

举个例子

 ```js
  // webpack.config.js
  const path require('path');


const HtmlWebpackPlugin require('html-webpack-plugin');
module.exports = {
  entry:'./src/index.js',

 output: {
    path:path.resolve(dirname,'dist'),
    filename: 'main.js'
  },

  module: {
    rules: [ {test: /\/.txt$/, use: 'raw-loader'} ]   
  },

+ plugins: [
+   new HtmlWebpackPlugin({template: './src/index.html'})  
+ ]
}
  
 
 ```



### 1.6 -D 和 -S的区别

- 在开发环境的 package 时，使用 `npm install --save-dev `, 既  `-D `;

- package 要打包到生产环境 bundle 中时，使用 npm install --save, 即 `-S`;

### 1.7 output 和 devServer 中path和publicPath的区别？

|类别|配置名称|描述|
|:----|:----|:----|
|output|path|指定输出到硬盘上的目录|
|devServer|static.directory|用于配置提供额外静态文件内容的目录，如`static` 就会映射到`127.0.0:8080/`的根目录上|
|output|publicPath|打包生成的index.html文件里面引用资源的前缀|
|devServer|publicPath|表示的是打包生成的静态文件所在的位置（若是devServer里面的oublicPath没有设置，则会认为是output里面设置的oublicPath的值)|

publicPath 对比总结：
- `publicPath`可以看作是`devServer`对生成目录`dist`设置的虚拟目录，`devServer`首先从`devServer.publicPath`中取值，如果它没有设置，就取`output,publicPath`的值作为虚拟目录，如果它也没有设置，就取默认值`/`;
- `output.publicPath`不仅可以影响虚拟目录的取值，也影响利用`html-webpack-plugin`插件生成的`index.html`中引用的js、css、img等资源的引用路径。会自动在资源路径前面追加设`output.publicPath`;
- 一般情况下都要保证`devServer`中的`publicPath`与`output.publicPath`保持一致

----------
最后再最新的webpack5.75中，devServer中的publicPath已经不存在，而在devServer.static中，其含义也发生了改变。

### 1.8 环境变量配置（mode）

两种场景使用的环境变量：
- 在模块内使用的变量(process.env.NODE_ENV);
- 在node环境中使用的变量(webpack.config.js);

变量设置：
1. 命令行配置
   - webpack执行时，mode默认值是production，它模块内可以独到；
   - 可以通过 --mode=development来修改mode值
   - 可以通过--env=development传参，传给webpack配置文件中导出的函数参数env;
   - 可以通过 cross-env NODE_ENV=development 设置值，兼容各自系统环境
```js
// webpack.config.js
module.exports = (env) => {
  console.log(env)    // --env=development传入
  retrun {
    //...
  }
}
```

> mode优先级：webpack.config.js 中的mode高于--mode=development中的mode；

总结：
|方式|说明|
|:---|:---|
|mode|设置模块内的process.env.NODE_ENV|
|DefinePlugin|设置模块全局变量，也可以对process.env.NODE_ENV变量进行覆盖|
|process.env.NODE_ENV|设置node环境变量|
|cross-env|设置node环境变量|

## 2. webpack 开发环境

### 2.1 资源模块

在webpack5 之前，加载资源模块需要配置一系列的loader，（如 raw-loader\file-loader\url-loader）,在webpack5则可以直接使用；

- `raw-loader` => `asset/source`	导出资源的源代码；
- `file-loader` => `asset/resource` 发送一个单独的文件并导出 URL；
- `url-loader` => `asset/inlien` 导出一个资源的 data Url (base6)
- `asset` 导出的资源可以根据资源的大小在 data Url 和 发送单独文件之间切换；

```js
// webpack.config.js
//...
{
    test: /\.(jpg|png|gif|bmp)$/,
    type: 'asset',
    parser: {
    	dataUrlCondition: {
			maxSize: 4 * 1024 // 4kb
		}
	}
},
```
### 2.1 css loader 配置

- `style-loader` 将css转换成js的形式插入到页面中
- `css-loader` 处理 @import 、url() 



### 2.1.1 css-loader

- `importLoaders`  : 允许在css-loader 处理前，应用于处理 @import /url()之前，应用的loader数量；

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
};
```

配置完 `importLoaders` 后，相当于 `css-loader` 前配置的loader拥有解析 @import / url() 的能力；






### 2.7 转义ES6/ES7/JSX
- 最新的 ES 语法：() => {}
- 最新的 ES APi：promise
- 最新的 ES 实例方法：String.prototype.includes
#### 2.7.1 bable介绍
`bable-loader`  `bable-core` `preset-env` 的区别？

- bable-loader 只是一个函数，它的作用是去调用 `bable-core`;
- bable-core 本身提供一个过程管理功能：把源码转换成语法树，进行遍历和生成，它本身不知道具体要生成什么语法和具体语法的生成； `ES6代码` ——> `ES6语法树`；
- bable-core 会调用 预设环境（`preset-env`）把 `ES6语法树` ——> `ES5语法树`；
- bable-core最后把`ES5语法树` ——> `ES5代码`；

bable中的预设环境(`preset-env`) 是多个插件的集合，安装了这一个就等于安装了一堆插件。

#### 2.7.2 bable-poliyfill（垫片/腻子）

**为什么会有 `bable-poliyfill` ?** 

- bable 默认值转换新的javascript语法，而不转换新的API，如Promise、set、Maps、Proxy、generator等全局对象，Object、assign等全局方法都不会转换；`bable-poliyfill` 就是用来转换这些方法的；

**`bable-poliyfill` 如何实现转换？**

- 它是通过想全局对象中内置的prototype 上添加方法看来实现，如 Array.prototype.find ；
- 这种做法容易带来全局空间污染；

>  新版本废弃了该插件 [bable-polyfill](https://babeljs.io/docs/babel-polyfill)



#### 2.7.3 bable-runtime

**为什么会有 `bable-runtime` ?** 

- Babel为了解决全局空间污染的问题，提供了单独的包`babel-runtime` 用以提供编译模块的工具函数；
- 简单说 `bable-runtime` 更像是一种按需加载的实现，比如说你在哪里需要使用Promise，只要在这头部 `require Promise from 'bable-runtime/core-js/promise' `

```base
npm i bable-runtime -D
```
```js
import Promise from 'bable-runtime/core-js/promise';
const p = new Promise(() => {})
```

缺点：每次都要引入，很麻烦；

#### 2.7.4 bable/plugin-transform-runtime

**为什么会有 `bable/plugin-transform-runtime` ?** 

- 解决了每次都需要引入的问题；
  - 当我们使用 `async/await` 时，自动引入 `babe-runtime/regenerator` ；
  - 当我们使用ES6 的静态事件或内置对象时，自动引入 `bable-runtime/core-js` ;



```js
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```



配置项：

- helpers： 是否需要提取一些类的继承的帮助方法  ；helper=true提取成单独的模块（体积会小一些）；如果为false不提取；



### 2.8 ESline 配置
- 安装
- 配置
- enforce: pre 先行代码配置eslint
- 继承airbab
- 自动修复


### 2.9 sourcemap
- sourcemap是为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术；
- webpack通过配置可以自动给我们`source maps`文件，map文件是一种对应编泽文件和源文件的方法;

|类型|含义|
|:---|:----|
|source-map|原始代码最好的sourcemap质量有完整的结果但是会很慢|
|eval-source-map|原始代码同样道理，但是最高的质量和最低的性能|
|cheap-module-eval-source-map|原始代码（只有行内）同样道理，但是更高的质量和更低的性能|
|cheap-eval-source-map|转换代码（行内）每个模块被eval执行，并且sourcemap作为eval的一个dataurl|
|eval|生成代码每个模块都被eval执行，并且存在@sourceURL,带eval的构建模式能cache SourceMap|
|cheap-source-map|转换代码（行内）生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用|
|cheap-module-source-map|原始代码（只有行内）与上面一样除了每行特点的从loader中进行映射|

看似配置项很多，其实只是五个关键字eval、source-map、cheap、module和inline的任意组合

|关键字|含义|
|:---|:----|
|eval|使用eval包裹模块代码|
|source-map|产生.map文件|
|cheap|不包含列信息，也不包含loadert的sourcemap|
|module|包含loader的sourcemap(比如jsx to js,babel的sourcemap),否则无法定义源文件|
|inline|将.map作为DataURI嵌入，不单独生成.map文件|
#### 2.9.1 webpack.config.js
```js
module.exports = {
  devtool:'cheap-source-map',
  devtool:'cheap-module-source-map',
  }
```

#### 2.9.2 最佳实践
##### 2.9.2.1 开发环境
- 我们在开发环境对sourceMap的要求是：快(eval),信息全(module)；
- 且由于此时代码未压缩，我们并不那么在意代码列信息(cheap);
- 所以开发环境比较推荐配置：`devtool:cheap-module-eval-source-map`

##### 2.9.2.2 生产环境
- 一般情况下，我们并不希望任何人都可以在浏览器直接看到我们未编译的源码;
- 所以我们不应该直接提供sourceMap:给浏览器。但我们又需要sourceMap来定位我们的错误信息;
- 这时我们可以设置`hidden-source-map`;
- 一方面webpack会生成sourcemap文件以提供给错误收集工具比如sentry,另一方面又不会为bundle添加引用注释，以避免浏览器使用。
- hidden-source-map 如何使用呢？ 
测试环境：
```js
plugins: [
  // 动态插入映射
  new webpack.SourceMapDevToolPlugin({
    append: '//# sourceMappingURL=http://127.0.0.1:8081/[url]',
    filename: '[file].map'
  })
]
```
生产环境：
webpack打包仍然生成sourceMap,但是将map文件挑出放到本地服务器，将不含有map文件的部署到服务器，借助第三方软件（例如fiddler），将浏览器对map文件的请求拦截到本地服务器，就可以实现本地sourceMap调试；
```js
regex:(?inx)http:\/\/localhost:8080\/(?<name>.+)$
*redir:http://127.8.0.1:8o81/${name}
```
![fiddleproxy](http://img.zhufengpeixun.cn/fiddleproxy.png)

### 2.10 打包第三方类库
#### 2.10.1 直接引入
痛点： 比较麻烦，每次都要引
```js
import _ from 'loadsh'
```
#### 2.10.2 插入引入
- webpack配置ProvidePlugin后，在使用时将不再需要importi和require进行引入，直接使用即可;
- 函数会自动添加到当前模块的上下文，无需显示声明(但window上没有，无法在window上使用)
```js
new webpack.ProvidePlugin({
  _:'lodash'
})
```
优点：不需要手动引入，直接就能用
缺点：无法在全局使用

#### 2.10.3 expose-loader 引入
- expose-loader 可以将引入的文件添加到全局，同时也不需要引入，弥补了上面的问题
- 不需要任何其他的插件配合，只要将下面的代码添加到所有的loader之前

#### 2.10.4 CDN引入
```js
// 通过外链引入，并改名为 _ ，则webpack不会再打包
externals: {
  lodash: '_'
}
```
缺点：
- 需要手工引入script脚本
- 不管代码是否用到，都有引入他们
#### 2.10.5 html-webpack-extenrals-plugin
```js
require('html-webpack-extenrals-plugin');

new HtmlWebpackExternalsPlugin(
  externals: [
    {
      module:'lodash',
      entry:'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.js',
      global: '_'
    }
  ]
)
```
使用时,有引用才会打包
```js
require('lodash')
```

 

## 2.11 watch

watch 是监听build 过程中，当代码改变后，会重新自动编译。

```js
// webpack.config.js
module.exports = {
  //...
  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: '**/node_modules',
  },
};
```

监听原理：

- webpack 定时获取文件更新时间，并跟上次保存的时间进行比对，不一致就表示发生了变化。其中poll就用来配置每秒问多少次；
- 当检测文件不再发生变化，会先缓存起来，等待一段时间后之后再通知监听者，这个等待时间通过；`aggregateTimeout` 配置；
- webpack只会监听entry依赖的文件；
- 我们需要尽可能减少需要监听的文件数量和检查频率，当然频率的降低会导致灵敏度下降；



## 2.12 常用插件

### 2.12.1 CopyWebpackPlugin

[CopyWebpackPlugin](https://webpack.docschina.org/plugins/copy-webpack-plugin#root) : 将已存在的单个文件或目录复制到生成目录。



### 2.12.2 clean-webpack-plugin

[clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)：用于删除构建文件夹。



### 2.12.3 webpack-dev-middleware

[webpack-dev-middleware](https://www.webpackjs.com/guides/development/#using-webpack-dev-middleware) : 就是在 Express 中提供 `webpack-dev-server` 静态服务能力的一个**中间件**；

- webpack-dev-server的好处是相对简单，直接安装依赖后执行命令即可；
- 而使用 webpack-dev-middleware 的好处是可以在既有的Express代码基础上快速添加webpack-dev-server的功能，同时利用Express来根据需要添加更多的功能，如mock服务、代理AP请求等；

```js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const app = express();
const config = require('./webpack.config.js')

// compiler 就是webpack编译后的对象
const compiler = webpack(config);		// 编译   为什么传入配置文件，就可以拿到编译后的结果？

// 在use前调用，相当于 onBeforeSetupMiddleware
app.get('/api/users', (req, res) => {
  res.json({data: 'before'})
})
// express 使用 webpackDevMiddleware 中间件
// 中间件获取到 compiler 对象后，会根据webpack.config.js 中的配置进行编译，并且返回产出的文件，如main.js index.html
app.use(
  webpackDevMiddleware(compiler, {})
)

// 后置调用
app.get('/api/users', (req, res) => {
    res.json({data: 'after'})
})
app.listen(3000)

```

**webpack-dev-middleware 和 webpack-dev-server 的区别？**

- webpack-dev-server 中其实包含了  webpack-dev-middleware 的功能；
-  在server.js 中其实就是实现了一个简单版的 webpack-dev-server





## 3. 生产环境

配置原则：

- 文件体积尽可能小；
- 尽可能方便缓存；

### 3.1 提取css

- 因为CSS的下载和JS可以并行，当一个HTML文件很大的时候，我们可以把CSS单独提取出来加载;

[mini-css-extract-plugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#getting-started) 插件，只负责提取css,压缩css需要其他的插件



### 3.2 指定图片和CSS目录

 webpackconfig.js 配置

```js
module.exports = {
    // ...
    module: {
    	rules: [
            {
                test: /\.(jpg|png|gif|bmp)$/,
                type: 'asset',
                parser: {
                  dataUrlCondition: {
                    maxSize: 8 * 1024 // 4kb
                  }
                },
                // 指定图片存放文件夹 images
                generator: {
                  filename: 'images/[hash:10][ext][query]'
                }
            },
        ]
    },
    plugins: [
  		// ...
        new MiniCssExtractPlugin({
          // 指定css 文件夹
          filename: 'css/[name].[hash:10].css'
        })
  ],
    // ...
}
```



### 3.3 hash、chunkhash和contenthash

- `文件指纹`是指打包后输出的文件名和后缀；
- hash一般是结合CDN缓存来使用，通过webpack构建之后，生成对应文件名自动带上对应的MD5值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的HTML引用的URL地址也会改变，触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存。

**指纹占位符**

| 占位符名称  | 含义                                               |
| ----------- | -------------------------------------------------- |
| ext         | 资源后缀名                                         |
| name        | 文件名称                                           |
| path        | 文件的相对路径                                     |
| folder      | 文件所在的文件夹                                   |
| hash        | 每次webpack构建时生成一个唯一的hash值              |
| chunkhash   | 根据chunk生产hash值，来源同一个chunk，则hash值一样 |
| contenthash | 根据内容生产hash值，文件内容相同hash值就相同       |


**总结：**
||hash|chunkhash|contenthash|
|----|:----:|:----:|:----:|
|稳定性（缓存性）| :star: |:star::star:|:star::star::star:|
|性能|:star::star::star:|:star::star:|:star:|

#### 3.3.1 Hash

Hash是整个项目的hash值，其根据每次编译内容计算得到，每次编译之后都会生成新的hash,即修改任何文件都会导致所有文件的hash发生改；

#### 3.3.2 chunkhash

为啥要用chunkhash？

- hash的使用存在着一个问题，只要项目中有地方改变，每次构建的hash 值都不一样，即使部分文件内容没有改变。无法实现缓存。
- chunkhash它根据不同的入口文件Entry进行依赖文件解析、构建对应的chunk，生成对应的哈希值；我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成hash值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响；

```js
module.exports = {
  output: {
    path: resolve(__dirname, "dist"), 
      // 根据不同的入口，生产chunkhash
    filename: "[name].[chunkhash:10].js",
  },
}
```



#### 3.3.3 contenthash

使用chunkhash存在一个问题，就是当在一个JS文件中引入CSS文件，编译后它们的hash是相同的，而且只要js文件发生改变，关联的css文件hash也会改变，这个时候可以使用 `mini-css-extract-plugin` 里的 `contenthash`值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构随；

```js
plugins: [
    new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:10].css'
    })
],
```

这样就可以达到缓存 css 的效果；

### 3.4 CSS兼容性

为了浏览器的兼容性（如兼容伪元素:placeholder等），有时候我们必须加入webkit,-ms,-o,-moz这些前缀, 如：
- Tridentp内核：主要代表为1E浏览器，前缀为-ms；
- Gecko内核：主要代表为Firefox,前缀为-moz；
- Prestol内核：主要代表为Opera,前缀为-o；
- Webkitp内核：产要代表为Chrome和Safari,前缀为webkit

#### 3.4.1 postcss-loader、postcss-preset-env

查询兼容性网址： https://caniuse.com/

- postcss-loader：可以使用PostCSS处理CSS；
- postcss-preset-env：把现代的CSS转换成大多数浏览器能理解的兼容性写法；(属于postcss-loader的插件)
- postcss-preset-env已经包含了 `autoprefixer` 和 `browsers` 选项；

```bash
npm i postcss-loader postcss-preset-env -D
```
配置方式有很多种，可以在 package.json \ webpack.config.js \ .browserslistrc 等文件配置所需要兼容的浏览器。
[browserslist](https://github.com/browserslist/browserslist)
[browserslist-example](github.com/browserslist/browserslist-example)






### 3.5 压缩JS、CSS、HTML和图片
`optimize-css-assets-webpack-plugin` 是一个优化和压缩CSS资源的插件;
`terser-webpack-plugin` 是一个优化和压缩JS资源的插件;
`image-webpack-loader` 压缩图片插件，一般不用webpack进行压缩；
配置：
```js
module.exports = {
  mode: 'none',   // 关闭模式
  optimization: {   // 优化配置
    minimize: true,
    minimizer: [
      new TerserPlugin()      // JS 压缩
    ]
  },
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template:'./src/index.html',
      filename:'index.html',
      minify: {   // 压缩html
        collapseWhitespace:true,
        removeComments: true
      }
    }),
    new OptimizeCssAssetsWebpackPlugin(),   // 压缩css
  ]
}
```

### 3.6 px自动转成rem
- `px2rem-loader` 自动将px转换为rem;
#### 3.6.1 安装
```bash
cnpm i px2rem-loader -D
```
#### 3.6.2 配置
webpack.config.js
```js
module.exports = {
  module: {
    rules: [
       {
        test: /\.css$/,
        use: ["style-loader", "css-loader", {
          loader: 'px2rem-loader',
          options: {    
            remUnit: 75,    // 1rem = 75px
            remPrecision: 8 // 保留 8 位小数
          }
        }],
      },
    ]}
}
```
根据屏幕宽度自适应root:fontSize大小
```js
var docElement = document.documentElement
function setRemUnit() {
  docElement.style.fontSize = docElement.clientWidth / 10 + 'px'
}
window.addEventListener('resize', function() {
  setRemUnit()
})
setRemUnit()
```

#### 3.6.3 思路
- rem：根据浏览器的root:fontSize决定rem的大小；
- 根据屏幕宽度，动态计算root:fontSize，从而实现自适应布局；

**计算方式：**
1. 确定移动端设计稿尺寸（width: 750px）;
2. 屏幕宽度 / 10 = 1rem对应的大小；`root:fontSize` =  750px / 10 = 75px;
3. 监听视口resize，动态计算 `root:fontSize`;
4. 开发时，配置 `px2rem-loader`， `px2rem-loader` 是将 `px` 在编译时自动转换成 `rem`的loader,将remUnit: 75后，我们就可以使用设计稿的给的尺寸进行开发；



## webpack编译流程

1.初始化参数：从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
2.用上一步得到的参数初始化Compiler对象
3.加载所有配置的插件
4.执行对象的 `run` 方法开始执行编泽
5.根据配置中的 `entry` 找出入口文件
6.从入口文件出发，调用所有配置的 `Loader `对模块进行编译
7.再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的Chunk
9.再把每个Chunk转换成一个单独的文件加入到输出列表
10.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统



## 热更新原理

webpack-dev-server 服务启动后，浏览器和服务端之间通过websocket建立常链接；webpack内部会对代码的就改进行watch监听，只要我们修改，webpack就会重新打包编译到内存中，然后webpack就可以依赖一些中间件(webpack-dev-middleware)和webpack之间进行交互；每次热更新时，都会请求一个携带hash值的JSON文件和js文件，websocket负责传递这个hash值，内部在通过hash值的检测进行热更新。

## webpack创建

1、npm 初始化

```bash
npm init 
// 或
npm init -y        // -y 跳过作者提问
```

2、webpack - cli安装 （项目安装）

```bash
npm install webpack webpack-cli -D
```

`-D` 开发依赖，开发依赖就是dev(--dev)

`-S` 生产依赖，生产依赖就是要放上线的(--save)

3、查看依赖  `npx webpack -v`

4、执行 `npx webpack`

5、webpack 执行过程

- webpack执行构建，会先寻找根路径下webpack.config.js这个配置文件，如果没有找到，走默认配置。（在node_modules\webpack\bin\webpack.js）

## module、chunk、bundle

**官方解释：**

- **Module**：对于 webpack 来说，项目源码中所有资源（包括 JS、CSS、Image、Font 等等）都属于 module 模块。可以配置指定的 Loader 去处理这些文件。

- **Chunk**：当使用 webpack 将我们编写的源代码进行打包时，webpack 会根据文件引用关系生成 chunk 文件，webpack 会对这些 chunk 文件进行一些操作。

- **Bundle**：webpack 处理完 chunk 文件之后，最终会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终产物。

![1](https://img-blog.csdnimg.cn/dfdac1e5d03e45039c3ab430fefe131b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBATGluenNvbmc=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

**简单理解：**

- 对于一份同逻辑的代码，当我们手写下一个一个的文件，它们无论是 ESM 还是 commonJS 或是 AMD，他们都是 `module `；
- 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 `chunk `文件，webpack 会对这个 chunk 文件进行一些操作；
- webpack 处理好 chunk 文件后，最后会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行;

**总结：**

> `module`、`chunk` 和 `bundle` 其实就是同一份逻辑代码在不同地方的不同表现形式（取了3个名字）。我们编写的是 `module`，webpack 处理时是 `chunk`，最终生成供浏览器允许的是 `bundle`。

| module | chunk |
|:------:|:-----:|
| 1对     | 1     |
| 多对     | 1     |

| chunk | **bundle** |
|:-----:|:----------:|
| 1对    | 1          |
| 1对    | 多          |

## webpack 核心配置

### entry

webpack 执行构建的入口；

- 

### output

打包后输出到磁盘位置，在webpack经过处理后输出的bundle文件；

**output参数类型**

- filename
  - 占位符 [name]
  - hash      整个项目的hash值，每次构建都会生成一次，这样打包就不用担心缓存问题；
  - chunkhash    根据不同入口entry进行依赖解析，构建对应的chunk,生成相应的hash；只要组成entry的模块没有内容改变，则对应的hash不变；（chunk的哈希值）
  - name
  - id
  - contenthash：每个文件都有单独的 hash 值，文件的改动只会影响自身的 hash 值；（每个文件都有hash值）
- path：必须是绝对路径，输出到磁盘的目录；

### mode 构建模式

**Mode**⽤来指定当前的构建环境：

- none  
- production 
- development

设置mode可以⾃动触发webpack内置的函数，达到优化的效果

| 选项                | 描述                                                                                                                                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| development(开发模式) | 会将 `DefinePlugin`中的 `process.env.NODE_ENV` 的值设置为 `development` 。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin` 。                                                                                                         |
| production(生成模式)  | 会将 `DefinePlugin`中 `process.env.NODE_ENV` 的值设置为 `production` 。启用 `FlagDependencyUsagePlugin` ，  `FlagIncludedChunksPlugin` ，`NoEmitOnErrorsPlugin`， `OccurrenceOrderPlugin` ，`SideEffectsFlagPlugin` 和 `TerserPlugin` 。 |
| none              | 退出任何默认优化选项                                                                                                                                                                                                              |

如果没有设置，webpack会将 mode 的默认值设置为 production 。

- 开发阶段的开启会有利于热更新的处理，识别哪个模块变化；
- ⽣产阶段的开启会有帮助模块压缩，处理副作⽤等⼀些功能

### loader 模块转换

> loader用于加载某些资源文件。因为webpack本身只能打包common.js规范的js文件，对于其他资源如css，img等，是没有办法加载的，这时就需要对应的loader将资源转化，从而进行加载。

Webpack 默认只⽀持.json 和 .js模块 不⽀持 不认识其他格式的模块，所以需要 loader来进行模块转换；

**loader在 module的rules中**，一个loader只做一件事情。

### module  模块

当webpack处理到不认识的模块时，需要在webpack中的module处进⾏配置，当检测到是什么格式的模块，使⽤什么loader来处理， loader执行顺序：从后往前。

```js
module:{
    rules:[
        {
            // test:/\.xxx$/  ,//指定匹配规则    
            test: /\.css$/,        
            // loader执行顺序：从后往前
            // { loader: 'xxx-load'//指定使⽤的loader }
            use: ["style-loader", "css-loader"],
            // 打包优化：可以使用 exclude： /node_module 进行排除，这样打包就检查时就会排除node_module目录
        }
    ]
}
```

**css-loader** 作用： 是把css模块的内容 加入到 js模块中去，连接css和webpack。（css in js）

**style-loader** 作用：从js中提取css的loader，在html中创建style标签，把 css的内容放在这个style标签中；

**less-loader**：将less转换成css；

**file-loader**：解决图片引入问题，并将图片 copy 到指定目录，默认为 dist；

**url-loader**：解依赖 file-loader，当图片小于 limit 值的时候，会将图片转为 base64 编码，大于 limit 值的时候依然是使用 file-loader 进行拷贝；

**img-loader**：压缩图片；

**Babel**：使用 Babel 加载 ES2015+ 代码并将其转换为 ES5；

### plugins  插件

webpack 的一个补充。

> plugin用于扩展webpack的功能。不同于loader，plugin的功能更加丰富，比如压缩打包，优化，不只局限于资源的加载。

- 作⽤于webpack打包整个过程；
- webpack的打包过程是有（⽣命周期概念）钩⼦；

plugin 可以在webpack运⾏到某个阶段的时候，帮你做⼀些事情，类似于⽣命周期的概念；

**常用插件：**

- [html-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhtml-webpack-plugin) 打包后的js或css文件自动导入HTML中，打包后会生成HTML文件；

- [clean-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fclean-webpack-plugin) 自动清空打包目录，每次打包签将打包目录清空；

- [cross-env](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcross-env) 开发环境和生产环境的区分；

- [webpack-dev-server](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fconfiguration%2Fdev-server%2F%23devserver)  配置本地服务
  
  ```js
  // webpack.config.js
  const config = {
    // ...
    devServer: {
      contentBase: path.resolve(__dirname, 'public'), // 静态文件目录
      compress: true, //是否启动压缩 gzip
      port: 8080, // 端口号
      // open:true  // 是否自动打开浏览器
    },
   // ...
  }
  module.exports = (env, argv) => {
    console.log('argv.mode=',argv.mode) // 打印 mode(模式) 值
    // 这里可以通过不同的模式修改 config 配置
    return config;
  }
  
  /为什么要配置 contentBase ？
  因为 webpack 在进行打包的时候，对静态文件的处理，例如图片，都是直接 copy 到 dist 目录下面。但是对于本地开发来说，这个过程太费时，也没有必要，所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，而不需对文件做任何移动，节省了时间和性能开销。
  ```

- [postcss-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Floaders%2Fpostcss-loader%2F) css兼容插件

- [mini-css-extract-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fplugins%2Fmini-css-extract-plugin%2F) 分离样式插件；前面，我们都是依赖 `style-loader` 将样式通过 style 标签的形式添加到页面上；但是，更多时候，我们都希望可以通过 CSS 文件的形式引入到页面上，`mini-css-extract-plugin`就可以派上用场了。

## webpack 和 gulp的区别

- webpack ：是一个模块打包工具，强调的是前端模块化的解决方案，更侧重于模块打包通过loader和plugins进行处理；

- gulp： 是一个前端自动化构建工具，强调的是前端开发的工作流程；通过配置一些类的task来处理一些任务（代码压缩、合并、编译及浏览器的实时更新）
  
  > 侧重点不同，gulp侧重于整个过程的控制管理（像是流水线），通过配置不同的task，构建整个前端开发流程；webpack则侧重于模块打包；并且gulp的打包功能是通过安装gulp-webpack来实现的