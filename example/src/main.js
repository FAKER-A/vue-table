import Vue from 'vue'
import App from './App.vue'
import VueTable from '../../dist/vue-table.esm.js'
import '../../dist/vue-table.css'
Vue.use(VueTable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
