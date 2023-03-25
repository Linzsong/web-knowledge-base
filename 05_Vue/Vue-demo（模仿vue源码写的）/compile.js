// 用法  new Compile(el, vm)

class Compile {
    constructor(el, vm) {
        //需要遍历的宿主节点
        this.$el = document.querySelector(el);
        // console.log('宿主节点已挂载到$el中')
        this.$vm = vm;
        
        //编译
        if(this.$el) {
            //将内部的内容转换为片段Fragment
            this.$fragment = this.node2Fragment(this.$el);
            //执行编译
            this.compile(this.$fragment);
            //将编译完的html结果追加到 $el
            this.$el.appendChild(this.$fragment);
        }
    }

    //将宿主元素中的代码片段拿出来遍历，这样做比较高效，不用直接操作demo树
    node2Fragment(el) {
        // console.log('createDocumentFragment创建虚拟dom节点')
        const frag = document.createDocumentFragment();
        //将el中所有子元素搬家至frag
        let child;
        while(child = el.firstChild) {
            frag.appendChild(child);
        }
        // console.log('子元素节点已完全添加到虚拟DOM节点中:')
        // console.log(frag.childNodes)
        return frag;
    }    

    //编译过程
    compile(el) {
        const childNodes = el.childNodes;

        Array.from(childNodes).forEach(node => {
            //类型判断
            if(this.isElement(node)) {
                //元素
                // console.log('指令解析  ' + node.nodeName)
                //查找 k-, @, : 
                const nodeAtters = node.attributes;
                Array.from(nodeAtters).forEach(attr => {
                    const attrName = attr.name;     //属性名
                    const exp = attr.value;         //属性值
                    if(this.isDirective(attrName)) {
                        // k-text
                        const dir = attrName.substring(2);  //text
                        //执行指令
                        this[dir] && this[dir](node, this.$vm, exp);
                    } 
                    if(this.isEvent(attrName)) {
                        //事件处理
                        const dir = attrName.substring(1);      //@click
                        this.eventHandler(node, this.$vm, exp, dir);
                    }
                })
            } else if (this.isInterpolation(node)) {
                //文本节点
                // console.log('插值绑定  ' + node.nodeName)
                this.compileText(node);
            }

            if(node.childNodes && node.childNodes.length > 0) {     //递归调用，遍历完所有的子节点
                this.compile(node);
            }
        })
    }

    //事件处理器
    eventHandler(node, vm, exp, dir) {
        let fn = vm.$options.methods && vm.$options.methods[exp];
        if(dir && fn) {
            node.addEventListener(dir, fn.bind(vm));
        }
    }
 
    
    compileText(node) {
        // console.log(RegExp.$1);
        // node.textContent = this.$vm.$data[RegExp.$1];
        this.update(node, this.$vm, RegExp.$1, 'text')
    }

    //更新函数
    update(node, vm, exp, dir) {
        const updaterFn = this[dir + 'Updater'];
        //初始化
        updaterFn && updaterFn(node, vm[exp])

        //依赖收集，做数据的动态更新        *****重要***
        new Watcher(vm, exp, (val)=>{
            updaterFn && updaterFn(node, val)
        })

    }

    text(node, vm, exp) {
        this.update(node, vm, exp, 'text')
    }

    textUpdater(node, value) {      //将node中的内容进行替换
        // console.log('old', node.textContent)
        node.textContent = value;
        // console.log('new', node.textContent)
    }

    isElement(node) {
        return node.nodeType === 1
    }

    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    isDirective(attr) {
        return attr.indexOf('k-') == 0;
    }

    isEvent(attr) {
        return attr.indexOf('@') == 0;
    }

    //双向绑定
    model(node, vm, exp) {
        //指定input的value属性
        this.update(node, vm, exp, "model");

        //视图对模型的相应
        node.addEventListener("input", e => {
            vm[exp] = e.target.value
        })
    }

    modelUpdater(node, value) {
        node.value = value;
    }

    //html绑定
    html(node, vm, exp) {
        this.update(node, vm, exp, "html");
    }

    htmlUpdater(node, value) {
        node.innerHTML = value
    }
}