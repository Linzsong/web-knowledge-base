## Vuex学习之旅

[TOC]

### 01 Vuex基本概述

#### 1、vuex是什么？

vuex是一个vue.js的状态管理模式

用于解决**多个组件共享状态**时，会破坏单项数据流问题



#### 2、安装vuex

```
npm install vuex --save
```

在src目录下新建store文件夹，在该文件夹中新建store.js文件

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
 
export default new Vuex.Store({
  state:{
    count:0
  },
  mutations:{
    increment:state => state.count ++,
    decrement:state => state.count --,
  }
})
```

在main.js中导入

```js
import store from './store/store'
//实例化 store
new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,         
  router,
  template: '<App/>',
  components: { App }
})
```

通过在根实例中注册 `store` ， `store` 就会注入到所以的子组件中，我们可以通过 `this.$store` 来访问它。

### 02 State

在子组件中使用 `this.$store.count` 一般放在计算属性中，这样外部的状态发生改变时，子组件的状态才好同步更新。

在store.js中定义状态count

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 0,
    },
});
export default store
```

在HelloWorld.vue中调用count状态

```vue
<template>
  <div class="hello">
      <h2>{{count}}</h2>
    </div>
</template>
<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {}
    },
    computed: {
      count() {
        return this.$store.state.count
      }
    },
  }
</script>
```



### 03 Getter

可以理解为store中的计算属性（computed）

就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

```JS
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 0,
        date: new Date()
    },
    getters: {
        yearDate: state => {	//一个参数
            return state.date.getFullYear() + ' 年'
        },
        yearMonthDate: (state, getters) => {		//两个参数
            let month = state.date.getMonth() + 1
            return getters.yearDate + month + ' 月'
        }
 
    },
});
export default store
```

+ 可以接受两个参数 `state` 、 `getters` 
+ 在vue组件中，可以通过获取 `store.getters   `  对象的形式来访问这些值

```js
computed: {
    yearDate () {
    return this.$store.getters.yearDate
    }
}
```

+ getters就像计算属性，如果要给它传递自定义参数，可以通过闭包传参的方式，和computer属性的参数一样

```jsx
getters: {
  // 返回一个函数，就可以传参了
  weekDate: (state) => (fm) => {
    return moment(state.date).format(fm ? fm : 'dddd'); 
  }
}
-----------------------------------------
store.getters.weekDate('MM Do YY')
```



### 04 Mutation

#### 1、基本

注意： **只要mutation能动store**

改变store中状态的唯一方法就是提交mutation，类似于“事件”。每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方。

并且它会接受 state 作为第一个参数。

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    // 事件类型 type 为 increment
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```

Vuex规定通过 `store.commit` 方法来调用对应的type方法：

```js
store.commit('increment')
```



#### 2、载荷（payload）

大白话：就是mutation中传递的额外参数，官方语言：【提交荷载】

```js
mutations: {
  increment (state, n) {
    state.count += n
  }
}

// 调用
store.commit('increment', 10)
```

#### 3、提交方式

```js
// 1、把载荷和type分开提交
store.commit('increment', {
  amount: 10
})

// 2、整个对象都作为载荷传给 mutation 函数
store.commit({
  type: 'increment',
  amount: 10
})
```

#### 4、修改规则

eg.

```js
const store = new Vuex.Store({
  state: {
    student: {
      name: '小明',
      sex: '女'
    }
  }
})
```

动态新增store中对象属性

```csharp
mutations: {
  addAge (state) {
    Vue.set(state.student, 'age', 18)
    // 或者：
    // state.student = { ...state.student, age: 18 }
  }
}
```

以上就是给对象添加属性的两种方式，当然，对于已添加的对象，如果想修改具体值的话，直接更改就是，比如 `state.student.age=20` 即可。

这样修改的原因：

至于为什么要这样，之前我们了解过，因为 store 中的状态是响应式的，当我们更改状态数据的时候，监视状态的 Vue 组件也会自动更新，所以 Vuex 中的 mutation 也需要与使用 Vue 一样遵守这些规则。

#### 5、使用常量

就是使用常量来替代 mutation 事件的名字。

![image-20200629165350496](C:\Users\Administrator\Desktop\Flutter\image-20200629165350496.png)

```
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { count：0, date: '' },
  mutations: {
    // 使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state, date) {
        state.count++
        state.date = date
    }
  }
})
```

在子组件中调用

```vue
<script>
  import * as mutationTypes from '@/store/mutation-types'

  export default {
    name: 'HelloWorld',
    data() {
      return {}
    },
    methods: {
      addFunc() {
        this.$store.commit(mutationTypes.SOME_MUTATION, 'abc');
      },
    },
  }
</script>
```

可能有人会有疑问啊，这样做到底有啥用，还得多创建个类型文件，用的时候还要导入进来，不嫌麻烦吗！

我们看看，mutation 是怎么调用的：`store.commit('increment')`，可以发现，这里 commit 提交的方法 `increment`，是以字符串的形式代入的。如果项目小，一个人开发的话倒还好，但是项目大了，编写代码的人多了，那就麻烦了，因为需要 commit 的方法一多，就会显得特别混乱，而且以字符串形式代入的话，一旦出了错，很难排查。

所以，对于多人合作的大项目，最好还是用常量的形式来处理 mutation，对于小项目倒是无所谓，想偷懒的随意就好。

#### 6、同步函数

**Mutation** 中的函数必须是同步函数

原因：

我们之所以要通过提交 mutation 的方式来改变状态数据，是因为我们想要更明确地追踪到状态的变化。如果像下面这样异步的话，我们就不知道什么时候状态会发生改变，所以也就无法追踪了，这与 Mutation 的设计初心相悖，所以强制规定它必须是同步函数。



### 05 Action

#### 1、简单介绍

mutation中必须是同步函数，而如果需要异步函数，就该Action上场表演了

> Action 类似于 mutation，不同在于：
>
> 1、Action 提交的是 mutation，而不是直接变更状态。
> 2、Action 可以包含任意异步操作。

简单的demo：

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 0,
    },
    mutations: {
        increment (state) {
            state.count++
        },
    },
    actions: {
        increment (context) {
            context.commit('increment')
        }
    }
});
export default store
```

Action 中的函数接受一个 `context` 参数，注意，这个参数可不一般，它与  `store`  实例有着相同的方法和属性，但是他们并不是同一个实例。

所以在这里可以使用 `context.commit` 来提交一个 mutation，或者通过 `context.state` 和 `context.getters` 来获取 state 和 getters。

当然，为了代码简化，我们可以使用 ES2015 的 [参数解构](https://github.com/lukehoban/es6features#destructuring) 来直接展开，便于 `commit`、`state` 等多次调用。如下：

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

#### 2、分发 Action

```bash
this.$store.dispatch('increment')
```

```jsx
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

和 Mutation 分发的方式异曲同工，这是注意这里是 `dispatch`：

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

来看一个更加实际的购物车示例，涉及到**调用异步 API** 和**分发多重 mutation**：

```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

#### 3、组合 Action

>Action 通过 `store.dispatch` 进行分发，它可以处理被触发的action函数的处理函数返回的Promise，并且`store.dispatch` 仍然返回Promise对象。

eg：

```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

调用：

```jsx
store.dispatch('actionA').then(() => {
  // ...
})
```

也可以这样：

```jsx
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

我们还可以利用 [async / await](https://tc39.github.io/ecmascript-asyncawait/) 的方式组合 action ：

```csharp
// 假设 getData() 和 getOtherData() 返回的是 Promise
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

>一个 `store.dispatch` 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。



### 06 Module

#### 1、为什么要引入Module？

首先还是得先了解下 Module 的背景。我们知道，Vuex 使用的是单一状态树，应用的所有状态会集中到一个对象中。如果项目比较大，那么相应的状态数据肯定就会更多，这样的话，store 对象就会变得相当的臃肿，非常难管理。

这就好比一家公司只有老板一个人来管理一样。如果小公司倒还好，公司要是稍微大一点，那就麻烦了。这个时候，老板就会成立各大部门，并给各大部门安排一个主管，把管理的任务分派下去，然后有什么事情需要处理的话，只需要跟这几个主管沟通，由主管再把任务分配下去就行了，这就大大提高了工作效率，也减轻了老板的负担。

#### 2、module的使用

现在在 `src` 里面建个文件夹，命名为 `module`，然后再里面新建一个 `moduleA.js` 文件，并编写如下代码：

```js
export default {
    state: {
        text: 'moduleA'
    },
    getters: {},
    mutations: {},
    actions: {}
}
```

如上，再建一个 `moduleB.js` 文件，这里就不重复了。

然后打开 `store.js` 文件，导入这两个 module ：

```js
import moduleA from './module/moduleA';
import moduleB from './module/moduleB';

export default new Vuex.Store({
    modules: {
        moduleA, moduleB,
    },
    // ...
}
```

这个时候，store 中已经注入了两个子模块 `moduleA moduleB`，我们可以在 `App.vue` 中通过 `this.$store.state.moduleA.text` 这种方式来直接访问模块中的 state 数据。如下修改：

```js
// ...
computed: {
    ...mapState({
        name: state => state.moduleA.text
    }),
},
// ...
```

由此可知，模块内部的 state 是局部的，只属于模块本身所有，所以外部必须通过对应的模块名进行访问。



**特别注意：**  

模块内的state是注册在局部中的，但是，模块内的action、mutation和getter默认是注册在 **全局命名空间** 的，这样的好处就是可以多个模块能够对同一个 mutation 或 action 做出相应。

eg.

这里以 mutation 的响应为例，给 moduleA 和 moduleB 分别新增一个 mutations，如下：

```js
mutations: {
    setText(state) {
        state.text = 'A'
    }
},
```

moduleB 和上面一样，把文本名称修改一下即可，这里就不重复了。然后回到 `App.vue` 中，修改如下：

```js
<script>
    import {mapState, mapMutations} from 'vuex';
    export default {
        computed: {
            ...mapState({
                name: state => (state.moduleA.text + '和' + state.moduleB.text)
            }),
        },
        methods: {
            ...mapMutations(['setText']),
            modifyNameAction() {
                this.setText();
            }
        },
    }
</script>
```

运行然后点击修改，我们会发现模块 A 和 B 中的 `text` 值都改变了。当然，action 的用法一模一样，大家也可以试试。

如果模块之间的数据有交集的话，那么我们其实就可以通过这种方式，来同步更新模块之间的数据，虽然看起来非常的方便，但是用的时候可一定要谨慎，这种处理方式一旦没用好，遇到错误，排查起来还是比较有难度的。



#### 3、访问根节点

我们已经知晓，模块内部的 state 是局部的，只属于模块本身所有。那么如果我们要想在模块中访问 store 根节点的数据 state，怎么办呢？

很简单，我们可以在模块内部的 getter 和 action 中，通过 rootState 这个参数来获取。接下来，我们给 `modelA.js` 文件添加一点代码。

```js
export default {
    // ...
    getters: {
        // 注意:rootState必须是第三个参数
        detail(state, getters, rootState) {
            return state.text + '-' + rootState.name;
        }
    },
    actions: {
        callAction({state, rootState}) {
            alert(state.text + '-' + rootState.name);
        }
    }
}
```

然后修改 `App.vue` ：

```js
<script>
    import {mapActions, mapGetters} from 'vuex';
    export default {
        computed: {
            ...mapGetters({
                name: 'detail'
            }),
        },
        methods: {
            ...mapActions(['callAction']),
            modifyNameAction() {
                this.callAction();
            }
        },
    }
</script>
```

运行你会发现，根节点的数据已经被我们获取到了。这里需要注意的是在 getters 中，rootState 是以第三个参数暴露出来的，另外，还有第四个参数 rootGetters，用来获得根节点的 getters 信息，这里就不演示了，感兴趣自己可以去尝试。唯一要强调的就是千万不要弄错参数的位置了。

当然，action 中也能接收到 rootGetters，但是在 action 中，由于它接收过来的数据都被包在 `context` 对象中的，所以解包出来没有什么顺序的限制。

#### 4、命名空间

前面我们已经知道了，模块内部的 action、mutation 和 getter 默认是注册在全局命名空间的。如果我们只想让他们在当前的模块中生效，应该怎么办呢？

**通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。**当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

我们在 `moduleA.js` 中添加 `namespaced: true`。

```js
export default {
    namespaced: true,
    // ...
}
```

这时候在全局中调用moduleA.js中的getter，就会出现报错。在全局getter中已经找不到moduleA.js中的getter。因为他的路劲已经变了。如果我们需要访问他，必须带上路劲才行。如下`APp.vue` ：

```js
<script>
    import {mapActions, mapGetters} from 'vuex';
    export default {
        computed: {
            ...mapGetters({
                name: 'moduleA/detail'
            }),
        },
        methods: {
            ...mapActions({
                call: 'moduleA/callAction'
            }),
            modifyNameAction() {
                this.call();
            }
        },
    }
</script>
```

注意，如果一个模块启用了命名空间，那么它里面的 getter 和 action 中收到的 getter，dispatch 和 commit 也都是局部化的，不需要在同一模块内额外添加空间名前缀。也就是说，更改 `namespaced` 属性后不需要修改模块内的任何代码。



**那么问题来了，我们如何在带命名空间的模块内访问全局的内容呢？**

通过前面的学习，我们已经了解到：

>如果你希望使用全局 state 和 getter，rootState 和 rootGetter 会作为第三和第四参数传入 getter，也会通过 context 对象的属性传入 action。

现在如果想要在全局命名空间内分发 action 或提交 mutation 的话，那么我们只需要将 将 `{ root: true }` 作为第三参数传给 dispatch 或 commit 即可。

```js
export default {
    namespaced: true,
    // ...
    actions: {
        callAction({state, commit, rootState}) {
            commit('setName', '改变', {root: true});
            alert(state.text + '-' + rootState.name);
        }
    }
}
```



**如何在命名空间的模块内注册全局action呢？**

>
>
>若需要在带命名空间的模块注册全局 action，你可添加 `root: true`，并将这个 action 的定义放在函数 handler 中。
>
>

写法稍微有点变化，我们来看看，修改 `moduleA.js`，如下：

```js
export default {
    namespaced: true,
    // ...
    actions: {
        callAction: {
            root: true,
            handler (namespacedContext, payload) {
                let {state, commit} = namespacedContext;
                commit('setText');
                alert(state.text);
            }
        }
    }
}
```

简单解释下，这里的 `namespacedContext` 就相当于当前模块的上下文对象，`payload` 是调用的时候所传入的参数，当然也叫载荷。



**那么命名空间如何绑定函数呢？**

关于 `mapState, mapGetters, mapActions` 和 `mapMutations` 这些函数如何来绑定带命名空间的模块，上面示例代码中其实已经都写过了，这里再看看另外几种更简便的写法，先看看之前的写法。

这里就用官方的示例代码举例说明：

```js
computed: {
    ...mapState({
        a: state => state.some.nested.module.a,
        b: state => state.some.nested.module.b
    })
},
methods: {
    ...mapActions([
        // -> this['some/nested/module/foo']()
        'some/nested/module/foo', 
        // -> this['some/nested/module/bar']()
        'some/nested/module/bar' 
    ])
}
```

更加优雅的写法：

```js
computed: {
    ...mapState('some/nested/module', {
        a: state => state.a,
        b: state => state.b
    })
},
methods: {
    ...mapActions('some/nested/module', [
        'foo', // -> this.foo()
        'bar' // -> this.bar()
    ])
}
```

将模块的空间名称字符串作为第一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。

>
>
>我们还可以通过使用 `createNamespacedHelpers` 创建基于某个命名空间辅助函数。它返回一个对象，对象里有新的绑定在给定命名空间值上的组件绑定辅助函数：
>
>

```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState({
      a: state => state.a,
      b: state => state.b
    })
  },
  methods: {
    // 在 `some/nested/module` 中查找
    ...mapActions([
      'foo',
      'bar'
    ])
  }
}
```



#### 5、模块的动态注册

这一章节，官网讲得比较清楚，所以直接搬过来了。

> 在 store 创建之后，可以使用 `store.registerModule` 方法动态的注册模块：

```js
// 注册模块 `myModule`
store.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

> 之后就可以通过 `store.state.myModule` 和 `store.state.nested.myModule` 访问模块的状态。
>
> 模块动态注册功能使得其他 Vue 插件可以通过在 store 中附加新模块的方式来使用 Vuex 管理状态。例如，[`vuex-router-sync`](https://github.com/vuejs/vuex-router-sync) 插件就是通过动态注册模块将 vue-router 和 vuex 结合在一起，实现应用的路由状态管理。
>
> 你也可以使用 `store.unregisterModule(moduleName)` 来动态卸载模块。注意，你不能使用此方法卸载静态模块（即创建 store 时声明的模块）。
>
> 在注册一个新 module 时，你很有可能想保留过去的 state，例如从一个服务端渲染的应用保留 state。你可以通过 `preserveState` 选项将其归档：`store.registerModule('a', module, { preserveState: true })`。



#### 6、模块重用

就一点，重用会导致模块中的数据 state 被污染，所以和 Vue 中的 data 一样，也使用一个函数来申明 state 即可。

```js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  //...
}
```



### 07 辅助函数

辅助函数是为了解决多个state或多个action时，写起来麻烦的问题，利用映射的思想，将状态和自己取的别名映射起来。

```js
export default {
  ...
  computed: {
      a () {
        return store.state.a
      },
      b () {
        return store.state.b
      },
      c () {
        return store.state.c
      },
      ...
   }
}
```

#### 1、mapState

使用mapState辅助函数后

mapState辅助函数，将$stroe.state直接封装到函数中，使得调用时十分简单，直接this.a 

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    a: state => state.a,
    b: state => state.b,
    c: state => state.c,

    // 传字符串参数 'b',等同于 `state => state.b`
    //this.bAlias 就等于 this.$stroe.state.b ，相当于取了一个别名
    bAlias: 'b',

    // 为了能够使用 `this` 获取局部状态
    // 必须使用常规函数
    cInfo (state) {
      return state.c + this.info
    }
  })
}
```

通过上面的示例，可以了解到，我们可以直接把需要用到的状态全部存放在 `mapState` 里面进行统一管理，而且还可以取别名，做额外的操作等等。

如果所映射的计算属性名称与 state 的子节点名称相同时，我们还可以更加简化，给 `mapState` 传一个字符串数组：

```js
computed: mapState([
  // 映射 this.a 为 store.state.a
  'a',
  'b',
  'c'
])
```

因为 `computed` 这个计算属性接收的是一个对象，所以由上面的示例代码可以看出，`mapState` 函数返回的是一个对象，现在如果想要和局部的计算属性混合使用的话，可以使用 ES6 的语法这样写来大大简化：

```js
computed: {
  localComputed () { 
    ...
  },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```



#### 2、mapGetters

和mapState相似

```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}
```

取个别名，那就用对象的形式，以下示例的意思就是把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`。

```js
mapGetters({
  doneCount: 'doneTodosCount'
})
```



#### 3、mapMutations

和mapState相似，同时也支持荷载（就是传递参数）

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      // 将 `this.increment()` 映射为 ————> `this.$store.commit('increment')`
      'increment', 
      // `mapMutations` 也支持载荷：
      // 将 `this.incrementBy(amount)` 映射为 ----> `this.$store.commit('incrementBy', amount)`
      'incrementBy' 
    ]),
    ...mapMutations({
      // 将 `this.add()` 映射为 ----> `this.$store.commit('increment')`
      add: 'increment' 
    })
  }
}
```



#### 4、mapActions

和 `mapMutations` 用法一模一样，换个名字即可。同时也支持荷载（就是传递参数）

```js
import { mapActions  } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      // 将 `this.increment()` 映射为 ————> `this.$store. dispatch('increment')`
      'increment', 
      // `mapActions` 也支持载荷：
      // 将 `this.incrementBy(amount)` 映射为 ----> `this.$store. dispatch('incrementBy', amount)`
      'incrementBy' 
    ]),
    ...mapActions({
      // 将 `this.add()` 映射为 ----> `this.$store. dispatch('increment')`
      add: 'increment' 
    })
  }
}
```



### Vuex源码理解

Vuex  **集中式** 存储管理应用的所有组件的状态，并以相应的规则保证状态以 **可预测** 的方式发生变化。

集中式管理应用状态，保证状态可预测的发送变化

Store具体实现：

- 创建响应式的state，保存mutations、actions和getters

  - 使用vue的响应式，在data中定义state

  

- 实现commit根据用户传入type执行对应mutation

  - 根据$store.commit(type, payload)方法，确定函数传参”函数类型“和”载荷“；
  - 拿到参数传入（用户定义）的mutations，找到对应的mutations中的type，进行mutation[type]方法的调用，同时传入参数this.state和payload；
  - this实例绑定，需要把commit的上下文绑定为store实例；

  

- 实现dispatch根据用户传入type执行对应action，同时传递上下文

  - 写法和commit类似，不同之处在于 actions 中的函数传入的参数为store实例（一般进行解构使用，add({commit, state, getters}) ）。
  - this实例的绑定，需要把dispatch的上下文绑定为store实例；

  

- 实现getters，按照getters定义对state做派生

  - 与vue中的computed属性相识，因此可以使用computed属性来实习；
  - 关键是如何实现：将有参数的getters封装成没有参数的computed；

  ```js
  // getters	需要带state参数
  getters: {
      doubleCounter(state) {
        return state.counter * 2
      }
  }
  // computed		不带参数
  computed: {
       doubleCounter2() {}
  }
  // 解决问题的方案：
  // 使用高阶函数的封装
  doubleCounter2 = () => {
      return doubleCounter(state)
  }
  ```

  - 最后将getters中的属性设置为只读属性，使用defineProperty() 设置属性的get方法；