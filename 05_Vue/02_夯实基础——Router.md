# 1、基础 

路由出口：

```html
 <router-view></router-view>
```

导航： 

```html
<nav>
    <router-link to="/">首页</router-link>
    <router-link to="/about">管理</router-link>
</nav>
```

## Vue-Router使用

- 在scr下新建router文件夹，在文件夹下新建index.js 文件；
- 引入vue和已经安装好的vue-router；
- Vue.use(Router)使用路由，把路由配置项作为参数放到 new Router()中，并导出；
- 在mian.js引入导出的router，在new Vue中添加router配置项，这个是负责全局挂载$router；

## 动态路由匹配

用途：我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

```js
{
    path: '/user/:id',
    component: () => import('../views/Detail.vue')
}
// 根据不同的id来显示不同的参数详情
```





## 通配符

适合做404页面路由，记得放在最后。**（PS.动态路由时，记得动态添加通配符404页面，不要在固定路由中添加）**

```js
{
    // 会匹配所有路劲
    path: '*',
    component: () => import('../views/404.vue')
}
```



## 编程导航（push实现原理？？）

借助 router 的实例方法，可编写代码来实现编程式导航

`router.push(location, onComplete?, onAbort?)`

```js
// 字符串
router.push('home')
// 对象
router.push({ path: 'home' })
// 命名的路由
router.push({ name: 'user', params: { userId: '123' }})
// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})

```

### $route、$router

**$route、$router的区别；this.$route中的传参问题**

+ $router为`VueRouter`的实例，通过`Vue.use(VueRouter)`和`Vue构造函数`得到的router的实例对象，它是一个 **全局的对象** ；以history模式来举个例子：
  + `$router.push({path: 'home'}) ` 的本质是向 `history` 栈中添加一个路由，我们看到的是路由的切换，本质是添加一个 `history` 记录；
  + `$router.replace({path:'home'})`，替换路由，没有历史记录
+ $route为当前router跳转的路由对象，每一个路由都会有一个$route对象，他是一个 **局部的对象** ，里面可以获取`name、path、query、params`等；



### 关于this.$route传参：

```js
//query传参
this.$router.push({		
    path: '/...'
    query: { id:id }
})
//接收
this.$route.query.id
```

```
//params传参
this.$router.push({
	name: '...',
	params: { id: id }
})
//接收
this.$route.params.id
```

> query要用path来引入，接收参数都是`this.$route.query.name`；query类似于`ajax`中get传参，即在浏览器地址栏中显示参数（刷新后还在）。
>
> `params`要用name来引入，接收参数都是`this.$route.params.name`。`params`则类似于post，即在浏览器地址栏中不显示参数（刷新后消失）。



# 2、进阶

## 路由守卫

路由跳转的时候进行一个守卫，有：全局守卫、单个路由独享守卫、组件守卫

### 全局守卫

- 路由前置守卫

```js
router.beforeEach((to, from, next) => {
    // ...
    // to: Route: 即将要进入的目标 路由对象
    // from: Route: 当前导航正要离开的路由
    // next: Function: 一定要调用该方法来 resolve 这个钩子。
    if (to.meta.auth) {
        if (window.isLogin) {
            next()
        } else {
            next('/login?redirect='+to.fullPath)
        }
    } else {
        next()
    }
})
```

- 路由解析守卫

  > 和路由前置守卫类似，区别事在导航被确认之前，同事在所有组件内守卫和异步路由组件被解析之后，才调用解析守卫。

- 路由后置钩子

  > 后置钩子不会接受 next  函数，也不会改变导航本身

  ```js
  router.afterEach((to, from) => {
      // ...
  })
  ```

  

### 路由独享的守卫

可以路由配置上直接定义 `beforeEnter `守卫：

```js
{
    path: '/about',
        name: 'about',
            // ...
            beforeEnter(to, from, next) {
            if (to.meta.auth) {
                if (window.isLogin) {
                    next()
                } else {
                    next('/login?redirect=' + to.fullPath)
                }
            } else {
                next()
            }
        }
},
```

### 组件内守卫

可以在路由组件内直接定义以下路由导航守卫：

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```js
// About.vue
beforeRouteEnter(to, from, next) {
    if (window.isLogin) {
        next();
    } else {
        next("/login?redirect=" + to.fullPath);
    }
}
```



## 复用组件——数据获取

路由激活时，获取数据的时机有两个：

- 路由导航前

```js
// 组件未渲染，通过给next传递回调访问组件实例
beforeRouteEnter (to, from, next) {
    getPost(to.params.id, post => {
        next(vm => vm.setData(post))
    })
},
// 组件已渲染，可以访问this直接赋值
beforeRouteUpdate (to, from, next) {
    this.post = null
    getPost(to.params.id, post => {
        this.setData(post)
        next()
    })
}
```



- 路由导航后

```js
created () {
	this.fetchData()
},
watch: {
	'$route': 'fetchData'
}
```



## 动态路由

通过`router.addRoutes(routes)`方式动态添加路由。

举个例子：项目中，需要根据不同的角色的登录，获取不一样的路由，我们可以将有差异的路由进行一个动态路由添加。



## 路由组件缓存

利用`keepalive`做组件缓存，保留组件状态，提高执行效率

```html
<keep-alive include="about">
    <router-view></router-view>
</keep-alive>

```

**注意：这里的about不是路由生命上的name，而是组件上的name。**

>使用include或exclude时要给组件设置name
>
>两个特别的生命周期：activated、deactivated，一个是激活时调用、一个是失活时调用



## 路由懒加载

路由组件的懒加载能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

```js
() => import("../views/About.vue")
```

把组件按组分块

```js
() => import(/* webpackChunkName: "group-about" */ "../views/About.vue")
```



### 懒加载实现原理

**思路：**

延迟加载——>模块分离，怎么分离呢？——>ES6 的动态加载模块——import()——>chunk——>注释webpackChunkName——>借助function。



**细讲：**

​		懒加载在加载js模块的时候，按需加载，在调用的时候，才加载js模块，这就需要对懒加载模块进行延迟加载的操作。但由于webpack打包出来的文件并不能指定哪个一个子组件在指定的哪个js文件中，很有可能是混在一起的，这样的话，加载js文件就会把所有的组件给加载出来，不能达到按需加载。所以我们需要把懒加载的子组件单独分离出来，怎么分离呢？

​		在ES6 中提供的动态模块加载 `import()` 方法可以实现，使用 `import()` 导入的模块在webpack打包的时候，可以配置webpack的chunk，打包成children chunk，（ps. 我们在懒加载引入路由的时在import中加入的注释“webpackChunkName： 'XXX' ”，webpack会将名字相同的打包到同一个异步块中）。

​		单独打包完成后，当我们调用到改子组件，得正确的加载他，这时候就得把刚刚加载进去的组件转化成函数的形式，当我们要加载的时候，调用该方法，即可加载，从而实现懒加载的目的。



**总结：**

1. 将需要进行懒加载的子模块打包成独立的文件（children chunk）；
2. 借助函数来实现延迟执行子模块的加载代码；

这里的技术难点就是 `如何将懒加载的子模块打包成独立的文件` 。好在`ES6`提供了`import()`。然后这一切就变得十分简单了。





# 3、原理实现

## 基本原理

​	**总结：**vut-router的原理就是当网页的URL变化时，**仅更新视图而不重新刷新页面** 。

​		当浏览器地址发生变化时，在不刷新页面的基础上，对页面上的DOM进行更新，URL发生变化，内容不刷新。在vue-router中有3种方式：

- 一是hash的方式，通过监听浏览器的api中单hashChange，根据路由和路由表就行匹配，将匹配到的路由表中的component渲染出来。渲染到 `router-view` 组件中。动态的根据路由地址的变化，将对应的component渲染到 `router-view` 组件中；当我们调用push时，把新路由添加到浏览器访问历史的栈顶 ；replace方法，把浏览器访问历史的栈顶路由替换成新的路由。

  

- 第二种是history方式，监听popstate，是基于浏览器的history API，动态监听浏览历史栈的修改；



- 第三种是abstract模式， 不涉及和浏览器地址相关的记录。流程跟hash模式一样，通过数组维护模拟浏览器的历史记录栈。通常在服务端下使用，使用一个不依赖于浏览器的浏览历史虚拟管理后台。

​		



## 部分源码实现

- 作为一个插件的存在，如何实现VueRouter类和install方法；就是如何全局注册$router;(映射路由表)
- 实现两个全局组件：router-view用于显示匹配组件的内容，router-link用于跳转；
- 监听URL的变化：监听hashChange或popstate事件；
- 响应最新的URL：创建一个响应式的属性current，当它改变时获取对应组件并显示；（Vue.util.defineReactive）
- 路由嵌套问题，子路由；

