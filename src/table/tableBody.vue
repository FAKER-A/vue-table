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
    expend(item, index) {
      this.$emit('expend', { trData: item, index })
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
    getExpendTdClass(column, trData, index) {
      const classArr = this.getDefaultTd(column, trData, index).split(' ')
      if (trData.expend) {
        classArr.push('expended')
      } else {
        classArr.push('expend')
      }
      return classArr.join(' ')
    },
    getDefaultTdClass(column, trData, index) {
      const classArr = []
      if (column.align) {
        classArr.push(`is-${column.align}`)
      }
      if (!this.border) {
        classArr.push('no-border')
      }
      return classArr.join(' ')
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
          class={ this.getDefaultTdClass(column, trData, index) }
          onClick={ e => e.stopPropagation() }
          onDblclick={ e => e.stopPropagation() }>
          <div class='cell'>
            <label class='check-box'>
              <input
                class='check-box-input'
                disabled={ this.$parent.selectable ? this.$parent.selectable.call(this, trData, index) : false }
                checked={ trData.checked }
                onClick={ this.check.bind(this, trData, index) }
                type='checkbox'/>
              <span class={ (trData.checked ? 'is-checked' : '') + ' indicator' }></span>
            </label>
          </div>
        </td>
      )
    },
    renderExpendTd(column, trData, index) {
      return (
        <td
          class={ this.getDefaultTdClass(column, trData, index) }>
          <div class='cell'>
            <i
              class={ trData.expend ? 'expend  expended' : 'expend' }
              onClick={ this.expend.bind(this, trData, index) }></i>
          </div>
        </td>
      )
    },
    renderDefaultTd(column, trData, index) {
      return (
        <td
          class={ this.getDefaultTdClass(column, trData, index) }
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
          class={ this.getDefaultTdClass(column, trData, index) }>
          <div class='cell' style={ { width: column.width + 'px' } }>
            {column.render({ row: trData, index })}
          </div>
        </td>
      )
    },
    renderExpendTr(column, trData, index) {
      return (
        <tr>
          <td colSpan={ this.columns.length }>
            <div class='cell'>
              { column.render({ row: trData, index }) }
            </div>
          </td>
        </tr>
      )
    },
    trClassname(index) {
      return index % 2 === 0 ? 'odd' : 'even'
    }
  },

  render() {
    const expendColumn = this.columns.filter(columns => columns.type === 'expend')
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
                return [
                  <tr
                    class={ this.rowClassName && typeof this.rowClassName === 'function' ? this.trClassname(index) + ' ' + this.rowClassName({ row: trData, rowIndex: index }) : this.trClassname(index) }
                    onClick={ (e) => { this.trClick(trData, e) } }
                    onDblclick= { (e) => { this.trDblClick(trData, e) } }>
                    {
                      this.columns.map(column => {
                        switch (column.type) {
                          case 'selection':
                            return this.renderSelectionTd(column, trData, index)
                          case 'expend':
                            return this.renderExpendTd(column, trData, index)
                          case '':
                            if (column.render) {
                              return this.renderCustomizeTd(column, trData, index)
                            }
                            return this.renderDefaultTd(column, trData, index)
                        }
                      })
                    }
                  </tr>,

                  expendColumn.length && trData.expend ? this.renderExpendTr(expendColumn[0], trData, index) : null

                ]
              })
            }

          </tbody>
        </table>
      </div>
    )
  }
}
</script>
