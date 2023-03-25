// new Vue()
class Vue {
    constructor(options) {
        //缓存options
        this.$options = options;            

        //数据响应化
        this.$data = options.data
        this.observe(this.$data)

        new Compile(options.el, this)

        // 执行created钩子函数
        if(options.created) {
            options.created.call(this);     //改变this指向，使得this指向data
        }

    }


    observe(object) {
        if(!object || typeof object !== 'object') {
            return;
        }

        //遍历该对象
        Object.keys(object).forEach(key => {
            //有多少个key,定义多少给set、get
            this.defineReactive(object, key, object[key])

            //代理data中的属性到vue实例上
            this.proxyData(key);
        })
    }

    //数据响应化
    defineReactive(obj, key, val) {
        this.observe(val);      //递归解决date数据的嵌套问题

        const dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                // console.log('11111111111调用defineReactive的get')
                // console.log('Dep', Dep)
                Dep.target && dep.addDep(Dep.target)
                return val
            },
            set(newVal) {
                // console.log('22222222222调用defineReactive的set')
                if(newVal === val) {
                    return;
                }
                val = newVal;
                console.log(`${key} is change, value is : ${val}`);      //更新值日志
                dep.notify();
            }
        })

    }
    
    //代理工作      理data中的属性到vue实例上
    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                // console.log('3333333333调用proxyData的get')
                return this.$data[key];
            },
            set(newVal) {
                // console.log('4444444444调用proxyData的set')
                this.$data[key] = newVal;
            },
        })
    }
}

//Dep: 用来管理Watcher
class Dep {
    constructor() {
        //这里存放若干依赖（watcher）   一个watcher对应一个 属性
        this.deps = [];
    }

    //添加依赖
    addDep(dep) {
        this.deps.push(dep)
    }

    //通知所有依赖做更新
    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

//Watcher
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        //将当前Watcher实例指定到Dep静态属性target
        Dep.target = this
        // console.log('keykeykey', key, this.vm[this.key])
        this.vm[this.key];    //触发getter，添加依赖
        Dep.target = null;
    }

    update() {
        console.log('数据更新了')
        // console.log(this.cb)
        this.cb.call(this.vm, this.vm[this.key]); 
    }
}