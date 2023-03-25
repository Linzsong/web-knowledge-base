### 1. 内存存储（基本数据类型和引用数据类型）

+ 基本数组类型

  String, Number, Boolean, null, undefined、Symbol等**（大小固定、体积轻量，相对简单）**

  **该数据类型，存放在栈内存中**

  （*ps.栈（先进后出）的优势是，存取速度比堆要快，仅次于直接位于CPU中的寄存器。但缺点是，存在栈中的数据大小与生存期必须是确定的，缺乏灵活性。**其中原始值是没有属性和方法***）

  

+ 引用数据类型

  Object, Array, Function **（大小不一定，占用空间较大，相对复杂）**

  **该数据类型，存放在堆内存中，在栈内存中仅仅存这堆栈内存的引用（即堆内存的地址）**

  （*ps.堆是在程序运行时，而不是在程序编译时，申请某个大小的内存空间。即动态分配内存，对其访问和对一般内存的访问没有区别。堆是指程序运行时申请的动态内存，而栈只是指一种使用堆的方法(即先进后出)。*）

  [堆、栈、队列的区别](https://jingyan.baidu.com/article/6c67b1d6a09f9a2786bb1e4a.html)

+ 扩展

  + 题目

  ```js
  var a = { name: 'nick' }
  var b = a;
  b.name = 'yahoo';
  console.log(a)		// { name: 'yahoo' }
  console.log(b)		// { name: 'yahoo' }
  
  
  var a = { name: 'nick' }
  var b = a;
  a = null;			//释放引用
  console.log(a)		// null
  console.log(b)		// { name: 'nick' }
  
  
  var a = {n: 1};
  var b = a;
  a.m = a = {m: 2};
  console.log(a)		//{m: 2}
  console.log(b)		//{n: 1, m: {m: 2}}
  //a = {m: 2} a.m = a 这是不对的
  //浏览器在预编译的时候会发现a.m ，相当于给a新增了一个m属性，值为undefined
  //然后从右向左执行
  //a = {m: 2}	改变a的指向，指向了{m: 2}
  //a.m = {m: 2} 相当于 {n: 1}.m = {m: 2}
  ```

  + 闭包变量

  闭包中的变量并不保存中栈内存中，而是保存在`堆内存`中，这也就解释了函数之后之后为什么闭包还能引用到函数内的变量。

  ```js
  function A() { 
      let a = 1 
      function B() { 
          console.log(a) 
      }   
      return B 
  }
  ```

  + js性能细节

  JavaScript堆不需要程序代码来显示地释放，因为堆是由自动的垃圾回收来负责的，每种浏览器中的JavaScript解释引擎有不同的自动回收方式。

  一个最基本的原则是：如果栈中不存在对堆中某个对象的引用，那么就认为该对象已经不再需要，在垃圾回收时就会清除该对象占用的内存空间。

  因此，在不需要时应该将对对象的引用释放掉（newArray=null；），以利于垃圾回收，这样就可以提高程序的性能。

  [参考博客](https://www.jianshu.com/p/2472085f1c59)

### 2. 深度克隆

#### a. 深度克隆初级版

+ 遍历对象 `for(let prop in obj)`， 使用for in时，需要用到obj.hasOwnProperty(prop)
+ 判断是原始值还是引用值
+ 判断对象还是数组
  + Object.prototype.toString.call(obje[prop])  === '[object Array]'
  + Array.isArray(obj[prop])  === true
  + obj[prop] instanceof Array  === true
  + (obj[prop].constructor == Array) === true
+ 建立相应的数组或对象
+ 递归

```javascript
/*
** origin 拷贝的象
** target 目标对象
*/

function deepClone(origin, target) {
    target = target || {}
    for(let prop in origin) {
    	if(Object.hasOwnProperty.call(origin, prop)) {	// 判断属于自身的属性
    		if(origin[prop] !== null && typeof(origin[prop]) === 'object') {	// 应用数据类型且不为null
    			if(Object.prototype.toString.call(origin[prop]) === '[object Array]') {	// 数组
    				target[prop] = []
    			} else {	// 对象
    				target[prop] = {}
    			}
    			deepClone(origin[prop], target[prop])
    		} else {	// 基本数据类型
    			target[prop] = origin[prop]
    		}
    	}
    }
    return target
}
let obj = {
    a: 1,
    b: '2',
    c: [1,3,4,5],
    d: {
        aa: '00', 

        bb: 'wewe',
        c: ['aa', 'ewe'],
        d: 0,
    },
    a() {
        console.log('aaa')
    },
}
let obj1 = {}
obj1 = deepClone(obj, obj1)
obj1.c.push(6)
obj1.d.aa = '被修改了'
console.log('old obj: ', obj)
console.log('new obj: ', obj1)

```

#### b. 深度克隆2.0

可以拷贝引用对象，引用对象判断和拷贝思路：

- 使用map对象来解决；在开始前 new一个 map对象；
- 先判读map.get(obj)当前的对象，是否存在map函数函数中，存在则返回该对象；
- 再通过map.set(obj)将当前对象设置到map对象中；

```js
function isObject(obj) {
    return (
        Object.prototype.toString.call(obj) === "[object Object]" ||
        Object.prototype.toString.call(obj) === "[object Array]"
    );
}
//使用Map函数
function deepCopy(obj, map = new Map()) {
    if (!isObject(obj)) return;
    var newObj = Array.isArray(obj) ? [] : {};
    console.log(map.get(obj), obj);
    if (map.get(obj)) {
        return map.get(obj);
    }
    map.set(obj, newObj);

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (isObject(obj[key])) {
                newObj[key] = deepCopy(obj[key], map);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;
}
const obj1 = {
    x: 1,
    y: 2,
    d: {
        a: 3,
        b: 4,
    },
};
obj1.z = obj1;
const obj2 = deepCopy(obj1);
console.log(obj2);
```





### 3. 预编译

```js
//连句小口诀：函数声明整体提升，变量的声明提升
console.log(a)	//undefined
var a = 10;		//声明提升，赋值不提升
```

+ 全局预编译GO（Globe Object === window）

  1. 创建GO对象
  2. 将 **变量声明** 挂载到GO对象，赋值为undefined
  3. **函数声明**，挂载到GO对象上，最后将**函数体赋值**到函数声明上

  *（ps优先执行）*

+ 函数体内的预编译（Activation Object）

  1. 创建AO对象
  2. 将 **变量声明** 和 **形参** 挂载到AO对象，赋值为undefined（优先级 ：形参> 变量）
  3. 将 **形参** 和 **实参** 统一（实参赋值给形参）
  4. **函数声明**，挂载到AO对象上，最后将**函数体赋值**到函数声明上

+ 练习一

```js
console.log(test)
function test(test) {
    console.log(test)
    var test  = 123
    console.log(test)
    function test() {}
}
test(1)
var test = 123
```

解释：

```js
/*	GO{
		test: function test(test){...}
	}
*/
console.log(test)		//function test(1){...}
function test(test) {	//该函数test()已提升，不看他，继续向下执行，转到创建AO
    console.log(test)	//function test() {}
    var test  = 123
    console.log(test)	//123
    function test() {}
}
/*
	AO {
		test: function test() {}
	}
	跳到函数体内执行 
*/
test(1)
var test = 123
```

+ 练习二

```js
global = 100;
function fn() {
    console.log(global)		// undefiend
    global = 200
    console.log(global)		// 200
    var global = 300
}
fn()
var global
```

+ 练习三

```js
function test() {
    console.log(b)
    if(a) {
        var b = 100
    }
    console.log(b)
    c = 234
    console.log(c)
}
var a 
test()
a = 10
console.log(c)
```

解析：

```js
GO {
    a: undefiend,
    test: function test() {..},
    c: undefiend
}
AO {
    b: undefiend
}
//undefiend
//undefiend
//234
//234
```

+ 练习四

```js
function bar() {
    return foo
    foo = 10
    function foo(){}
    var foo = 11
}
console.log(bar())		//function foo(){}
```

+ 练习五

```js
console.log(bar())		//11
function bar() {
    foo = 10
    function foo() {}
    var foo = 11
    return foo
}
```

```js
a = 100
function demo(e) {
    function e() {}
    arguments [0] = 2;
    console.log(e)
    if(a) {
        var
    }
}
```



### 4. 作用域

+ [[scope]]：每个JavaScript函数都是一个对象，对象中有些属性我们可以访问，但有些不可以，这些不可以访问的属性，仅供JavaScript引擎存取，[[scope]]就是其中一个。

+ [[scope]]指的就是我们所说的作用域，其中存储了运行期上下文的集合

  + 运行期上下文：

    当函数执行时，会创建一个称为执行期上下文的内部对象。一个执行期上下文定义了一个函数执行时的环境，函数每次执行时对应的执行上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行上下文，当函数执行完毕，执行上下文被销毁

+ 作用域链：[[scope]]中所存储的执行期上下文对象的集合，这个集合呈链式链接，我们把这种链式链接叫做作用域链。

+ 例子

```js
function a() {
    function b() {
        var b = 234
    }
    var a = 123
    b()
}
var glob = 100
a()
```

+ 执行过程：

  ![a函数被定义](https://img-blog.csdnimg.cn/20201124115905158.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xpbnpzb25n,size_16,color_FFFFFF,t_70#pic_center)

  ![a函数被执行](https://img-blog.csdnimg.cn/20201124115905351.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xpbnpzb25n,size_16,color_FFFFFF,t_70#pic_center)

  ![b函数被定义](https://img-blog.csdnimg.cn/20201124115905519.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xpbnpzb25n,size_16,color_FFFFFF,t_70#pic_center)

  ![b函数被执行](https://img-blog.csdnimg.cn/20201124115905522.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0xpbnpzb25n,size_16,color_FFFFFF,t_70#pic_center)

  

+ question 

  + 每个执行期上下文中的值都一样吗 ？

    都一样，来自同一个值，b函数拿执行期上下文的值只是a函数的引用

  + 执行期上下文什么时候销毁 ？

    执行完后他的AO会被销毁，回到defined（定义）状态，等待调用



### 5. 闭包

+ 概念：内部的函数被保存到了外部时，形成闭包；
+ 好处：变量保护，避免全局污染；防抖节流的时候，会用到闭包，我们需要保存时间戳和定时器变量；
+ 后果：导致原有的作用域链不释放，造成内存泄漏；

```js
function a() {
    var num = 100
    function b() {
      num ++
      console.log(num)
    }
    return b
  }
var demo = a()
demo();		// 101
demo();		// 102
```

+ 例子

```js
function test() {
    var arr = []
    for(var i = 0; i < 10; i++) {
        arr[i] = function () {
            console.log(i)
        }
    }
    return arr
}

var myArr = test()
for(var j = 0; j < 10; j++) {
    myArr[j]()
}

//输出 10个 10
```

如何输出 0 到 9 呢，要求同样保存函数出来，*在这里我们使用立即执行函数，让保存出来的函数的执行期上下文是立即执行函数*

```js
function test() {
    var arr = []
    for(var i = 0; i < 10; i++) {
        (function(j) {
            arr[j] = function() {
                console.log(j)
                console.log('---')
            }
        })(i)
    }
    return arr
}

var myArr = test()
for(var j = 0; j < 10; j++) {
    myArr[j]()
}
```





### 6. 立即执行函数

推荐使用：`(function (){}())`	其它写法：`(function (){})()`	或者 +function (){}()也可以。***why ？***

原因：**只有表达式才能被执行符号执行 ** ，前面加了一个正号，使得该语句变成了表达式，因此能被执行，这也是立即执行函数的由来（偶然创造出来的）。

```js
function test() {		//直接报错，它是函数的声明，只有表达式才能被执行符号执行
    console.log('aaa')
}()


/////////////////////////////


//而这样，不报错
function test(a, b, c) {
    console.log('aaa')
}(1, 2, 3)
//系统把他当成了
function test(a, b, c) {
    console.log('aaa')
}



(1, 2, 3)
//这种写法，不执行，也不报错
```



### 7. 对象Object和包装类

对象的声明

```js
var student = {
    name: 'lin',
    sex: 18,
    health: 100,
    running: function() {
        console.log(student === this)  // true  
        // 在这里 student 和 this 是一个东西
        this.health++
        // 等同 student.health++
    },
    learning: function() {
        this.health--
    }
}
```

**对象的创建方法：**

1. ​	var obj = {} 
2. 构造函数
   - 系统自带的构造函数	new Object() ；（var a = {} 和 这个创建的对象是一样的）
   - 自定义



**构造函数**：规定首字符大写

```js
function Person() {}
var lin = new Person();
```

**构造函数内部原理：**

- 在函数体最前面隐式的加上this={} ;
- 执行 `this.xxx = xxx` ;
- 隐式的返回 `this`

```js
function Person() {}
let person = new Person()

// 为什么 new 一下就能构造出对象呢？
// 在 new 的时候，执行了一下操作
function Person() {
    var this = {
        __proto__: Person.prototype		// 将父级的熟悉和现在的关联
    }
    ...
    this.name = 'song'
    ...
    return this
}
```

**小实验：**当我们在Object的中构造函数中return会怎么样呢？

```js
function Person() {
    this.name = 'song'
    //return 123	=> 返回原始值则返回this
    //return {}    	=> 返回引用值时，则直接返回引用值
}
let person = new Person()

```

+ 包装类题目

```js
var str = 'abc'
str += 1
var test = typeof(str)
if(test.length == 6) {
    test.sign = "typeof的返回结果可能为String"
}
console.log(test.sign)		// undefined
```





### 8. 原型--prototype

#### 原型（prototype）

+ 原型是function对象的一个属性，它是构造函数构造对象的公有祖先；
+ 通过该构造函数产生的对象，可也继承该原型的属性和方法；
+ 原型也是对象；



```js
// prototype 和 __proto__ 的区别
// prototype：属于对象的
// __proto__：属于实例
function Person() {}
let song = new Person()
Person.prototype
song.__proto__
// 而且
Person.prototype === song.__proto__   // true
```



```js
// Perosn.prototype -- 原型
// Person,prototype = {} ,祖先，它是一个对象由系统定义
Person.prototype.age = '18'
function Person() {}
let song = new Person()
```

**作用**：利用原型特点和概念，可以提取共有属性，如VUE中的vue.prototype.$router = router；

**构造函数（constructor）**：系统自带有构造器，可以重写构造器，在new后，可以通过constructor查看对象的构造函数；

```js
function Person() {
    this.name="abc"
}
var song = new Person()
// song打印结果
/* 
Person {
    [[Prototype]]: {
        constructor: ƒ Person(),		// 构造函数为Person
        [[Prototype]]: Object
    }
}
*/


```

`__proto__`: new 的时候产生的

```js
function Person() {
    this.name="abc"
}
var song = new Person()
song.__proto__ === Person.prototype			// true
// 原因：要从new的过程说起
function Person() {
    var this = {
        __proto__: Person.prototype		// 将父级的熟悉和现在的关联，所以他们是一个东西
    }
    ...
    this.name = 'song'
    ...
    return this
}
```

题目1：

```js
Person.prototype.name = 'sunny'
function Person() {}
var person = new Person()
Person.prototype.name = 'cherry'
console.log(person.name)		// cherry,原因，他自己没有只能找原型找，而原型改变了，所以页改变了
```

***题目2****：

```js
Person.prototype.name = 'sunny'
function Person() {}
var person = new Person()
Person.prototype = {
    name: 'cherry'
}
console.log(person.name)		// sunny
```

解析：

```js
// 这得先看这道题：
var obj = {name: 'a'}
var obj1 = obj
var obj = {name: 'b'}
console.log(obj1.name)		// a
// 一样的道理
var person = new Person()
// 在new的过程中
person = function Person() {
    // var this = {__proto__: Person.prototype}  //这里的Person.prototype也是引用数据类型
    // return this
}
// 之后 Person.prototype = {name: 'cherry'}  换了一个引用数据类型，但不影响person,所以打印出来的依然是 sunny


```

***题目3***：

```js
Person.prototype.name = 'sunny'
function Person() {}
Person.prototype = {
    name: 'cherry'
}
var person = new Person()
console.log(person.name)		// cherry
```



#### Function和Object

> 关于Function原型对象和Object原型对象的一些疑惑

```js
Function.prototype.a = 'a';
Object.prototype.b = 'b';
function Person(){};
var p = new Person();
console.log('p.a: '+ p.a); // p.a: undefined
console.log('p.b: '+ p.b); // p.b: b

// 原因：
// Person函数才是Function对象的一个实例，通过Person.a可以访问到Function原型里面的属性；
// 由于new Person，在new的过程中
person = function Person() {
    // var this = {__proto__: Person.prototype}  //这里的Person.prototype也是引用数据类型
    // return this
}
// 返回来的是一个对象，他是Object的一个实例，是没有继承Function的，所以无法访问Function原型里面的属性；
// 但是,由于在js里面所有对象都是Object的实例，所以，Person函数可以访问到Object原型里面的属性，Person.b => 'b'

```





#### 原型链

原型所连接起来的叫作原型链





### 9. 对象的创建

```js
// 绝大多数对象的最终都会继承自Object.prototye，也有例外
// 这两种写法是一样的
var obj = {}
var obj1 = new Object()

// Object.create(原型);	 它也可以创建对象
Object.create(null)	// => 创建出来的对象没有原型
```



### 10. js任务执行顺序(主—>微—>宏)

+ 主要任务

+ 微任务（Promise.prototype.then）
+ 宏任务（setTimeout, requestAnimationFrame, setInterval）



### 11. 自定义getSafe函数

用来判断一个值是否为 `undefined` 

```js
var obj = {
    a: {
        b: {
            c: { 
                d: {
                    e: 1
                }
            }
        }
    }
}
console.log(obj && obj.a && obj.a.b && obj.a.b.c && obj.a.b.c.d && obj.a.b.c.d.e)
//如今要有一个getSafe(obj, 'a.b.c.d.e')这样的函数
// 方法一
getSafe(obj, 'a.b.c.d.e')
function getSafe(obj, path) {
    try {
        let pathArr = path.split('.')
        for(let i= 0; i< pathArr.length; i++) {
            obj = obj[pathArr[i]]
        }
        return obj
    } catch {
        console.log(undefined)
    }
}
// 方法二
//reduce方法
function getSafe(obj, path) {
    try {
        const res = path.split('.').reduce((obj, n) => obj[n],obj)
        console.log(res)
    } catch(err) {
        console.log(undefined)
    }
}
// reduce函数知识点  累加器，将前一个与后一个相加
[1, 2, 3].reduce(function(prev, next) {
    return prev + next
}, 0)
// 返回结果为 6， 0+1+2+3=6

```



### 12. JavaScript 小数运算时，进度不准

```js
0.14 * 100 
// 14.000000000000002
// 使用函数取整
Math.cell(0.14 * 100 )		// 向上取整
Math.floor(0.14 * 100 )		// 向下取整
```



### 13. call / apply 的使用

call改变this指向

```js
function Person(name, age) {
    //var this = {}		当使用new时，出现的隐私定义
    this.name = name
    this.age = age
    console.log(this)
}

var obj = {}
var obj1 = new Person('aa', 20)
Person.call(obj, 'aaa', 18)		
//	这里改变了Person中this的指向 使得 var this = obj

```

使用call方法，那其他类的属东西，来实现自己的

```js
function Person(name, age) {
    this.name = name
    this.age = age
    console.log(this)
}
function Student(name, age, sex) {
    Person.call(this, name, age)
    this.sex = sex
}
var student = new Student('song', 123, '男')
```

**call和apply之间的区别**（传参列表不同）

+ call  需要把实参按照形参的个数传进去
+ apply 需要传一个arguments

```js
...
function Student(name, age, sex) {
    Person.call(this, [name, age])
    this.sex = sex
}
...
```



### 14. && 和 || 

#### js中类型转换为false有：

+ 以下内容会被当成false处理："" , false , 0 , null , undefined , NaN

#### 结论： 

+ a && b :如果执行a后返回true，则执行b并返回b的值；如果执行a后返回false，则整个表达式返回a的值，b不执行；

+ a || b :如果执行a后返回true，则整个表达式返回a的值，b不执行；如果执行a后返回false，则执行b并返回b的值；

#### 优先级：

+ && 优先级高于 ||;



### 15. 服务器状态码含义

+ 100-199 用于指定客户端应相应的某些动作；
+ 200-299 用于表示请求成功；
+ 300-399 用于已经移动的文件并且常被包含在定位头信息中指定新的地址信息；
+ 400-499 用于指出客户端的错误；
  + 401没有权限
  + 402需付款
  + 403禁止访问
  + 404没有找到
+ 500-599 用于支持服务器错误；



### 16. 防抖、节流

#### 防抖的定义



### 17. toString

```js
123.toString() 		// 报错，123中的.优先级是最高的
// ----------------------------------------------------------
var obj = {}
obj.toString() // => [object Object]
// ----------------------------------------------------------
document.write('123')		//  =>  会隐式的调用toString方法
// 相当于 
document.write('123'.toString)
// ----------------------------------------------------------
// 对于toString方法，很多类型都对他进行了重写
Objectn.prototype.toString()
Number.prototype.toString()
Array.prototype.toString()
Boolean.prototype.toString()
String.prototype.toString()
// ----------------------------------------------------------
// 验证对象还是数组
let obj = {}
let arr = []
Object.prototype.toString.call(obj)		=> [object Object]
Object.prototype.toString.call(arr)		=> [object Array]
```



### 18. this 指向

- 默认情况想this指向全局对象，如浏览器的就是指向window；
- 如果函数被调⽤的位置存在上下⽂对象时，那么函数是被隐式绑定的；

```js
function f() {
    console.log( this.name );
}
var obj = {
    name: "Messi",
    f: f
};
obj.f(); //被调⽤的位置恰好被对象obj拥有，因此结果是Messi
```

- 显示改变this指向，常⻅的⽅法就是call、apply、bind;
- 最后，是优先级最⾼的绑定 new 绑定

> 绑定优先级: **new绑定** > **显式绑定** >**隐式绑定** >**默认绑定**



### 19. 盘盘splice,slice,split

#### splice()

操作数组，增删改数组元素，返回新数组（会改变原数组）

- 添加：splice(index，0，data1，data2，……);
- 删除：splice(index,0);

#### slice()

用于截取数组，并返回截取到的新的数组，数组与字符串对象都使用（不改变原数组）

- array.slice(start,end)

#### split()

切割字符串，将字符串转化为字符串数组



### 20. Promise

实现原理：

- 构造函数中执行方法；
- then方法将后续的方法（在then中不执行，收到resolve再执行）存储到队列中（这里一定要是队列，才符合先进先出的原则）；
- resolve或reject方法中将刚刚存储的队列shift()出来，执行then后面的方法；
- 将Promise放入微队列中，使用 MutationObserver 浏览器的API；
- 链式调用，等待解决；



## 21.async 原理

**Generator+自动执行器**

利用Generator函数（定义*foo()）中的yield进行中断,it.next()