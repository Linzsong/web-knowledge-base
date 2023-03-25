1. 梯形布局如何用CSS实现，且可以实现自适应，如图，左侧梯形自适应，右侧固定；

   使用js进行计算时，需要监听 `resize` 事件，但`resize` 事件在`window` 上，需要进行统一收集和分发处理

   ```js
   window.addEventListener('resize', () => { //监听浏览器窗口大小改变
       //浏览器变化执行动作
   });
   ```

   ![image-20230218192951651](https://raw.githubusercontent.com/Linzsong/oss_img/main/webpack/202302181930136.png)

2. 一个数据文件，需要被commonjs 和 esmodlue 同时引用，该如何处理？

- 使用json格式文件（当一定要使用js文件时，因为里面有模块联邦使用了import）
- 解决上面的问题使用一笨办法，通过 commonjs同步读取js中的内容，然后再进行字符串的正则匹配，在esmodlue 中正常引用；
- 待尝试：使用bable 工具，写一个小插件，对esmodlue 文件进语法上的转换；

