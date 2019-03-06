import fs from 'fs'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import cjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import eslint from 'rollup-plugin-eslint'
import CleanCss from 'clean-css'
import config from '../package.json'

export default {
  input: 'src/index.js',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    cjs(),
    eslint(),
    vue(),
    babel({
      exclude: 'node_modules/**',
      'plugins': [
        'external-helpers',
      ],
    }),
    replace({
      VERSION: JSON.stringify(config.version),
    }),
  ],
  watch: {
    include: 'src/**',
  },
  external: [
    'vue',
  ],
}
