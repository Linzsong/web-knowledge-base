# vue组件通信

## 01. props

```vue
// 父组件——>子组件

// 父组件
<fater  title=”title” />
// 子组件
{ props: ['title'] }
```

```vue
// 子组件——>父组件

// 子组件
this.$emit('goodFunc', goods)
// 父组件
<father @goodFunc="goodFunc(goods)" />
```



## 02. 自定义事件

```vue
// 子组件——>父组件
// 子组件
this.$emit('add', good)

// 父组件
<Cart @add="cartAdd($event)"> </Cart>
```

## 03. 事件总线

任意两个组件之间传值常用事件`总线` 或 `vuex` 的方式 （发布订阅模式）

```js
// Bus：事件派发、监听和回调管理
class Bus {
    constructor(){
        this.callbacks = {}
    }
    $on(name, fn){
        this.callbacks[name] = this.callbacks[name] || []
        this.callbacks[name].push(fn)
    }
    $emit(name, args){
        if(this.callbacks[name]){
            this.callbacks[name].forEach(cb => cb(args))
        }
    }
}
// main.js
Vue.prototype.$bus = new Bus()

// child1
this.$bus.$on('foo', handle)
// child2
this.$bus.$emit('foo')


```

> 实践中通常用 `Vue `代替 `Bus`，因为 `Vue` 已经实现了相应接口。



## 04. Vuex

创建唯一的全局数据管理者store，通过它管理数据并通知组件状态变更。

**`Vuex` 方法是最优解决方法，只有在封装插件中，才会使用到其他原生方法。**



## 05. $parent/$root

兄弟组件之间通信可通过共同祖辈搭桥，$parent或$root。

```js
// brother1
this.$parent.$on('foo', handle)
// brother2
this.$parent.$emit('foo')

```



## 06. provide/inject

能够实现祖先和后代之间传值

```js
// ancestor(祖先)
provide() {
    return {foo: 'foo'}
}

// descendant(后代)
inject: ['foo']

```



# v-model 语法糖原理

## 01. 基础

- 绑定数据value；

- 触发输入事件input；

```vue
<template>
	<div id="app">
    {{username}} <br/>
    	<input type="text" :value="username" @input="username = $event.target.value" />
    </div>
</template>
<script>
    export default {
        name: 'App',
        data(){
            return {
                username:''
            }
        }

    }
</script>
```

**在组件中，（如`elementUI`等）通过双向绑定来封装组件**

```vue
// 子组件
<input :type="type" :value="value" @input="onInput"/>
...
onInput(e) {
	this.$emit('input', e.target.value)
}

// 父组件
<MyInput type="text" :value="value" @input="value=$event" />

```

## 02. v-model-自定义组件

在自定义组件中使用 `v-model` ，**默认**会利用名为 `value` 的 prop 和名为 `input` 的事件；

```vue
// 父组件
<father-com v-model="value"></father-com>

// 子组件
<childen-com @input="changeValue"></childen-com>
...
props: ['value']
method: {
	changeValue() {
		// 这里就可以修改到父组件中的value值
		this.$emit('input', newValue)
	}
}
```

但默认的名称和prop用起来不太方便，我们也可以自己进行定义

```vue
<!-- 父组件 -->
<template>
	<div>
        <childen-com v-model="fatherData"></childen-com>
    </div>
</template>
<script>
export default {
	data() {
        return {
            fatherData: '$100'
        }
    }
}
</script>
```

```vue
<!-- 子组件 -->
<template>
	<div>
     	子组件，修改父组件的值
      	<button @click="changeMoneyFunc">点击修改</button>
    </div>
</template>
<script>
export default {
  props: {
    childMoney: string
  },
  model: {
    prop: 'childMoney',
    event: 'changMoney'
  },
  methods: {
    changeMoneyFunc() {
      this.$emit('changMoney', '$9999');
    }
  }
}
</script>
```





# watch 和 computed

computed 的特点：

- 有缓存性，计算所得的值没有变化，则不会执行，性能较好；
- 比较简洁；
- 首次加载的时候就会计算；
- 适用场景：某个值的结果由多个值所计算得出的，受多个值的影响；



watch 的特点：

- 普通的watch首次不运行，只有在watch的值发生变化的时候才运行；需要首次运行则使用 `immediate: true` 属性；
- 适用场景：某个值得变化会影响其他多个值；

一个官方的好例子：[地址](https://cn.vuejs.org/v2/guide/computed.html)



# 生命周期重新理解

**created**：组件已经创建，但未挂载，DOM元素不存在，就是虚拟DOM还没有转化成真是的DOM元素；

**mounted**： 已挂载，将虚拟DOM转化为真是DOM；



组件的生命周期过程：

- 组件初始化时会触发beforeCreate、created、beforeMount、mounted;

- 组件更行时会触发beforeUpdate，updated；

- 组建销毁前会触发beforeDestroy、destroyed



# sync的使用

使用场景：在组件封装时，父组件传输的prop值，在触发子组件的事件后，需要被修改，但因为组件的封装强调“单向数据流”，父组件的值，只能有父组件来修改，则就有了：

```vue
<!-- 父组件 -->
<template>
	<div>
      <my-message :show="isShow" @close="isShow=$event"></my-message>
    </div>
</template>
```

```vue
<!-- 子组件 my-message -->
<template>
	<div v-if="show">
      <span @click="$emit('close', false)"></span>
    </div>
</template>
```

这样的写法，十分啰嗦。我们可以用.sync来修饰。

```vue
<!-- 父组件 -->
<template>	
	<div>
      <my-message :show.sync="isShow"></my-message>
    </div>
</template>
```

```vue
<!-- 子组件 my-message -->
<template>
	<div v-if="show">
      <span @click="$emit('update:show', false)"></span>
    </div>
</template>
```



# Vue组件化的理解

组件化是Vue的精髓，Vue应用就是由一个个组件构成的。Vue的组件化涉及到的内容非常多，当面试时被问到：谈一下你对Vue组件化的理解。这时候有可能无从下手，可以从以下几点进行阐述：

**定义**：组件是可**复用的 Vue 实例**，准确讲它们是VueComponent的实例，继承自Vue。

**优点**：从上面案例可以看出组件化可以增加代码的复用性、可维护性和可测试性（使代码内聚，简洁）。

**使用场景**：什么时候使用组件？以下分类可作为参考：

- 通用组件：实现最基本的功能，具有通用性、复用性，例如按钮组件、输入框组件、布局组件等。
- 业务组件：它们完成具体业务，具有一定的复用性，例如登录组件、轮播图组件。
- 页面组件：组织应用各部分独立内容，需要时在不同页面组件间切换，例如列表页、详情页组件。

**如何使用组件**

- 定义：Vue.component()，components选项，sfc；
- 分类：有状态组件，functional（无状态组件），abstract（抽象组件）；
- 通信：props，$emit()/$on()，provide/inject，$children/$parent/$root/$attrs/$listeners；
- 内容分发：`<slot>`，`<template>`，`v-slot`；
- 使用及优化：is，keep-alive，异步组件；

**组件的本质**
vue中的组件经历如下过程
组件配置 => VueComponent实例 => render() => Virtual DOM=> DOM
所以**组件的本质是产生虚拟DOM**



# 重要的API

## 数据API

### Vue.set/vm.$set

是用来弥补vue中的不足，因为vue中单数据侦测是通过definedProperty来完成的，而在ES6之前，js没有源编程能力，不能监听到对象新增\删除的属性。所以才需要Vue.set的引入。

 **作用：**向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且**触发视图更新**。

**使用方法：**`Vue.set(target, propertyName/index, value)`，例子如下：

```js
// 如我们新增的值为person中的name属性
this.$set(person, 'name', '王小明')
```

### Vue.delete/vm.$delete

删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。
使用方法： `Vue.delete(target, propertyName/index)`

## 事件相关API

### vm.$on ()

事件监听API

### vm.$emit

事件触发API

### vm.$once
监听一个自定义事件，但是只触发一次。一旦触发之后，监听器就会被移除

### vm.$off
移除自定义事件监听器。

- 如果没有提供参数，则移除所有的事件监听器；
- 如果只提供了事件，则移除该事件所有的监听器；
- 如果同时提供了事件与回调，则只移除这个回调的监听器。

```js
vm.$off() // 移除所有的事件监听器
vm.$off('test') // 移除该事件所有的监听器
vm.$off('test', callback) // 只移除这个回调的监听器
```



### vm.$attrs

将父组件的属性设置到添加了`v-bind="$attrs"`子组件上（除了prop传递的属性、class和style），封装高阶组件的时候有用；

### vm.$listeners

把父组件上的所有 `v-on`  事件绑定到添加了 `v-on="$listeners"`的子组件上（除了`.native` 修饰器）



## 典型应用：事件总线

通过在Vue原型上添加一个Vue实例作为事件总线，实现组件间相互通信，而且不受组件间关系的影响。

```js
Vue.prototype.$bus = new Vue();
```

>这样做可以在任意组件中使用 this.$bus 访问到该Vue实例



# 过度&动画

Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。 包括以下工具：

- 在 CSS 过渡和动画中自动应用 class;
- 可以配合使用第三方 CSS 动画库，如 Animate.css;
- 在过渡钩子函数中使用 JavaScript 直接操作 DOM;
- 可以配合使用第三方 JavaScript 动画库，如 Velocity.js;

（详细使用方式可以结合官方文档和\web全栈开发课程\01.vue\vue预习\资料\Vue预习课08：动画）



# 自定义指令

就像是v-model、v-show等指令一样，我们也可以定义自己的指令；

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

如果想注册局部指令，组件中也接受一个 `directives` 的选项：

```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}
```

有五种钩子函数：

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置；
- inserted：被绑定元素插入父节点时调用 ；
- update：所在组件的 VNode 更新时调用；
- componentUpdated：指令所在组件的 VNode **及其子 VNode** 全部更新后调用；
- unbind： 只调用一次，指令与元素解绑时调用；

钩子函数参数：

- `el`：指令所绑定的元素，可以用来直接操作 DOM。
- `binding`：一个对象，包含以下 property：
  - `name`：指令名，不包括 `v-` 前缀。
  - `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  - `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  - `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  - `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。
- `vnode`：Vue 编译生成的虚拟节点。
- `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。



更多的请阅读官方文档。



# 渲染函数

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML。然而在一些场景中，你真的需要 JavaScript 的完全编程的能力。这时你可以用渲染函数，它比模板更接近编译器。

基础：

```js
render: function (createElement) {
    // createElement函数返回结果是VNode（虚拟DOM）
    return createElement(
        tag, // 标签名称
        data, // 传递数据
        children // 子节点数组
    )
}

```

范例：用render实现heading组件

```js
Vue.component('heading', {
    props: ['level', 'title'],
    render(h) {
        return h(
            'h' + level,	 // 标签名称
            { attrs: { title: this.title } }, // 之前省略了title的处理
            this.$slots.default	// 子节点数组
        )
    }
})

/*
** 使用
	<heading :level="1" :title="title">{{title}}</heading>
*/

```

**render()函数一定要返回一个VNode,第三个参数一定要是数组**



# 混入（mixin）

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

```js
// 定义一个混入对象
var myMixin = {
    created: function () {
        this.hello()
    },
    methods: {
        hello: function () {
            console.log('hello from mixin!')
        }
    }
}
// 定义一个使用混入对象的组件
Vue.component('comp', {
    mixins: [myMixin]
})

```

混入参数合并规则：

- 数据对象（data、prop）递归合并，优先级：**组件内** > **混入**；
- 钩子函数（create、mounted）同名的合并，先调用 **混入钩子函数** 再调用  **自身钩子函数**；
- 值为对象的选项（methods、components、directives）合并覆盖，优先级：**组件内** > **混入**；



# 插件

> 插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：
>
> 1. 添加全局方法或者 property。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)
> 2. 添加全局资源：指令/过滤器/过渡等。如 [vue-touch](https://github.com/vuejs/vue-touch)
> 3. 通过全局混入来添加一些组件选项。如 [vue-router](https://github.com/vuejs/vue-router)
> 4. 添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。
> 5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)

## 插件声明

Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象：

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

范例：修改heading组件为插件

```js
const MyPlugin = {
    install (Vue, options) {
        Vue.component('heading', {...})
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyPlugin)
}
```

## 插件使用

```js
Vue.use(MyPlugin)
```



# SPA 和 SSR

- SPA：Single Page Application（单页面应用）

- SSR：Server-Side Rendering  （服务端渲染）



# nextTick()原理

- vue用异步队列的方式来控制DOM更新和nextTick回调先后执行；
- microtask（微队列）因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕；
  - 源码中老版本有用到MutationObserve这个HTML5新增的API，vue用MutationObserver是想利用它的microtask特性，而不是想做DOM监听。核心是microtask，用不用MutationObserver都行的。事实上，vue在2.5版本中已经删去了MutationObserver相关的代码，因为它是HTML5新增的特性，在iOS上尚有bug。
  - 后面改用了Promise，而Promise是ES6 的，也存在兼容性问题，所以就做了一个降级处理的一个策略
- 因为兼容性问题，vue不得不做了microtask向macrotask（宏队列）的降级方案；
  - 在vue2.5的源码中，macrotask降级的方案依次是：setImmediate、MessageChannel、setTimeout.
    setImmediate是最理想的方案了，可惜的是只有IE和nodejs支持。
  - 它有执行延迟，可能造成多次渲染；



# Vue组件data为什么必须是个函数

- VUE组件可能存在多个实例，如果使用对象形式来定义data，则会导致他们公用一个data对象，那么状态变更将会影响所有组件实例，不太合理；
- 采用函数形式定义，在initData时会将其作为工厂函数返回全新的data对象，有效的避免多个实例之间的状态污染问题；
- 而Vue根实例创建过程中则不存在改限制，也是因为根实例只能有一个，不需要担心这种情况；