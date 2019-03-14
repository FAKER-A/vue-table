<script>
export default {
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
    }
  },
  computed: {
    allSelection: {
      get() {
        const canCheckData = this.$parent.selectable ? this.data.filter((item, index) => !this.$parent.selectable(item, index)) : this.data
        if (!canCheckData.length) return false
        return canCheckData.every(item => !!item.checked)
      }
    },
    maxDeep() {
      const deep = 0
      return deep
    }
  },
  methods: {
    select() {
      this.$emit('allSelection')
    },
    sort(prop, direaction) {
      this.$emit('sort', { prop, direaction })
    },
    renderSelectionTh(column, index) {
      return (
        <th
          key={ index + column.prop }
          rowSpan={ column.rowSpan }
          colSpan={ column.colSpan }
          class={ this.border ? '' : 'no-border' }>
          <div class='cell'>
            <label class='check-box'>
              <input
                class='check-box-input'
                checked={ this.allSelection }
                onClick={ this.select }
                type='checkbox' />
              <span class={ (this.allSelection ? 'is-checked' : '') + ' indicator' }></span>
            </label>
          </div>
        </th>
      )
    }
  },
  render() {
    return (
      <div class='qb-table-header-wrapper'>
        <table
          cellspacing='0'
          cellpadding='0'
          border='0'>
          <colgroup>
            { this.columns.map((column) => {
              return <col width={column.width}/>
            }) }
          </colgroup>
          <thead>
            {
              this.$parent.headerRows.map((columns, index) => (
                <tr>
                  { columns.map((column, index) => {
                    let html
                    switch (column.type) {
                      case 'selection':
                        html = this.renderSelectionTh(column, index)
                        break
                      case '':
                        html = <th
                          key={ index + column.prop }
                          rowSpan={ column.rowSpan }
                          colSpan={ column.colSpan }
                          class={ this.border ? `is-${column.headerAlign ? column.headerAlign : column.align}` : `no-border is-${column.headerAlign ? column.headerAlign : column.align}` }>
                          {
                            column.sort
                              ? <div class='cell'>
                                <span class='sortable' onClick = { this.sort.bind(this, column.prop, null) }>{ column.label }</span>
                                <span class='arrow-group' >
                                  <i
                                    class={ column.sortDireaction === 'A' ? 'active arrow arrow-up' : 'arrow arrow-up'}
                                    onClick = { this.sort.bind(this, column.prop, 'A') }
                                  />
                                  <i
                                    class={ column.sortDireaction === 'D' ? 'active arrow arrow-down' : 'arrow arrow-down'}
                                    onClick = { this.sort.bind(this, column.prop, 'D') }
                                  />
                                </span>
                              </div>
                              : <div class='cell'>
                                <span>{ column.label }</span>
                              </div>
                          }
                        </th>
                    }
                    return html
                  }) }
                </tr>
              ))
            }
          </thead>
        </table>
      </div>
    )
  }
}
</script>

<style lang="scss">

</style>
