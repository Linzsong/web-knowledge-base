class compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    this.compileNode(this.$el)
  }

  compileNode(el) {
    let childNodes = el.childNodes
    childNodes.forEach(node => {
      
      if (this.isElement(node)) {
        // 元素节点
      } else if (this.isInterpolation(node)) {
        // 文本节点
        let reg =  /\{\{\s*(\S*)\s*\}\}/g
        let $1 = RegExp.$1;

        // 更新文本值
        // this.textUpdate(node, this.$vm)
        node.textContent = node.textContent.replace(reg, this.$vm.$options.data[$1])
        
        new watcher(this.$vm, $1, (value)=> {
          node.textContent = value
        })
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this.compileNode(node)    // 节点递归编译
      }
    })
  }


  textUpdate() {

  }




  isElement(node) {     // 元素节点
    return node.nodeType === 1
  }

  isInterpolation(node) {    // 文本节点
    return node.nodeType && /\{\{\s*(\S*)\s*\}\}/g.test(node.textContent)
  }
  
}




/**
 * 使用 EventTarget 自定义事件来做watch，监听数据变化
 *
class compile extends EventTarget {
  constructor(el, vm) {
    super();
    this.$el = document.querySelector(el)
    this.$vm = vm

    this.compileNode(this.$el)
  }

  compileNode(el) {
    let childNodes = el.childNodes
    childNodes.forEach(node => {
      if (node.childNodes.length > 0) {
        this.compileNode(node)
      }
      if (node.nodeType === 1) {
        // 元素节点
      } else if (node.nodeType === 3) {
        // 文本节点
        let reg = /\{\{\s*(\S*)\s*\}\}/g
        let textContent = node.textContent

        if (reg.test(textContent)) {
          let $1 = RegExp.$1;
          node.textContent = node.textContent.replace(reg, this.$vm.$options.data[$1])
          // console.log(this)
          // console.log(this.$vm)
          this.$vm.addEventListener($1, (e) => {
            console.log(e, '事件已触发')
            // 重新渲染视图；
            let oldValue = this.$vm.$options.data[$1];
            let reg = new RegExp(oldValue);
            node.textContent = node.textContent.replace(reg, e.detail)
          }, false)
        }
      }
    })
  }
}
 */