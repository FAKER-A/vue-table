import VueTable from './table/table.vue'
import VueTableColumn from './table/tableColumn.vue'
import './table/table.scss'

export default function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('v-table', VueTable)
  Vue.component('v-table-column', VueTableColumn)
}
