import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-table',
    file: 'dist/vue-table.esm.js',
    format: 'es',
  },
})

export default config
