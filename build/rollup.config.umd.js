import baseConfig from './rollup.config.base.js'

export default Object.assign(baseConfig, {
  exports: 'name',
  output: {
    file: 'dist/vue-table.umd.js',
    format: 'umd'
  }
})
