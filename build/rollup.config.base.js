import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import buble from 'rollup-plugin-buble'
import postcss from 'rollup-plugin-postcss'
import { eslint } from 'rollup-plugin-eslint'
import autoprefixer from 'autoprefixer'
export default {
  input: 'src/index.js',
  plugins: [
    eslint(),
    postcss({
      extract: 'dist/vue-table.css',
      plugins: [autoprefixer()]
      // sourceMap: true,
      // minimize: true
    }),
    vue(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    buble({
      objectAssign: 'Object.assign',
      jsx: 'h'
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    cjs()
  ],
  watch: {
    include: 'src/**'
  },
  external: [
    'vue'
  ]
}
