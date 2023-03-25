### 1、水平垂直布局

在父级中水平垂直居中

+ 行内元素

``` css
line-height: xxxx;
text-align: center;
```

+ （已知宽高） 绝对定位+margin-left+margin-top

```css
.parent {
	width: 100%;
	height: 800px;
	position: relative;
}
.son {
    width:100px;
    height:100px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -50px;
    margin-top: -50px;
}
```

+ （已知宽高）绝对定位+left.top.right.bottom:0+margin:auto

``` css
.parent {
	width: 100%;
	height: 800px;
	position: relative;
}
.son {
    width:100px;
    height:100px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;	/* 水平垂直居中 */
}
```

+ （已知宽高）绝对定位+left:50%,top:50%; transform

``` css
.parent {
	width: 100%;
	height: 800px;
	position: relative;
}
.son {
    width:100px;
    height:100px;
    position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
}
```

+ 弹性布局flex，父元素display: flex; 子元素margin: auto

注意：无法兼容IE9及以下版本。由于代码简单，推荐移动端使用

``` css
.parent {
	width: 500px;
	height: 500px;
	background: #fee;
	display: flex;
}

.son {
	width: 200px;
	height: 200px;
	background: #aa0;
	margin: auto;
}
```

+ flex布局 ，父级`display:flex;align-items:center;justify-content:center;` 

``` css
.parent {
	width: 500px;
	height: 500px;
	background: #fee;
	display: flex;
    flex-direction: row;
	align-items: center;
	justify-content: center;
}

.son {
	/*基本样式*/
	width: 200px;
	height: 200px;
	background: #aa0;
}
```



### 2、隐藏页面元素

	#### 隐藏页面元素：

- opacity:0  ：本质上是将元素的透明度将为0，就看起来隐藏了，但是依然占据空间且**可以交互**；
- visibility:hidden  : 与上⼀个⽅法类似的效果，占据空间，但是**不可以交互**了；
- overflow:hidden  : 这个只隐藏元素溢出的部分，但是占据空间且**不可交互**；
- display:none  : 这个是彻底隐藏了元素，元素从⽂档流中消失，既不占据空间也**不可交互**，也不影响布局；
- z-index:-9999  : 原理是将层级放到底部，这样就被覆盖了，看起来隐藏了；
- transform: scale(0,0)  : 平⾯变换，将元素缩放为0，但是依然占据空间，但**不可交互**；



#### display的值以及含义：

1. none：元素不显示，不占用文档空间；

2. inline：将元素显示为内联元素。无法设置元素的width和height，宽高由font-size和padding决定；
3. inline-block：行内块级元素，融合了block和inline，可以设置宽高；
4. block：将元素显示未块级元素，独占一行；
5. inherit：继承父级元素的display；



### 3、介绍一下盒模型

盒模型：内容(content)、填充(padding)、边框(border)、边界(margin)



### 4、常见的CSS3属性

#### 一、新的选择器

+ E:nth-chlid(n)

```css
/* 父元素的第二个子元素的每个 p 的背景色	*/
p:nth-child(2)
{
	background:#ff0000;
}
```

+ E:first-child

```css
/* 选择属于其父元素的首个子元素的每个 <p> 元素，并为其设置样式	*/
p:first-child
{ 
	background-color:yellow;
}
```

+ E:nth-of-type()      

```css
/* 指定每个p元素匹配同类型中的第2个同级兄弟元素的背景色 */
p:nth-of-type(2)
{
	background:#ff0000;
}
```

::selection

```css
/* 将选定的文本红色 */
::selection
{
	color:#ff0000;
}
::-moz-selection
{
	color:#ff0000;
}
```

#### 二、文本

+ text-shadow ：基础的文本阴影效果
+ text-overflow：规定当文本溢出包含元素时发生的事情 text-overflow:ellipsis(省略)
+ word-break：断点换行属性
+ word-wrap：允许长单词换行到下一行
+ white-space: 规定如何处理元素中的空白 white-space:nowrap 规定段落中的文本不进行换行

##### 单行溢出

```css
{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
```



#### 三、边框

+ border-radius

+ border-image

#### 四、背景

+ background-size

#### 五、渐变

+ linear-gradient

  background-image:linear-gradient(90deg,yellow 20%,green 80%)

#### 六、多列布局

column-count

column-width

column-gap

column-rule

#### 七、过渡

+ transition

#### 八、动画、旋转

+ animation
+ transform
+ translate

#### 九、flex布局

#### 十、@media媒体查询



### 5、什么是BFC？

> BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

#### BFC布局规则

+ 内部的Box会在垂直方向，一个接一个地放置。

+ Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠。

+ 每个盒子（块盒与行盒）的margin box的左边，与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。

+ BFC的区域不会与float box重叠。

+ BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。

+ 计算BFC的高度时，浮动元素也参与计算。

#### BFC创建

- 1、float的值不是none。
- 2、position的值不是static或者relative。
- 3、display的值是inline-block、table-cell、flex、table-caption或者inline-flex
- 4、overflow的值不是visible

#### BFC的作用

+ **利用BFC避免margin重叠**
+ **自适应两栏布局**
+ **清楚浮动**

[参考文章链接《什么是BFC？看这一篇就够了》](https://blog.csdn.net/sinat_36422236/article/details/88763187)



### 6、CSS选择器的优先级

内联 > ID选择器 > 类选择器 > 标签选择器



### 7. link和@import的区别

- 来源：link属于HTML标签，@import由CSS提供；
- 兼容性：link的兼容性要好于@import：
  - link无兼容问题；
  - @import只在IE5以上才能被识别；
- 加载方式：
  - 页面加载时，link同时被加载；
  - @import引用的CSS会等到页面被加载完后再加载；
- 优先级：link > @import
- DOM操作样式：当使用javascript控制DOM去修改样式时，只有使用link标签，因为@import不是DOM可以控制的；

### 8. em/px/rem的区别

- em：相对单位，基准点为⽗节点字体的⼤⼩，如果⾃身定义了font-size按⾃身来计算；
- rem：相对单位，可理解为”root em”, 相对根节点html的字体⼤⼩来计算，CSS3新加属性，chrome/firefox/IE9+⽀持；

- px：绝对单位，⻚⾯按精确像素展示；



### 9. CSS的几种定位方式

- static: 正常⽂档流定位，此时 top, right, bottom, left 和 z-index 属性⽆效，块级元素从上往下纵向排布，⾏级元素从左向右排列。
- relative：相对定位，此时的『相对』是相对于正常⽂档流的位置。
- absolute：相对于最近的⾮ static 定位祖先元素的偏移，来确定元素位置，⽐如⼀个绝对定位元素它的⽗级、和祖⽗级元素都为relative，它会相对他的⽗级⽽产⽣偏移。
- fixed：指定元素相对于屏幕视⼝（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变，⽐如那种回到顶部的按钮⼀般都是⽤此定位⽅式。
- sticky：是css定位新增属性；可以说是相对定位relative和固定定位fixed的结合；它主要用在对scroll事件的监听上；简单来说，在滑动过程中，某个元素距离其父元素的距离达到sticky粘性定位的要求时(比如top：100px)；position:sticky这时的效果相当于fixed定位，固定到适当位置。



### 10. 清除浮动的三种方法

- 空div⽅法： <div style="clear:both;"></div>
- clearfix⽅法：上⽂使⽤.clearfix类已经提到

```css
.clearfix {zoom: 1;}	// 兼容IE6和IE7
.clearfix:after {
    content: '\20';
    display: block;
    height: 0;
    clear: both;
}
```

- overflow: auto或overflow: hidden⽅法，使⽤BFC;



### 11. 自适应和响应式

#### 不同点：

- **自适应设计** 通过检测视口分辨率，来判断当前访问的设备是：pc端、平板、手机，从而请求服务层，返回不同的页面；**响应式设计**通过检测视口分辨率，针对不同客户端在客户端做代码处理，来展现不同的布局和内容。
- **自适应** 对页面做的屏幕适配是在一定范围：比如pc端（>1024）一套适配,平板（768-1024）一套适配，手机端（<768）一套适配;**响应式**一套页面全部适配。

#### 总结：

自适应：需要开发多套界面；响应式开发一套界面；



### 12. 为什么有时候人们⽤translate来改变位置而不是定位

- **原因**：translate()是transform的⼀个值。改变transform或opacity不会触发浏览器重新布局（reflow回流）或重绘（repaint），只会触发复合（compositions）。⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。

- **概括**：**减少浏览器除法重绘**；

- **原理**：transform使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此translate()更⾼效，可以缩短平滑动画的绘制时间。



### 13. CSS 函数

| 函数                                                         | 描述                                                         | CSS 版本 |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :------- |
| [attr()](https://www.runoob.com/cssref/func-attr.html)       | 返回选择元素的属性值。                                       | 2        |
| [calc()](https://www.runoob.com/cssref/func-calc.html)       | 允许计算 CSS 的属性值，比如动态计算长度值。                  | 3        |
| [cubic-bezier()](https://www.runoob.com/cssref/func-cubic-bezier.html) | 定义了一个贝塞尔曲线(Cubic Bezier)。                         | 3        |
| [hsl()](https://www.runoob.com/cssref/func-hsl.html)         | 使用色相、饱和度、亮度来定义颜色。                           | 3        |
| [hsla()](https://www.runoob.com/cssref/func-hsla.html)       | 使用色相、饱和度、亮度、透明度来定义颜色。                   | 3        |
| [linear-gradient()](https://www.runoob.com/cssref/func-linear-gradient.html) | 创建一个线性渐变的图像                                       | 3        |
| [radial-gradient()](https://www.runoob.com/cssref/func-radial-gradient.html) | 用径向渐变创建图像。                                         | 3        |
| [repeating-linear-gradient()](https://www.runoob.com/cssref/func-repeating-linear-gradient.html) | 用重复的线性渐变创建图像。                                   | 3        |
| [repeating-radial-gradient()](https://www.runoob.com/cssref/func-repeating-radial-gradient.html) | 类似 radial-gradient()，用重复的径向渐变创建图像。           | 3        |
| [rgb()](https://www.runoob.com/cssref/func-rgb-css.html)     | 使用红(R)、绿(G)、蓝(B)三个颜色的叠加来生成各式各样的颜色。  | 2        |
| [rgba()](https://www.runoob.com/cssref/func-rgba.html)       | 使用红(R)、绿(G)、蓝(B)、透明度(A)的叠加来生成各式各样的颜色。 | 3        |
| [var()](https://www.runoob.com/cssref/func-var.html)         | 用于插入自定义的属性值。                                     | 3        |