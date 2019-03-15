
<script>
export default {
  name: 'TableColumn',
  props: {
    label: {
      type: String,
      default: null
    },
    prop: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    sort: {
      type: Boolean,
      default: false
    },
    sortMethod: {
      type: Boolean,
      default: null
    },
    formatter: {
      type: Function,
      default: null
    },
    headerAlign: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: ''
    },
    showOverflowTooltip: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  created() {
    this.$options.render = h => h('div', { style: { display: 'none' }}, this.$slots.default)
  },
  mounted() {
    this.columnConfig = {
      ...this.$props,
      context: this,
      render: this.$scopedSlots.default
    }
    this.$parent.$emit('insertColumn', this.columnConfig)
  }

}
</script>
