<template>
  <div
    :class="{ 'no-border': !border, [theme]:theme }"
    :style="tableWrapper"
    class="table-wrapper"
  >
    <slot />
    <table-header
      :columns="columns"
      :data="tableData"
      :border="border"
      @allSelection="allSelectionCallback"
      @sort="sortCallback"
    />
    <table-body
      :columns="columns"
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
    }
  },
  watch: {
    columns(v) {
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
  methods: {
    insertColumn(config) {
      config.colID = this.colID
      config.sortDireaction = null
      this.colID++
      this.columns.push(config)
    },
    setColWidth() {
      const columnLength = this.columns.length
      const tableWidth = this.$el.clientWidth
      const setedWidthCol = this.columns.filter(item => item.width)
      const setedWidthNum = setedWidthCol.length
      const setedTotalWidth = setedWidthCol.reduce((prev, curr) => {
        if (curr.width) {
          prev += parseFloat(curr.width)
        }
        return prev
      }, 0)
      const avgWidth = (tableWidth - setedTotalWidth) / (columnLength - setedWidthNum)
      this.columns.forEach(column => {
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
      const index = this.columns.findIndex(item => item.prop === prop)
      const oldDireaction = this.columns[index].sortDireaction
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
        this.columns.forEach(item => {
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
      this.columns[index].sortDireaction = nowDireaction
    }
  }
}
</script>