<template>
  <div
    :class="{ 'no-border': !border, [theme]:theme }"
    :style="tableWrapper"
    class="table-wrapper"
  >
    <slot />
    <table-header
      :columns="realColumns"
      :data="tableData"
      :border="border"
      @allSelection="allSelectionCallback"
      @sort="sortCallback"
    />
    <table-body
      :columns="realColumns"
      :data="tableData"
      :border="border"
      :row-class-name="rowClassName"
      @check="checkCallback"
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
      type: String,
      default: '500px'
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
    return {
      columns: [],
      colID: 0,
      tableData: []
    }
  },
  computed: {
    tableWrapper() {
      return {
        width: this.width
      }
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
    },
    realColumns() {
      return this.allColumns.filter(item => !item.context.$children.length)
    }
  },
  watch: {
    realColumns(v) {
      if (v.length === this.$slots.default.filter(item => !!item.tag).length) {
        this.setColWidth()
      }
    },
    data: {
      handler: function(v) {
        this.tableData = JSON.parse(JSON.stringify(v.map(item => {
          return { ...item, checked: false }
        })))
        this.$nextTick(() => {
          this.$emit('selectChange', this.selected)
        })
      },
      immediate: true
    }
  },
  created() {
    this.$on('insertColumn', this.insertColumn)
  },
  mounted() {
    // const oldColumn = this.$parent.columns.map(item => {
    //   return item.context
    // })

    // const newColumn = this.getAllColumns(0, oldColumn).map(item => {
    //   return { pos: item.pos, ...item.columnConfig }
    // })

    // const maxRows = newColumn.reduce((prev, now) => {
    //   prev = now.pos.row > prev ? now.pos.row : prev
    //   return prev
    // }, 1)

    // const rows = []

    // for (let i = 1; i <= 3; i++) {
    //   rows.push([])
    // }

    // newColumn.forEach((column) => {
    //   if (!column.context.$children.length) {
    //     column.rowSpan = maxRows - column.pos.row + 1
    //     column.colSpan = 1
    //   } else {
    //     column.rowSpan = 1
    //     column.colSpan = column.context.$children.length
    //   }
    //   rows[column.pos.row - 1].push(column)
    // })
  },
  methods: {
    insertColumn(config) {
      config.colID = this.colID
      config.sortDireaction = null
      this.colID++
      this.columns.push(config)
    },
    setColWidth() {
      const columnLength = this.realColumns.length
      const tableWidth = this.$el.clientWidth
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
          column.width = `${Math.ceil(avgWidth)}`
        }
      })
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
    }
  }
}
</script>
