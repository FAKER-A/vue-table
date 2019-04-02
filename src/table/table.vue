<template>
  <div
    :ref="tableWrapperRef"
    :class="{ 'no-border': !border, [theme]:theme,'table-wrapper-fixed': scrollY }"
    :style="tableWrapper"
    class="table-wrapper"
  >
    <slot />
    <table-header
      :ref="tableHeaderRef"
      :columns="realColumns"
      :data="tableData"
      :border="border"
      :width="tableHeaderWidth"
      @allSelection="allSelectionCallback"
      @sort="sortCallback"
    />
    <table-body
      :ref="tableBodyRef"
      :columns="realColumns"
      :data="tableData"
      :border="border"
      :height="bodyHeight"
      :width="tableHeaderWidth"
      :row-class-name="rowClassName"
      @check="checkCallback"
      @expend="expendCallback"
    />
  </div>
</template>

<script>
import TableHeader from './tableHeader.vue'
import TableBody from './tableBody.vue'
export default {
  components: {
    TableHeader,
    TableBody
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: '100%'
    },
    theme: {
      type: String,
      default: 'black'
    },
    height: {
      type: [String, null],
      default: null
    },
    border: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default: null
    },
    selectable: {
      type: Function,
      default: null
    }
  },
  data() {
    const getScrollbarWidth = () => {
      const outer = document.createElement('div')
      outer.style = {
        position: 'absolute',
        left: '-10000000px',
        width: '100px',
        visibility: 'hidden'
      }
      document.body.appendChild(outer)
      const outerWidth = outer.offsetWidth
      outer.style.overflow = 'scroll'
      const inner = document.createElement('div')
      inner.style = {
        width: '100%'
      }
      outer.appendChild(inner)
      const innerWidth = inner.offsetWidth
      const scrollbarWidth = outerWidth - innerWidth
      outer.parentNode.removeChild(outer)
      return scrollbarWidth
    }
    return {
      columns: [],
      colID: 0,
      tableData: [],
      headerHeight: null,
      bodyHeight: null,
      maxLevel: 0,
      tableID: Math.random() * Math.random(),
      scrollBarWidth: getScrollbarWidth(),
      scrollY: false,
      realColumns: [],
      tableWrapperWidth: null
    }
  },
  computed: {
    tableHeaderRef() {
      return `table_header_${this.tableID}`
    },
    tableBodyRef() {
      return `table_body_${this.tableID}`
    },
    tableWrapperRef() {
      return `table_wrapper_${this.tableID}`
    },
    tableWrapper() {
      return {
        width: this.width
      }
    },
    tableHeaderWidth() {
      return this.realColumns.reduce((prev, next) => {
        if (next.width) prev += parseInt(next.width)
        if (next.avgWidth) prev += parseInt(next.avgWidth)
        return prev
      }, 0)
      // let width = null
      // if (!this.scrollY) width = this.tableWrapperWidth
      // width = this.tableWrapperWidth - this.scrollBarWidth
      // return width
    },
    selected() {
      const selectedData = JSON.parse(JSON.stringify(this.tableData.filter(item => item.checked)))
      return selectedData.map(item => {
        delete item.checked
        return item
      })
    },
    allColumns() {
      const oldColumnComponents = this.columns.map(item => item.context)
      return this.getAllColumns(0, oldColumnComponents).map(item => {
        return { pos: item.pos, ...item.columnConfig }
      })
    },
    maxRows() {
      return this.allColumns.reduce((prev, now) => {
        prev = now.pos.row > prev ? now.pos.row : prev
        return prev
      }, 1)
    },
    headerRows() {
      const rows = []
      // TODO: MAXLEVEL
      for (let i = 1; i <= 3; i++) {
        rows.push([])
      }

      this.allColumns.forEach((column) => {
        if (!column.context.$children.length) {
          column.rowSpan = this.maxRows - column.pos.row + 1
          column.colSpan = 1
        } else {
          column.rowSpan = 1
          column.colSpan = column.context.$children.length
        }
        rows[column.pos.row - 1].push(column)
      })
      return rows
    }
  },
  watch: {
    allColumns: {
      handler: function(v) {
        this.realColumns = v.filter(item => !item.context.$children.length)
        this.setColWidth()
      }
    },
    data: {
      handler: function(v) {
        this.tableData = JSON.parse(JSON.stringify(v.map(item => {
          return { ...item, checked: false, expend: false }
        })))
        this.$nextTick(() => {
          this.$emit('selectChange', this.selected)
        })
      },
      immediate: true
    },
    height: {
      handler: function(v) {
        if (v) {
          this.calcHeight()
        }
      },
      immediate: true
    }
  },
  created() {
    this.$on('insertColumn', this.insertColumn)
  },
  mounted() {
    // this.calcTableWrapper()
  },
  methods: {
    insertColumn(config) {
      config.colID = this.colID
      config.sortDireaction = null
      this.colID++
      this.columns.push(config)
    },
    getRealColumn() {
      this.realColumns = this.allColumns.filter(item => !item.context.$children.length)
    },
    setColWidth() {
      const columnLength = this.realColumns.length
      const tableWidth = this.scrollY ? this.$el.clientWidth - this.scrollBarWidth : this.$el.clientWidth
      const setedWidthCol = this.realColumns.filter(item => item.width)
      const setedWidthNum = setedWidthCol.length
      const setedTotalWidth = setedWidthCol.reduce((prev, curr) => {
        if (curr.width) {
          prev += parseFloat(curr.width)
        }
        return prev
      }, 0)
      const avgWidth = (tableWidth - setedTotalWidth) / (columnLength - setedWidthNum)
      this.realColumns.forEach(column => {
        if (!column.width) {
          column.avgWidth = `${Math.ceil(avgWidth)}`
        }
      })
      this.realColumns = this.realColumns.slice(0)
    },
    allSelectionCallback() {
      const canCheckData = this.selectable ? this.tableData.filter((item, index) => !this.selectable(item, index)) : this.tableData
      const allSelect = canCheckData.every(item => item.checked)
      canCheckData.forEach(item => {
        item.checked = !allSelect
      })
      this.$emit('selectChange', this.selected)
    },
    checkCallback({ checked, index }) {
      this.tableData[index].checked = !this.tableData[index].checked
      this.$emit('selectChange', this.selected)
    },
    expendCallback({ trData, index }) {
      this.tableData[index].expend = !trData.expend
    },
    getObjectValue(obj, path) {
      const pathArr = path.split('.')
      let val = obj
      while (pathArr.length) {
        const symbol = pathArr.shift()
        val = val[symbol]
      }
      return val
    },
    sortCallback({ prop, direaction }) {
      const index = this.allColumns.findIndex(item => item.prop === prop)
      const oldDireaction = this.allColumns[index].sortDireaction
      const defaultSortFn = (a, b) => {
        const p1 = this.getObjectValue(a, prop)
        const p2 = this.getObjectValue(b, prop)
        if (typeof p1 === 'string' && typeof p2 === 'string') {
          return nowDireaction === 'A' ? p1.localeCompare(p2) : p2.localeCompare(p1)
        }
        if (typeof p1 === 'number' && typeof p2 === 'number') {
          return nowDireaction === 'A' ? p1 - p2 : p2 - p1
        }
        if (p1 === null || p1 === undefined) {
          return nowDireaction === 'D' ? 1 : -1
        }
        if (p2 === null || p2 === undefined) {
          return nowDireaction === 'D' ? -1 : 1
        }
        return nowDireaction === 'A' ? 1 : -1
      }
      let nowDireaction
      function _reset() {
        this.allColumns.forEach(item => {
          if (item.prop !== prop) {
            item.sortDireaction = null
          }
        })
      }
      if (oldDireaction === null) {
        nowDireaction = 'D'
      } else if (direaction === null) {
        nowDireaction = oldDireaction === 'A' ? 'D' : 'A'
      } else {
        nowDireaction = direaction
      }

      this.tableData.sort(defaultSortFn)
      _reset.call(this)
      this.allColumns[index].sortDireaction = nowDireaction
    },
    // 此函数引用自element-ui中table-column.js (本人写不好递归 😄)
    getAllColumns(level = 0, columns) {
      const result = []
      level++
      columns.forEach((column, index) => {
        column.pos = {
          col: index + 1,
          row: level
        }
        if (column.$children) {
          result.push(column)
          result.push.apply(result, this.getAllColumns(level, column.$children))
        } else {
          result.push(column)
        }
      })
      return result
    },
    calcHeight() {
      if (!this.$refs[this.tableHeaderRef]) return this.$nextTick(() => { this.calcHeight() })
      if (!this.$refs[this.tableHeaderRef].$el.clientHeight) return this.$nextTick(() => { this.calcHeight() })
      this.headerHeight = this.$refs[this.tableHeaderRef].$el.clientHeight
      this.bodyHeight = parseInt(this.height) - this.headerHeight
      this.$nextTick(() => {
        const body = this.$refs[this.tableBodyRef].$el
        this.scrollY = body.scrollHeight > body.clientHeight
        this.setColWidth()
      })
    }
    // calcTableWrapper() {
    //   if (!this.$refs[this.tableWrapperRef]) return this.$nextTick(() => { this.calcTableWrapper })
    //   if (!this.$refs[this.tableWrapperRef].offsetWidth) return this.$nextTick(() => { this.calcTableWrapper })
    //   this.tableWrapperWidth = this.$refs[this.tableWrapperRef].offsetWidth
    // }
  }
}
</script>
