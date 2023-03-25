# Element UI 使用心得

### 在table中获取点击当前行、列索引

- 先开启table中的`:cell-class-name="tableRowClassName"`,将`rowIndex` 和`columnIndex` 放入`row` 和 `column` 的属性中

- 再table中使用 `@cell-dblclick="handleCellClick"`函数

```js
tableRowClassName ({row, column, rowIndex, columnIndex}) {
    //把每一行的索引放进row,和index
    row.index = rowIndex;
    column.index=columnIndex;
},
handleCellClick(row, column, cell, event) {
    console.log(row.index)
    console.log(column.index)
},
```

### el-input中监听键盘事件“回车”和“Tab”

```html
<el-input  
	@keyup.enter.native="test($event)"
    @keydown.tab.native="test($event)">
</el-input>

<!-- 注意这里的Tab键 要使用 keydown监听，使用keyup监听无效，具体原因，希望有热心的网友给予指正-->

```

```js
test(e) {
    e.preventDefault();		// 阻止Tab的默认事件
}
```



### table双击开启编辑，按下enter和tab按钮实现换



```vue
<template>
  <div>
    <el-table
      :data="tableData"
      :cell-class-name="tableRowClassName"
      highlight-current-row
      border
      @cell-dblclick="handleCellClick"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
      >
        <div slot-scope="scope">
          <div
            v-if="
              scope.row.index === tabClickIndex && item.prop === tabClickProp
            "
          >
            <el-input
              ref="inputRef"
              v-model="scope.row[item.prop]"
              size="mini"
              @blur="blurFunc"
              @keyup.enter.native="forbidTab($event)"
              @keydown.tab.native="forbidTab($event)"
            ></el-input>
          </div>
          <div v-else style="text-align: center">
            {{ scope.row[item.prop] }}
          </div>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          colunm01: "",
          colunm02: "",
          colunm03: "",
        },
        {
          colunm01: "",
          colunm02: "",
          colunm03: "",
        },
        {
          colunm01: "",
          colunm02: "",
          colunm03: "",
        },
      ],
      columns: [
        {
          prop: "colunm01",
          label: "列1",
        },
        {
          prop: "colunm02",
          label: "列2",
        },
        {
          prop: "colunm03",
          label: "列3",
        },
      ],
      tabClickProp: "",
      tabClickIndex: null,
    };
  },
  methods: {
    tableRowClassName({ row, column, rowIndex, columnIndex }) {
      //把每一行的索引放进row,和index
      row.index = rowIndex;
      column.index = columnIndex;
    },
    handleCellClick(row, column, cell, event) {
      // 双击获取聚焦
      this.tabClickIndex = row.index;
      this.tabClickProp = column.property;

      this.$nextTick(() => {
        this.$refs.inputRef[0].focus();
      });
    },
    blurFunc() {
      // 失去聚焦后，隐藏
      setTimeout(() => {
        // 这里做80ms的延迟是为了兼容下拉框选中后，赋值完再进行隐藏，该方法不是最好的解决方案，如果改成单击编辑表格的话，这个延迟会跟不上。所以这里做的是双击开启编辑。
        console.log("blur...");
        this.tabClickIndex = null;
        this.tabClickProp = "";
      }, 80);
    },
    forbidTab(e) {
      // 回车、tab 切换到下一个地方编辑
      e.preventDefault();
      let colLen = this.columns.length;
      let rowLen = this.tableData.length;

      let currentIndex = this.columns.findIndex((value, index) => {
        return value.prop === this.tabClickProp;
      });

      if (currentIndex === colLen - 1) {
        // 最后一列，换行处理
        if (this.tabClickIndex !== rowLen - 1) {
          let indexData01 = this.tabClickIndex + 1; // 预存row index
          // 触发blur
          this.tabClickIndex = null;
          this.tabClickProp = "";
          setTimeout(() => {
            this.tabClickProp = this.columns[0].prop;
            this.tabClickIndex = indexData01;
            this.$nextTick(() => {
              this.$refs.inputRef[0].focus();
            });
          }, 160);
          console.log("最后一列，换行了");
        } else {
          this.tabClickIndex = null;
          this.tabClickProp = "";
          console.log("最后一列，最后一行，直接blur");
        }
      } else {
        // 不是最后一列，直接到下一格
        // 行号不变  列号加一
        let indexData02 = this.tabClickIndex; // 预存row index
        // 触发blur
        this.tabClickIndex = null;
        this.tabClickProp = "";
        // 重新激活
        setTimeout(() => {
          this.tabClickProp = this.columns[currentIndex + 1].prop;
          this.tabClickIndex = indexData02;
          this.$nextTick(() => {
            this.$refs.inputRef[0].focus();
          });
        }, 160);
      }
    },
  },
};
</script>
```

