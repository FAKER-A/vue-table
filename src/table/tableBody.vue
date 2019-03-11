<script>
export default {
  mixins: [],
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default: null
    }
  },
  watch: {
  },
  methods: {
    check(item, index) {
      this.$emit('check', { checked: item, index })
    },
    tdClick(row, column, td, event) {
      this.$parent.$emit('tdClick', { row, column, td, event })
    },
    tdDblClick(row, column, td, event) {
      this.$parent.$emit('tdDblClick', { row, column, td, event })
    },
    trClick(row, event) {
      this.$parent.$emit('trClick', { row, event })
    },
    trDblClick(row, event) {
      this.$parent.$emit('trDblClick', { row, event })
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
    renderSelectionTd(column, trData, index) {
      return (
        <td
          class={ this.border ? `is-${column.align}` : `no-border is-${column.align}` }
          onClick={ e => e.stopPropagation() }
          onDblclick={ e => e.stopPropagation() }>
          <div class='cell'>
            <label class='check-box'>
              <input
                disabled={ this.$parent.selectable ? this.$parent.selectable.call(this, trData, index) : false }
                checked={ trData.checked }
                onClick={ this.check.bind(this, trData, index) }
                type='checkbox'/>
              <span class='indicator'></span>
            </label>
          </div>
        </td>
      )
    },
    renderDefaultTd(column, trData, index) {
      return (
        <td
          class={ this.border ? `is-${column.align}` : `no-border is-${column.align}` }
          onClick={(e) => { this.tdClick(trData, column, trData[column.prop], e) }}
          onDblclick={(e) => { this.tdDblClick(trData, column, trData[column.prop], e) }}>
          <div class='cell' style={ { width: column.width + 'px' } }>
            { column.formatter && typeof column.formatter === 'function' ? column.formatter(this.getObjectValue(trData, column.prop)) : this.getObjectValue(trData, column.prop)}
          </div>
        </td>
      )
    },
    renderCustomizeTd(column, trData, index) {
      return (
        <td
          class={ this.border ? `is-${column.align}` : `no-border is-${column.align}` }>
          <div class='cell' style={ { width: column.width + 'px' } }>
            {column.render({ row: trData, index })}
          </div>
        </td>
      )
    },
    trClassname(index) {
      return index % 2 === 0 ? 'odd' : 'even'
    }
  },

  render() {
    return (
      <div class='qb-table-body-wrapper hover-highlight'>
        <table
          cellspacing='0'
          cellpadding='0'
          border='0'>
          <colgroup>
            { this.columns.map((column) => {
              return <col width={column.width}/>
            })
            }
          </colgroup>
          <tbody>
            {
              this.data.map((trData, index) => {
                return (
                  <tr
                    class={ this.rowClassName && typeof this.rowClassName === 'function' ? this.trClassname(index) + ' ' + this.rowClassName({ row: trData, rowIndex: index }) : this.trClassname(index) }
                    onClick={ (e) => { this.trClick(trData, e) } }
                    onDblclick= { (e) => { this.trDblClick(trData, e) } }>
                    {
                      this.columns.map(column => {
                        switch (column.type) {
                          case 'selection':
                            return this.renderSelectionTd(column, trData, index)
                          case '':
                            if (column.render) {
                              return this.renderCustomizeTd(column, trData, index)
                            }
                            return this.renderDefaultTd(column, trData, index)
                        }
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}
</script>
