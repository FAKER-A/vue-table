import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-table',
    file: 'dist/vue-table.umd.js',
    format: 'umd',
  },
})

export default config
