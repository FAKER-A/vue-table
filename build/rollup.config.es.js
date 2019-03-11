import baseConfig from './rollup.config.base.js'

export default Object.assign(baseConfig, {
  output: {
    name: 'vue-table',
    file: 'dist/vue-table.esm.js',
    format: 'es'
  }
})
