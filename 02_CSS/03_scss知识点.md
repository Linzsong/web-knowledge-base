# SCSS



## scoped CSS

**作用：**

当 `style` 标签有 `scoped` 属性是，它的CSS只作用于当前组件中的元素。

**原理：**

通过使用PostCSS来实现转换:(PostCSS 为了解决CSS名字重复问题)

```v
<template>
  <div class="red" data-v-f3f3eg9>hi</div>
</template>
<style>
 .red[data-v-f3f3eg9] {
    color: red;
  }
</style>
```

**特别注意的是：**

- 添加scoped的`style`会在后面引入；

- scoped内可以修改子元素包裹的首个元素（子元素内的其他元素无法修改）；



如果需要修改 scoped 中的修改子元素，可以使用 `深度作用选择器`；

深度作用选择器：

- 使用 >>> 操作符可以使 scoped 样式中的一个选择器能够作用得“更深”，例如影响
  子组件；

- Sass 之类的预处理器无法正确解析 >>> 。这种情况下你可以使用 /deep/ 或 ::v-deep 操作符取而代之；



## SCSS基础使用

### 1. 变量

 声明一个变量，多处使用；

### 2. 嵌套

能够更好的明确父子层级关系，方便修改查找以及减少样式命名;

### 3. 引用混合样式

一处定义，多处使用;

```css
@mixin clearfix {
 display: inline-block;
 &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.box{
  @include clearfix
}
```

### 4. 函数指令

css可也可像js一样开始编程；

```css
$width01: 40px;
$width02: 10px;

@function calc-width($n) {
 @return $n * $width01 + ($n - 1) * $width02;
}

.sidebar { width: calc-width(5); }

编译为

.sidebar { width: 240px; }
```


