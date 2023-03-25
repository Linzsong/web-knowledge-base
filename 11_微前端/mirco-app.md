# OA系统微前端说明文档

[Github文档](https://github.com/micro-zoe/micro-app/issues/8)

## 一、关于微前端

### 1. 微前端是什么？

**简介：**

        它借鉴了微服务的架构理念，核心在于将一个庞大的前端应用拆分成多个独立灵活的小型应用，每个应用都可以独立开发、独立运行、独立部署，再将这些小型应用融合为一个完整的应用，或者将原本运行已久、没有关联的几个应用融合为一个应用。微前端既可以将多个项目融合为一，又可以减少项目之间的耦合，提升项目扩展性，相比一整块的前端仓库，微前端架构下的前端仓库倾向于更小更灵活。



微前端是将不同的功能按照不同维度拆分成多个子应用。通过主应用的需求来加载相应的子应用；

微前端架构具备以下几个核心价值：

- 技术栈无关
  主框架不限制接入应用的技术栈，微应用具备完全自主权

- 独立开发、独立部署
  微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新

- 增量升级
  
  在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略

- 独立运行时
  每个微应用之间状态隔离，运行时状态不共享





### 2. 为什么去使用微前端？

- 不同团队开发同一个应用，使用不同的技术栈；
- 每个团队可以独立开发独立部署；
- 老代码的嵌入；
- 随着项目迭代应用越来越庞大，难以维护。

我们是不是可以将一个应用划分成若干个子应用，将子应用打包成一个个lib。通过切换路由来加载不同的子应用。这样每个子应用都是独立的，技术栈也不用做限制。

## 二、主流微前端技术

### 1. single-spa

2018年开源的微前端框架，是一个用于微前端服务化的JavaScript前端解决方案，实现了路由劫持和应用加载；

缺点：

- 没有处理父子应用或平级应用样式隔离的问题；
- JavaScript执行隔离如父子应用或平级应用使用window对象的冲突问题；

### 2. qiankun

基于`single-spa`，且提供了开箱即用的API（sandbox+import-html-entry）,与技术无关；

**优点：**

- 开箱即用的API

- **HTML Entry 接入方式**，让你接入微应用像使用 iframe 一样简单。

- **技术栈无关**，任意技术栈的应用均可 使用/接入；

- **样式隔离**，确保微应用之间样式互相不干扰。

- **JS 沙箱**，确保微应用之间 全局变量/事件 不冲突。

- **资源预加载**，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。

- **umi 插件**，提供了 [@umijs/plugin-qiankun](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun) 供 umi 应用一键切换成微前端架构系统。

**缺点：**

- 基于URL的方式无法在一个页面上同时加载多个子应用，毕竟浏览器的URL也只有一个（`single-spa`是通过监听 url change 事件，在路由变化时匹配到渲染的子应用并进行渲染，这个思路也是目前实现微前端的主流方式）
- 侵入代码较多，`single-spa`要求子应用修改渲染逻辑并暴露出三个方法：`bootstrap`、`mount`、`unmount`，分别对应初始化、渲染和卸载，这也导致子应用需要对入口文件进行修改。

### 3. mirco-app

`micro-app`并没有沿袭`single-spa`的思路，而是借鉴了WebComponent的思想，通过CustomElement结合自定义的ShadowDom，将微前端封装成一个类WebComponent组件，从而实现微前端的组件化渲染。并且由于自定义ShadowDom的隔离特性，`micro-app`不需要像`single-spa`和`qiankun`一样要求子应用修改渲染逻辑并暴露出方法，也不需要修改webpack配置，是目前市面上接入微前端成本最低的方案。

**选择mirco-app原因：**

- 不想基于路由的方式来限制子组件的；

- 一个页面下会有多个子组件的情况；

### 4. 为什么不用ifarm？

1、URL不同步问题，浏览器刷新后iframe url状态丢失、后退前景按钮无法正常使用；

2、慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

3、UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中。

4、全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。

参考地址 [Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)



其实，在所有微前端方案中，iframe是最稳定的、上手难度最低的，但它有一些无法解决的问题，例如性能低、通信复杂、双滚动条、弹窗无法全局覆盖，它的成长性不高，只适合简单的页面渲染。



### 5. **npm包**

将子应用封装成npm包，通过组件的方式引入，在性能和兼容性上是最优的方案，但却有一个致命的问题就是版本更新，每次版本发布需要通知接入方同步更新，管理非常困难。

## 三、主应用配置

### 1. 主应用引入

```js
// main.js
import microApp from '@micro-zoe/micro-app'
microApp.start()
```

### 2. 配置子应用端口

子应用端口需和主应用端口一一对应，注意：避免端口号的占用问题，尽量使用空闲的端口号，（开发环境使用）

```js
// 主应用 src\micro-app\port-config.js
...
const config = [{
    name: 'base',                    // 子应用名称
    port: 'http://localhost:4001/',  // 子应用端口
  },
  {
    name: 'flow',
    port: 'http://localhost:4002/',
  }, {
    name: 'hiring',
    port: 'http://localhost:4003/',
  }
]
...
```

生产环境使用

```js
// 主应用 src\micro-app\port-config.js
...
if (process.env.NODE_ENV === 'production') {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  config.forEach(item => {
    item.port = `${window.location.origin}/${item.name}/`
  })
}
...
```

### 3. 主应用路由配置

主应用采用history模式

```js
// src\router\index.js
// 主应用中添加子应用名称对应的路由
let index = routes.findIndex(item => item.path == "/main")
routes[index].children = routes[index].children.concat(microRoute())
```

```js
// src\micro-app\port-config.js
export const microRoute = () => {
  let arr = []
  microConfig.forEach(subApp => {
    arr.push({
      path: subApp.name + '/#/', // 这里要把父路由的路径也带上
      name: subApp.name,
      component: () => import('@/micro-app/component/subCommon'),
    }, {
      path: subApp.name + '/*', // 防止主应用刷新史404
    }, )
  });
  return arr
}
```

### 4. 子应用渲染组件

- 端口 `url` 配置和`name` 配置必须是独一无二的；

- 监听每个子组件的生命周期钩子函数如：`@created``@beforemount``@mounted`和`@unmount` 等；

- 通过 `:data`对子组件进行传参；

```html
<template>
    <div>
        <div v-for="subApp in microApps" :key="subApp.name">
            <micro-app
                v-if="mountedFlag"
                v-show="isShow === subApp.name"
                :name="subApp.name"
                :url="subApp.port"
                @created="created(subApp.name)"
                @beforemount="beforemount(subApp.name)"
                @mounted="mounted(subApp.name)"
                @unmount="unmount(subApp.name)"
                :data="microData"
                keep-alive
            ></micro-app>
        </div>
    </div>
</template>
```

## 四、子应用配置

### 1. 子应用端口配置

```js
// 子应用，vue的配置文件
// config\index.js
...
module.exports = {
  ...
  dev: {
    ...
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 4001, // 与主应用的端口号一致
    ...
  },
  ...
}
```

### 2. 设置跨域支持

- vue-cli > 3.*

    在`vue.config.js`中添加配置

```js
devServer: {
    headers: {    // 支持跨域
      'Access-Control-Allow-Origin': '*',
    }
}
```

- vue-cli 2.*

`webpack.dev.conf.js`中添加配置

```js
devServer: {
    headers: {    // 支持跨域
      'Access-Control-Allow-Origin': '*',
    }
}
```

### 3. 设置 publicPath

借助了webpack的功能，避免子应用的静态资源使用相对地址时加载失败的情况;

**步骤1:** 在子应用src目录下创建名称为`public-path.js`的文件，并添加如下内容

```js
// __MICRO_APP_ENVIRONMENT__和__MICRO_APP_PUBLIC_PATH__是由micro-app注入的全局变量
if (window.__MICRO_APP_ENVIRONMENT__) {
  // eslint-disable-next-line
  __webpack_public_path__ = window.__MICRO_APP_PUBLIC_PATH__
}
```

**步骤2:** 在子应用入口文件的`最顶部`引入`public-path.js`

```js
// entry
import './public-path'
```

### 4. 公共路径（*publicPath*）

在新建一个新的子应用时，建议开发环境和线上环境路径保持一致，这样开发环境和生产环境的资源路径就不用进行转换。

- vue-cli > 3.* ，在`vue.config.js`中配置；

```js
// vue.config.js
module.exports = {
  outputDir: 'my-app',
  // publicPath: process.env.NODE_ENV === 'production' ? '/base' : '', // bad ❌
  publicPath: '/base', // good 👍
}
```

- vue-cli 2.*，在`webpack.dev.conf.js`中配置；

```js
// webpack.config.js
module.exports = {
  output: {
    path: 'my-app',
    // publicPath: process.env.NODE_ENV === 'production' ? '/base' : '', // bad ❌
    publicPath: '/base', // good 👍
  }
}
```

### 5. 监听子应用卸载

子应用被卸载时会接受到一个名为`unmount`的事件，在此可以进行卸载相关操作。

```js
// main.js
const app = new Vue(...)

// 监听卸载操作
window.microApp && window.addEventListener('unmount', function () {
  console.log('我是子应用base。卸载...');
  app1.$destroy()
  app1.$el.innerHTML = ''
  app1 = null
})
```

### 6. 接收主应用下发路由跳转

方式一：window.history模式

```js
// main.js
window.microApp && window.microApp.addDataListener((data) => {
  // 当基座下发跳转指令时进行跳转
  if (data.path) {
    router.push({path: `/main/${data.path}`})
  }
})
```

方式二：通过数据通信控制跳转

（主应用控制子应用跳转）

```js
// 主应用
// microAppName 为子应用名称       path 子应用跳转的路由

microApp.setData(microAppName, { path: path });
```

方式三： 传递路由实例方法

(子应用控制主应用或其他子应用的跳转)

```v
<!-- 主应用 -->
<template>
  <micro-app
    name='子应用名称' 
    url='url'
    :data='microAppData'
  ></micro-app>
</template>

<script>
export default {
  data () {
    return {
      microAppData: {
        pushState: (path) => {
          this.$router.push(path)
        }
      }
    }
  },
}
</script>
```

子应用使用pushState控制基座跳转：

```js
window.microApp.getData().pushState(path)
```

### 7. 路由约定

*** 子应用一律使用hash模式**

**注意事项：**

- 主应用采用history路由，子应用必须采用是hash路由的模式，这样主应用写的规则才可以进行匹配；

- 子应用路由新增应该在 `path: "/main"` 的子路由进行配置，举个例子：

```js
export default new Router({
  mode: 'hash',
  routes: [{
    ...
     {
        path: "/main",
        component: MainLayout,
        name: "desktop",
        children: [{
            path: "XXXX/XXXXXXX",
            name: "XXXXX",
            component: () => import('@/pages/XXXXX/XXXXX.vue')
         }]
      }
    ...
   }]
)}
```

- 路由表配置注意事项：**该模块中的路由`path`需要是所有子应用中独一无二的**（不然在主应用跳转子应用路由时，会发生混乱），我们可以为我们的子应用路由加上特定的前缀来避免重名问题，举个例子：
  
  ```js
  export default new Router({
    mode: 'hash',
    routes: [{
      ...
       {
          path: "/main",
          component: MainLayout,
          name: "desktop",
          children: [{
              path: "role/XXXXXXX",
              name: "XXXXX",
              component: () => import('@/pages/role/XXXXX.vue')
           }]
        }
      ...
     }]
  )}
  ```

### 8. 应用之间的跳转

每个应用的路由实例都是不同的，应用的路由实例只能控制自身，无法影响其它应用，包括基座应用无法通过控制自身路由影响到子应。

**要实现应用之间的跳转方式：**

- **window.history**

```js
// 修改浏览器URL
window.history.pushState(null, '', '#/page2')
// 主动触发一次popstate事件
window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
```

### 9. 子应用左侧栏隐藏处理

为了保证子应用可以脱离主应用独立开发，保留了原有的登陆功能和主应用有的侧边栏功能。仅对侧边栏页面在 `微前端环境` 下隐藏，在 `独立开发环境` 下显示，控制字段如下：

```js
computed: {
    isMicroApp() {
      return this.$store.state.isMicroApp
    }
},
```

## 五、 打包部署

### 1. 应用打包

- 配置打包名称，配置文件`config\index.js`（可选）

```js
// 在base子应用中
// config\index.js
...
build: {
    // 打包的index文件目录
    index: path.resolve(__dirname, '../dist/base/index.html'),
    // 打包输出Paths
    assetsRoot: path.resolve(__dirname, '../dist/base'),
}
...
```

- 打包指令

```bash
npm run build
```

- 将打包文件上传到指定的服务器

### 2. 部署到服务器的目录结构：

使用Nginx进行部署

```
html(nginx下存放代的目录)
├── child
│   ├── base              // 子应用 base
│   ├── flow              // 子应用 flow
│   ├── hiring            // 子应用 hiring
│ 
├── main                  // 主应用
```

### 3. Nginx配置

其中子应用的location值要于publicPath配置的路径一致；

```apacheconf
server {
    listen       80;
    server_name  10.1.6.50;

    # 主应用
    location / {
        root /usr/share/nginx/html/main;
        index index.html;
        # 跨域
        add_header Access-Control-Allow-Origin *;
        if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
            add_header Cache-Control max-age=7776000;
            add_header Access-Control-Allow-Origin *;
        }
        try_files $uri $uri/ /index.html;
    }            

    # 子应用base
    location /base {
        alias /usr/share/nginx/html/child/base/;
        add_header Access-Control-Allow-Origin *;
        if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
            add_header Cache-Control max-age=7776000;
            add_header Access-Control-Allow-Origin *;
        }
        try_files $uri $uri/ /html/child/base/index.html;
    }

    # 子应用flow
    location /flow {
        alias /usr/share/nginx/html/child/flow/;
        add_header Access-Control-Allow-Origin *;
        if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
            add_header Cache-Control max-age=7776000;
            add_header Access-Control-Allow-Origin *;
        }
        try_files $uri $uri/ /html/child/flow/index.html;
    }

    # 子应用hiring
    location /hiring {
        alias /usr/share/nginx/html/child/hiring/;
        add_header Access-Control-Allow-Origin *;
        if ( $request_uri ~* ^.+.(js|css|jpg|png|gif|tif|dpg|jpeg|eot|svg|ttf|woff|json|mp4|rmvb|rm|wmv|avi|3gp)$ ){
            add_header Cache-Control max-age=7776000;
            add_header Access-Control-Allow-Origin *;
        }
        try_files $uri $uri/ /html/child/hiring/index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

Docker运行指令

```
docker stop nginx
docker rm -f nginx
docker run --name nginx -p 8080:80 -v /root/nginx/html:/usr/share/nginx/html -v /root/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /root/nginx/logs:/var/log/nginx -d nginx
```

## 六、 其他说明

### 1. 主应用默认开启项

主应用默认开启了一下功能：

- js沙箱

- 样式隔离

- 元素隔离

### 2. 全局变量问题

- 开发子应用时，**慎用操作window对象等全局变量**，避免影响全局的主应用。



## 七、mirco-app原理

### 1. 核心原理

MicroApp 的核心功能在CustomElement基础上进行构建，CustomElement用于创建自定义标签，并提供了元素的渲染、卸载、属性修改等钩子函数，我们通过钩子函数获知微应用的渲染时机，并将自定义标签作为容器，微应用的所有元素和样式作用域都无法逃离容器边界，从而形成一个封闭的环境。

### 2. 渲染流程

通过自定义元素`micro-app`的生命周期函数`connectedCallback`监听元素被渲染，加载子应用的html并转换为DOM结构，递归查询所有js和css等静态资源并加载，设置元素隔离，拦截所有动态创建的script、link等标签，提取标签内容。将加载的js经过插件系统处理后放入沙箱中运行，对css资源进行样式隔离，最后将格式化后的元素放入`micro-app`中，最终将`micro-app`元素渲染为一个微前端的子应用。在渲染的过程中，会执行开发者绑定的生命周期函数，用于进一步操作。

### 3. 元素隔离

- 元素隔离源于ShadowDom的概念，即ShadowDom中的元素可以和外部的元素重复但不会冲突，ShadowDom只能对自己内部的元素进行操作。
- MicroApp模拟实现了类似的功能，我们拦截了底层原型链上元素的方法，保证子应用只能对自己内部的元素进行操作，每个子应用都有自己的元素作用域。
- 元素隔离可以有效的防止子应用对基座应用和其它子应用元素的误操作，常见的场景是多个应用的根元素都使用相同的id，元素隔离可以保证子应用的渲染框架能够正确找到自己的根元素。

### 4. 插件系统

个人理解：一个纯净的系统，本身不会对资源造成影响，只是统筹插件如何执行。设置插件作用在父组件还是子组件中。

### 5. js沙箱和样式隔离

- js沙箱通过Proxy代理子应用的全局对象，防止应用之间全局变量的冲突，记录或清空子应用的全局副作用函数，也可以向子应用注入全局变量用于定制化处理。

- 样式隔离是指对子应用的link和style元素的css内容进行格式化处理，确保子应用的样式只作用域自身，无法影响外部。

（MicroApp借鉴了qiankun的js沙箱和样式隔离方案，这也是目前应用广泛且成熟的方案）

### 6. 预加载

MicroApp 提供了预加载子应用的功能，它是基于requestIdleCallback实现的，预加载不会对基座应用和其它子应用的渲染速度造成影响，它会在浏览器空闲时间加载应用的静态资源，在应用真正被渲染时直接从缓存中获取资源并渲染。

