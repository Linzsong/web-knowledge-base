## 变量类型定义

### 1. 类型注解

```js
let var1 : String;		// 类型注解，规定它为字符串

// 类型推断
let var2 = true;		// 编译器可以自行推断出类型
```

### 2. 类型基础

```js
// 数组类型
let arr: string[];
arr = ['abc'];	// 或Array<string>

// 任意类型any
let varAny: any;
varAny = 'xx';
varAny = 123;	// 都不会报错

// 函数中的类型约束
// 规定传参类型为 String； 返回类型为 String
function greet(person: string): string {
    return 'hello, ' + person;
}
// void 类型，常用于没有返回值的函数
function(): void {}

// 对象Object，在TS中，不是原始类型，就是对象类型
function fn1(o: object) {}
fn1({prop: 0});		// 传入的参数必须是对象

// function中更好的约束方式
function fn2(o: {prop: number}) {}
function({prop: 0})

// *** 类型别名type：自定义类型  ，我们可以在ts中定义自己的自定义类型 ***
type Prop = { prop: number}
function fn3(o: Prop){}
// type 和 接口interface的区别，进本完全相同
// 如果是公开开发的文档，最好使用interface去实现，这样比较安全

// 自定义类型拓展
type Prop = { prop: number} & { name: string}
```



### 3. 类型断言

```typescript
// 类型断言
const someValue: any = 'abcdefg'
const strLen = (someValue as string).length
```



### 4. 联合类型

```typescript
// 不是这个就是另一个
let union: string | number;
```



### 5. 交叉类型

```typescript
type First = {first: number}
type Second = {second: number}
// 拓展新的type
type FirstAndSecond = First & Second;
function testFunc():FirstAndSecond {
    return {f: 1, s: 2}
}
```



## 函数

**函数参数（必填参）**：参数一旦声明，就要求传值，且类型需要符合

```typescript
function getting(person: string): string {
    return person
}
getting('song')		// 参数声明，必传
```



**可选参数**：参数名后面加上  `？` ，变成可选参数

```typescript
function getting(person: string, msg?:string): string {
    return person + msg
}
// 可选参数一般放在最后面
```

**默认值参数**：

```typescript
function getting(person: string, msg="爱吃卤蛋"): string {
    return string + msg
}
```



**函数重载**：以相同名字定义的函数，以参数数量或类型区分多个函数名



## 类

```typescript
class Parent {
    private _foo = "foo"; // 私有属性，不能在类的外部访问
    protected bar = "bar"; // 保护属性，可以在子类中访问
    
    // 参数属性：构造函数参数加修饰符，能够定义为成员属性
    constructor(public tua = "tua") {}
    
    // 方法也有修饰符
    private someMethod() {}
    
    // 存取器：属性方式访问，可添加额外逻辑，控制读写性
    // get 可以用来定义vue的计算属性，都是只读
    get foo() {
        return this._foo;
    }
    set foo(val) {
        this._foo = val;
    }
}

```



## 接口

接口仅约束结构，不要求实现，使用更简单

```typescript
interface Person {
    firstName: string;
    lastName: string;
}
// greeting函数通过Person接口约束参数解构
function greeting(person: Person) {
    return 'Hello, ' + person.firstName + ' ' + person.lastName;
}
greeting({firstName: 'Jane', lastName: 'User'}); // 正确
greeting({firstName: 'Jane'}); // 错误

```



## 泛型

### 1. 例子

```typescript
// 后台返回的接口数据
interface IResponseData<T> {
  code: number;
  message?: string;
  data: T;
}
// 用户接口
interface IResponseUserData {
  id: number;
  username: string;
  email: string;
}
// 文章接口
interface IResponseArticleData {
  id: number;
  title: string;
  author: IResponseUserData;
}

// 调用后台接口定义
async function getData<T>(url: string) {
  let response = await fetch('url')
  let data: IResponseData<T> = await response.json()
  return data
}

// 方法调用
(async function () {
  let userData = await getData<IResponseUserData>('api/user')
  userData.data.email
  let articleData = await getData<IResponseArticleData>('api/atricle')
  articleData.data.author
})()
```

### 2. 泛型约束

对泛型中的类型进行约束

如：我们想获取一个变量的length，但不是每个数据类型都有length，我们定义一个接口（interface ILength）去定义length只属于number和array。

```typescript
interface Ilength {
    length: number
}

function getLength<T extends Ilength> (arg: T) {
    console.log(arg.length)
    return arg
}
getLength<string>('22')
```



### 3. 泛型接口

我们可以使用接口的方式来定义一个函数需要符合的形状：

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

当然也可以使用含有泛型的接口来定义函数的形状：

```typescript
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```



### 4. 泛型类

与泛型接口类似，泛型也可以用于类的类型定义中：

```typescript
lass GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```



### 泛型理解

+ 泛型 和 函数中的参数很像，都是因为函数体内无法确定，只有在调用的时候才知道传递的值;如 function add(a, b){ return a + b}，在函数定义中无法知道a,b的值，他是可以任意的，因此通过调用的时候来传递add(a, b)；

+ typescript强类型语言，对变量、参数的类型都进行了规范，但在函数中会出现同样的问题，在调用方法时，我们无法确方法返回值的类型，只有在调用的时候，才会告诉方法，我需要怎样的类型；如上面的 需要获取用户数据时，data中需要的是 `username` ，这时我们也可以定义很多个 `getData()` 的方法，比如说 `getUserData()`  或者 ` getArticleData()` ，但这样会在一定程度程度上提高代码量

  代码的复用性不高





## 装饰品

> `装饰器-Decorators` 在 `TypeScript` 中是一种可以在不修改类代码的基础上通过添加标注的方式来对类型进行扩展的一种方式

- 只能对类进行使用，是对类进行扩展，对 `类`、`方法` 、`访问符`、`属性`、`参数`中的方法进行修改；
- 装饰器本身是一个函数；
- 装饰器的执行不是在被调用的时候执行，而是类创建的时候；

**装饰器的执行顺序：**

- 实例装饰器
  
  - 属性 => 访问符 => 参数 => 方法
- 静态装饰器
  
  - 属性 => 访问符 => 参数 => 方法
- 类
  
  - 类
  
  