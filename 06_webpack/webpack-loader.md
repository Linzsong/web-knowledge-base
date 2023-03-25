# loader

- 所谓loader只是一个导出为函数的JavaScript模块。它接收上一个loader产生的结果或者资源文件(resource file)作为入参。也可以用多个loader函数组成loader chain;

- compiler 需要得到最后一个loader产生的处理结果。这个处理结果应该是String或者Buffer(被转换为一个string)

## 1. loader 运行的总体流程

loader在**编译模块**进行工作：

从入口文件出发，调用所有配置的Loader对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；


## 2. loader类型
|类型|名称|loader叠加顺序|
|------|------|------|
|后置loader|post-loader|1|
|内联loader|inline-loader|2|
|普通loader|normal-loader|3|
|前置loader|pre-loader|4|


loader 的执行顺序： (loader-runner执行决定)
- 从右向左
- 从下往上

**Question:** 为什么要分成四种loader？
因为loader的配置是分散的，它可能由多个配置文件合并而来；
```javascript
rules: [
  {
    test: '/\.js$/',
    use: []
  }
]

```


## 1.3 loader-runner
- loader-runner 是一个执行loader链条的模块