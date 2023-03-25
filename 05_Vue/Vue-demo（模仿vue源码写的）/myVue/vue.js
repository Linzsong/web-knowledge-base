class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data

    this.Observer(options.data);       // 观察者
    new compile(options.el, this);     // 编译

    // 执行created钩子函数
    if (options.created) {
      options.created.call(this);     //改变this指向，使得this指向data
    }


  }

  Observer(data) {
    const dep = new Dep
    // 数据绑定
    this.$data = this.$options.data = new Proxy(data, {
      get(target, key) {
        // 注意这样需要结合编译过程 和 watcher 类 来看
        Dep.target && dep.addDep(Dep.target)
        console.log('get...', dep, Dep.target);
        return target[key];
      },
      set(target, key, value) {
        console.log('set...');
        target[key] = value;
        dep.notify()
        return true;
      }
    })

    // this 代理  ?????? 这里目前还没有实现
    //vue2 可以使用proxy来实现数据绑定吗？如果用vue2实现数据绑定，该如何把this.$data的数据代理到this中呢？
    new Proxy(this, {
      get(target, key) {
        return this.$data[key]
      },
      set(target, key, value) {
        this.$data[key] = value;
        return true;
      }
    })
  }
}


class Dep {
  constructor() {
    this.deps = [];
  }
  // 依赖收集，收集的就是watcher
  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
    // this.deps[2].update()
  }

}

// watcher 是一个中介角色，数据发生变化时通知它，然后它再通知其他地方。
class watcher {
  constructor(vm, key, cb) {
    this.$vm = vm;
    this.key = key;
    this.cb = cb;
    // 将当前 Watcher实例指定到 Dep 静态属性 target
    Dep.target = this;
    // 调用 get ，对该属性的 watcher 进行添加
    vm.$options.data[key];
    // 置空 target 属性，防止影响后面添加 watcher 
    Dep.target = null;
  }
  update() {
    this.cb.call(this.vm, this.$vm.$data[this.key])
    console.log('属性更新了')
  }
}


/**
 * 使用 EventTarget 自定义事件来做watch，监听数据变化
 *
class Vue extends EventTarget {
  constructor(options) {
    super();
    this.$options = options;

    this.Observer(options.data);       // 观察者
    new compile(options.el, this);     // 编译
  }

  Observer(data) {
    let _this = this;
    this.$options.data = new Proxy(data, {
      get(target, key) {
        console.log('get...');
        return target[key];
      },
      set(target, key, value) {
        console.log('set...');
        //自定义事件
        let event = new CustomEvent(key, {
          detail: value
        })
        console.log(_this)
        _this.dispatchEvent(event)
        target[key] = value;
        return true;
      }
    })
  }
}

 */