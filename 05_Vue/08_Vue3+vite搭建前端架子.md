# 基于Vue3+Vite+pnpm构建前端框架

**Demo 地址**：[vite-vue3-demo](https://github.com/Linzsong/vite-vue3-demo)

## 一. 使用pnpm管理项目

**pnpm一个快速的、节省磁盘的包管理工具。**

- **快速：** pnpm 是同类工具速度的将近 2 倍
  
  - 使用npm或yarn时，如果有100个相同依赖包的项目，那么在磁盘是就就会有一百个这个包的副本；
  
  - 而使用pnpm则只会被存放在统一的位置中；

- **高效：** node_modules 中的所有文件均链接自单一存储位置

- **支持单体仓库：**  pnpm 内置了对单个源码仓库中包含多个软件包的支持

- **严格管理：** pnpm 创建的 node_modules 默认并非扁平结构，因此代码无法对任意软件包进行访问



## ⼆.Vite介绍

- 极速的服务启动，使⽤原⽣ ESM ⽂件，⽆需打包! （原来整个项⽬的代码打包在⼀起，然后才能启动服务）
- 轻量快速的热重载 ⽆论应⽤程序⼤⼩如何，都始终极快的模块热替换（HMR）
- 丰富的功能 对 TypeScript、JSX、CSS 等⽀持开箱即⽤
- 优化的构建 可选 “多⻚应⽤” 或 “库” 模式的预配置 Rollup 构建

- 完全类型化的 API 灵活的 API 和完整 TypeScript

> Vite3修复了400+issuse,减少了体积，Vite决定每年发布⼀个新的版本



## 三.项目初始化

项目是从0开始构建，不使用VUE的脚手架工具，更好的体验VUE3的构建过程；

### 1. package.json

```powershell
pnmp init # 初始化package.json
pnpm install vite -D # 安装vite -d(devDependencies)开发依赖
```



### 2. index.html



```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>vite-start</title>
</head>

<body>
  <!-- 稍后vue项⽬挂载到这个元素上 -->
  <div id="app"></div>
  <!-- vite 是基于esModule的 -->
  <script type="module" src="/src/main.ts"></script>

</body>

</html>
```

到这一步，在`package`配置启动命令后，即可运行可热更新的应用；

```json
"scripts": {
    "dev": "vite",
},
```



### 3. vue3安装

```powershell
pnpm install vue # 安装vue
```

- 新建`main.ts`入口文件；
- 在HTML中引入`main.ts`

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue"; // 这⾥会报错，不⽀持解析.vue
createApp(App).mount("#app");
```



### 4. 类型声明.vue文件

默认`vite`是无法解析`.vue` 文件，我们可以通过添加垫片，进行`.vue`文件的类型声明

```typescript
// env.d.ts
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```



### 5. 解析VUE文件中的内容

`vite`解析 `.vue` 文件，vite官方提供了一个插件[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

```powershell
pnpm install @vitejs/plugin-vue -D
```

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
 plugins: [vue()],
});
```



### 6. 对ts进行语法检查

- `Vite` 天生支持 `ts`

  - 只编译（将 ts 编译成 js），不校验;

  > 在开发环境中，`Vite` 使用 `es build` ，`es build` 本身支持 ts 语法！

- 编译代码验证（使用ts的语法）

要使得vite支持校验，我们需要 

#### a.安装 typescript 

```powershell
pnpm install typescript 
```

#### b. 创建tsconfig.json 文件

```
{
  "compilerOptions": {
    "target": "esnext", // 编译目标是es next（esnext不考虑兼容性）
    "module": "esnext", // 转化的格式
    "moduleResolution": "node", // 解析是node规范
    "strict": true, // 严格模式
    "sourceMap": true, // 开启sourceMap方便调试
    "jsx": "preserve", // 不允许ts编译jsx语法
    "esModuleInterop": true, // es6 和 commonjs转化
    "lib": ["esnext", "dom"], // 支持es next 和 dom语法
    "types": ["vite/client"],// Vite 提供了一些内置的对象，但默认不知道这些变量的类型，需要配置以令其显示。
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // @符号的真实含义， 还需要配置vite别名， 和 declare module
    }
  },
  // 编译哪些文件
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "./auto-imports.d.ts"
  ]
}

```

#### c. 修改 package.json

- `scripts` 下的 `build` 的值 `vite build` 改为 `tsc --noEmit && vite build`；

- 定义打包的时候进行ts语法检测，为什么是打包的时候呢？
  - 因为每次它的性能不太好，所以为了节约时间，在打包时才进行语法检测；



#### d. 使用vue-tsc对.vue 文件中ts检测

```powershell
pnpm install vue-tsc -D
```

修改 package.json

- `scripts` 下的 `build` 的值 `tsc --noEmit && vite build` 改为 `vue-tsc --noEmit && tsc --noEmit && vite build`

这样在打包的时候即可对`typescript`语法进行检测。



## 四. Eslint配置

### 1. 初始化eslint

我们使用`npx`对`eslint`进行初始化

```powershell
npx eslint --init
```

步骤：

- 校验语法并提示错误⾏数

```bash
? How would you like to use ESLint? ...
	To check syntax only
> 	To check syntax and find problems
	To check syntax, find problems, and enforce
code style
```

- 采⽤js-module

```bash
? What type of modules does your project use?
...
> 	JavaScript modules (import/export)
	CommonJS (require/exports)
	None of these
```

- 项⽬采⽤vue语法

```bash
? Which framework does your project use? ...
	React
> 	Vue.js
	None of these
```



### 2. 安装插件

```bash
pnpm i eslint-plugin-vue@latest -D	#eslinet VUE的插件包
pnpm i @typescript-eslint/eslint-plugin@latest -D # typescript校验包
pnpm i @typescript-eslint/parser@latest -D # typescript 解析器，解析typescript语法
pnpm i eslint@latest -D # eslinet包
```

### 3.  配置eslint

```js
// .eslintrc.js 配置
module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential", // vue3解析https://eslint.vuejs.org/
        "plugin:@typescript-eslint/recommended",
    ],
    "parser": "vue-eslint-parser", // 解析 .vue⽂件
    "parserOptions": {
        "parser": '@typescript-eslint/parser',// 解析 .ts ⽂件
        "ecmaVersion": "latest",
        "sourceType": "module"
	},
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {}
}
```

### 4. 检测和修复代码

```json
// package.json
{
    "scripts": {
    	"lint": "eslint --fix --ext .ts,.tsx,.vue src --quiet"
    }
}
```

```bash
pnpm lint  #执行修复命令
```

 `--fix` 修复错误；`--quie`t 忽略warn；



## 五. prettier 配置

### 1. eslint 中配置

> 在eslint 中集成prettier 配置

``` bash
pnpm install prettier -D	# prettier插件
pnpm install eslint-plugin-prettier	-D  # eslint 和 prettier的桥梁插件
pnpm install @vue/eslint-config-prettier -D # vue中使用prettier
```



```js
// 在 .eslintrc.js 配置 中新增自定义的规则
// 和在prettier中的规则配置一致
...
"rules": {
    "vue/multi-word-component-names": "off",
    "prettier/prettier": [
      // 自带的prettier规则
      "error",
      {
        "singleQuote": false, //使用双引号
        "semi": false, ////末尾添加分号  var a = 1
        "tabWidth": 2, // tab * 2
        "trailingComma": "none", // {a:1,}
        "useTabs": false,
        "endOfLine": "auto"
      }
    ]
  }
    
...


```



### 2. 配置prettier

和 `.eslintrc.js` 中的自定义规则一致

```js
// .prettierrc.js
module.exports = {
  singleQuote: false, //使⽤单引号
  semi: false, ////末尾添加分号
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
  endOfLine: "auto"
}

```

安装 `Prettier` 插件

 同时在VSCode中的`setting`配置中Format，开启默认格式化为`Prettier - Code formatter`



### 3. 编辑器编码配置

`.editorconfig`

```bash
root = true
[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
```

在VSCode中安装`EditorConfig for VS Code` 插件



## 六. 新增Husky配置

**`Husky`**  可以配合 git hook 实现提交代码前的一些操作；

如：在`commit` 执行 `pnpm lint` 操作；

```bash
git init
pnpm install husky -D	# husky安装
```



在 pageage.json 中配置 `prepare`

```json
// package.json
{
    "scripts": {
    	"prepare": "husky install"  // 当我们执行npm install 时会默认执行prepare
    }
}
```

手动执行

```bash
pnpm prepare
```



添加 husky 钩子

```bash
npx husky add .husky/pre-commit "pnpm lint"
```

这样在执行git commit 前就会去执行 "pnpm lint" 的代码校验修复工作，校验成功才可以提交



## 七. commit 检测

```bash
pnpm install @commitlint/cli @commitlint/config-conventional -D
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"  # 添加钩子
```

配置 `commitlint.config.js` 文件

```js
module.exports = {
 extends: ["@commitlint/config-conventional"]
}
```

`git commit -m ` 的格式：

```bash
git commit -m"feat: 初始化⼯程"
```



| 类型     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| build    | 主要⽬的是修改项⽬构建系统(例如 glup，webpack，rollup 的配置等)的提交 |
| chore    | 不属于以上类型的其他类型                                     |
| ci       | 主要⽬的是修改项⽬继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交 |
| docs     | ⽂档更新                                                     |
| feat     | 新功能、新特性；                                             |
| fix      | 修改 bug                                                     |
| perf     | 更改代码，以提⾼性能；                                       |
| refactor | 代码重构（重构，在不影响代码内部⾏为、功能下的代码修改）；   |
| revert   | 恢复上⼀次提交                                               |
| style    | 不影响程序逻辑的代码修改(修改空⽩字符，格式缩进，补全缺失的分号等，没有改变代码逻辑) |
| test     | 测试⽤例新增、修改；                                         |



## 八. 自动引入插件

### 1. 配置

```bash
pnpm install -D unplugin-auto-import
```

在 `vite.config.ts` 中新增配置

```js
// vite.config.js
import AutoImport from "unplugin-auto-import/vite"
export default defineConfig({
 plugins: [
  vue(),
  // 自动引入vue、vue-router中的参数如ref、computed、组件等
  AutoImport({ imports: ["vue", "vue-router"],
]
});
```

引完执行后，插件会自动生成 `auto-imports.d.ts` 生命文件如下，全局声明了很多VUE的API声明；

```typescript
// Generated by 'unplugin-auto-import'
export {}
declare global {
  const EffectScope: typeof import('vue')['EffectScope']
  const computed: typeof import('vue')['computed']
  const createApp: typeof import('vue')['createApp']
  const customRef: typeof import('vue')['customRef']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const effectScope: typeof import('vue')['effectScope']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const h: typeof import('vue')['h']
  const inject: typeof import('vue')['inject']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const markRaw: typeof import('vue')['markRaw']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onMounted: typeof import('vue')['onMounted']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const provide: typeof import('vue')['provide']
  const reactive: typeof import('vue')['reactive']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const toRaw: typeof import('vue')['toRaw']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const triggerRef: typeof import('vue')['triggerRef']
  const unref: typeof import('vue')['unref']
  const useAttrs: typeof import('vue')['useAttrs']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVars: typeof import('vue')['useCssVars']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useSlots: typeof import('vue')['useSlots']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
}
```

### 2. 配置eslint 声明

```typescript
// vite.config.js
import AutoImport from "unplugin-auto-import/vite"
export default defineConfig({
 plugins: [
  vue(),
  // 自动引入vue、vue-router中的所有API
  AutoImport({ imports: ["vue", "vue-router"],
  eslintrc: { enabled: true }		// 初始化的时候开启true
]
});
```

初始化的时候开启true，会自动生成 `.eslintrc-auto-import.json` 文件；生成后再注释掉，不然每次保存都会生成一次；

是对自动引入变量进行的全局声明；

```json
// .eslintrc-auto-import.json
{
  "globals": {
    "EffectScope": true,
    "computed": true,
    "createApp": true,
    "customRef": true,
    "defineAsyncComponent": true,
    "defineComponent": true,
    "effectScope": true,
    "getCurrentInstance": true,
    "getCurrentScope": true,
    "h": true,
    "inject": true,
    "isProxy": true,
    "isReactive": true,
    "isReadonly": true,
    "isRef": true,
    "markRaw": true,
    "nextTick": true,
    "onActivated": true,
    "onBeforeMount": true,
    "onBeforeUnmount": true,
    "onBeforeUpdate": true,
    "onDeactivated": true,
    "onErrorCaptured": true,
    "onMounted": true,
    "onRenderTracked": true,
    "onRenderTriggered": true,
    "onScopeDispose": true,
    "onServerPrefetch": true,
    "onUnmounted": true,
    "onUpdated": true,
    "provide": true,
    "reactive": true,
    "readonly": true,
    "ref": true,
    "resolveComponent": true,
    "shallowReactive": true,
    "shallowReadonly": true,
    "shallowRef": true,
    "toRaw": true,
    "toRef": true,
    "toRefs": true,
    "triggerRef": true,
    "unref": true,
    "useAttrs": true,
    "useCssModule": true,
    "useCssVars": true,
    "useRoute": true,
    "useRouter": true,
    "useSlots": true,
    "watch": true,
    "watchEffect": true,
    "watchPostEffect": true,
    "watchSyncEffect": true
  }
}
```

同时在esllint的配置文件 `.eslintrc.json` 中引入该文件进行使用；

```json
// .eslintrc.json
{
  "env": {
    // 环境 针对哪些环境的语法
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    // 集成了哪些规则， 别人写好的. 别人写好的规则拿来用
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "@vue/prettier",
    "./.eslintrc-auto-import.json" // 这里就是引用
  ],

  ...
}

```



### 3. 配置typescript类型支持

``` json
// tsconfig.json
{
  ...
  // 编译哪些文件
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "./auto-imports.d.ts"		// 将文件引入
  ]
}

```



## 九. 路径别名

```js
// vite.config.ts
import path from "path"

export default defineConfig({
 	resolve: {
  		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }]
	}
})
```



 @符号的真实含义， 还需要配置vite别名， 和 declare module

配置点击@的时候可以正常的跳转过去

```json
// tsconfig.json
{
  "compilerOptions": {
	// ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"] // @符号的真实含义， 还需要配置vite别名， 和 declare module
    }
    // ...
  },
}

```



## 十. 路由配置

```typescript
// 项目比较小，可以采用约定式路由 根据规范来创建目录
// 项目比较大，建议采用配置
import { createRouter, createWebHistory } from "vue-router"

const getRoutes = () => {
  const files = import.meta.glob("../views/*.vue") // 类似于webpack require.context

  return Object.entries(files).map(([file, module]) => {
    const name = file.match(/\.\.\/views\/([^.]+?)\.vue/i)?.[1]
    return {
      path: "/" + name,
      component: module
    }
  })
}

export default createRouter({
  history: createWebHistory(),
  routes: getRoutes()
  //   [
  //   {
  //     path: "/home",
  //     component: () => import("../views/home.vue")
  //   }
  // ]
})

```



其中用到了 `import.meta.glob()` 函数，需要引入相应的类型进行支持

```typescript
// env.d.ts  采用三斜线指令引入
/// <reference types="vite/client" />		
```

最后在main.ts 中使用

```typescript
import router from "./router"
createApp(App).use(router).mount("#app")
```



## 十一. 识别TSX文件

```bash
pnpm install @vitejs/plugin-vue-jsx -D
```

在 vite.config.ts 中引入

```typescript
import jsx from "@vitejs/plugin-vue-jsx"
// ...
export default defineConfig({
  plugins: [
   // ...
    jsx(),
   // ...
  ],
  // ...
})
```

使用例子

```tsx
import { PropType } from "vue"

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },
  render() {
    return (
      <ul class="bg-gray-3 w-50% m-auto mt-5">
        {this.list.map((todo, index) => {
          return <li key={index}>{todo}</li>
        })}
      </ul>
    )
  }
})

```



## 十二. Mock数据



```bash
pnpm install mockjs vite-plugin-mock -D
```

在 vite.config.ts 中引入

```typescript
import { viteMockServe } from "vite-plugin-mock"
// ...
export default defineConfig({
  plugins: [
   // ...
    viteMockServe(),
   // ...
  ],
  // ...
})
```

使用例子

``` typescript
// 用来mock数据的
import { MockMethod } from "vite-plugin-mock"
export default [
  {
    url: "/login",
    method: "post",
    response: (res) => {
      // express
      return {
        code: 0, // code 0 成功  code 1失败
        data: {
          token: "Bearer Token ",
          username: res.body.userName
        }
      }
    }
  }
] as MockMethod[]

```



## 十三. Asion封装

```bash
pnpm install mockjs vite-plugin-mock -D
```

在 `httpUtil.ts` 封装请求方法

```typescript
import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
export interface ResponseData<T> {
  code: number
  data?: T
  msg?: string
}
class HttpRequest {
  public baseURL = import.meta.env.DEV ? "/" : "/"
  public timeout = 10000

  // 每次请求都创建一个独一无二的实例 ， 为了保证 请求之间是互不干扰的
  public request(options: AxiosRequestConfig) {
    const instance = axios.create(options)
    options = Object.assign(
      {
        baseURL: this.baseURL,
        timeout: this.timeout
      },
      options
    )

    this.setInterceptors(instance)
    return instance(options)
  }
  setInterceptors(instance: AxiosInstance) {
    // 请求拦截器
    instance.interceptors.request.use(
      (config) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config.headers!["token"] = "bearer token"
        return config
      },
      (err) => {
        return Promise.reject(err)
      }
    )
    // 响应拦截器
    instance.interceptors.response.use(
      (res) => {
        const { code } = res.data
        if (code !== 0) {
          return Promise.reject(res)
        }

        // 401 403 404
        return res
      },
      (err) => {
        return Promise.reject(err)
      }
    )
  }
  public get<T>(url: string, params: unknown): Promise<ResponseData<T>> {
    return new Promise((resolve, reject) => {
      this.request({
        method: "GET",
        url: url,
        params: params
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err || err.msg)
        })
    })
  }
  public post<T>(url: string, data: unknown): Promise<ResponseData<T>> {
    return new Promise((resolve, reject) => {
      this.request({
        method: "POST",
        url: url,
        data: data
      })
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err || err.msg)
        })
    })
  }
}

export default new HttpRequest()

```

使用例子

``` typescript
import http from "@/util/httpUtil"

// 封装接口路径
const enum USER_API {
  login = "/login"
}

// 封装用户信息
export interface IUserData {
  userName: string
  password: string
}

// 后续方法可以继续扩展  用户调用的接口
export async function login<T>(data: IUserData) {
  return http.post<T>(USER_API.login, data)
}

```



``` typescript
login<{ username: string; token: string }>({
  userName: "Jay",
  password: "jw"
})
  .then((res) => {
    console.log(res.data?.username)
  })
  .catch((err) => {
    console.log(err)
  })
```



## 十四. 代理配置

``` typescript
// 代理设置
export default defineConfig({
// ...
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
// ...
}）
```

