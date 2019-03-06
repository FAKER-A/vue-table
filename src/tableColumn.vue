
<script>
export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    prop: {
      type: String,
      default: null,
    },
    width: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    sort: {
      type: Boolean,
      default: false,
    },
    sortMethod: {
      type: Boolean,
      default: null,
    },
    formatter: {
      type: Function,
      default: null,
    },
    headerAlign: {
      type: String,
      default: '',
    },
    align: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
    this.columnConfig = {
      ...this.$props,
      render: this.$scopedSlots.default,
    }
    this.$parent.$emit('insertColumn', this.columnConfig)
  },
  render () {
    return null
  },
}
</script>
