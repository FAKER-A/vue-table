var script = {
  props: {
    columns: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    allSelection: {
      get: function get() {
        var _this = this;

        var canCheckData = this.$parent.selectable ? this.data.filter(function (item, index) {
          return !_this.$parent.selectable(item, index);
        }) : this.data;
        if (!canCheckData.length) { return false; }
        return canCheckData.every(function (item) {
          return !!item.checked;
        });
      }
    }
  },
  methods: {
    select: function select() {
      this.$emit('allSelection');
    },
    sort: function sort(prop, direaction) {
      this.$emit('sort', { prop: prop, direaction: direaction });
    },
    renderSelectionTh: function renderSelectionTh(column, index) {
      var h = this.$createElement;

      return h(
        'th',
        {
          key: index + column.prop,
          'class': this.border ? '' : 'no-border' },
        [h(
          'div',
          { 'class': 'cell' },
          [h(
            'label',
            { 'class': 'check-box' },
            [h('input', {
              'class': 'check-box-input',
              domProps: {
                'checked': this.allSelection
              },
              on: {
                'click': this.select
              },
              attrs: {
                type: 'checkbox' }
            }), h('span', { 'class': (this.allSelection ? 'is-checked' : '') + ' indicator' })]
          )]
        )]
      );
    }
    // renderDefault

  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    return h(
      'div',
      { 'class': 'qb-table-header-wrapper' },
      [h(
        'table',
        {
          attrs: {
            cellspacing: '0',
            cellpadding: '0',
            border: '0' }
        },
        [h('colgroup', [this.columns.map(function (column) {
          return h('col', {
            attrs: { width: column.width }
          });
        })]), h('thead', [h('tr', [this.columns.map(function (column, index) {
          var html = void 0;
          switch (column.type) {
            case 'selection':
              html = _this2.renderSelectionTh(column, index);
              break;
            case '':
              html = h(
                'th',
                { key: index + column.prop, 'class': _this2.border ? 'is-' + (column.headerAlign ? column.headerAlign : column.align) : 'no-border is-' + (column.headerAlign ? column.headerAlign : column.align) },
                [column.sort ? h(
                  'div',
                  { 'class': 'cell' },
                  [h(
                    'span',
                    { 'class': 'sortable', on: {
                        'click': _this2.sort.bind(_this2, column.prop, null)
                      }
                    },
                    [column.label]
                  ), h(
                    'span',
                    { 'class': 'arrow-group' },
                    [h('i', {
                      'class': column.sortDireaction === 'A' ? 'active arrow arrow-up' : 'arrow arrow-up',
                      on: {
                        'click': _this2.sort.bind(_this2, column.prop, 'A')
                      }
                    }), h('i', {
                      'class': column.sortDireaction === 'D' ? 'active arrow arrow-down' : 'arrow arrow-down',
                      on: {
                        'click': _this2.sort.bind(_this2, column.prop, 'D')
                      }
                    })]
                  )]
                ) : h(
                  'div',
                  { 'class': 'cell' },
                  [h('span', [column.label])]
                )]
              );
          }
          return html;
        })])])]
      )]
    );
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */

/* style */
var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) { return; }
  inject("data-v-b1b3a97e_0", { source: "\n/*# sourceMappingURL=tableHeader.vue.map */", map: { "version": 3, "sources": ["tableHeader.vue"], "names": [], "mappings": ";AACA,0CAA0C", "file": "tableHeader.vue" }, media: undefined });
};
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = undefined;
/* style inject SSR */

var TableHeader = normalizeComponent_1({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, browser, undefined);

var script$1 = {
  mixins: [],
  props: {
    columns: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    border: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default: null
    }
  },
  watch: {},
  methods: {
    check: function check(item, index) {
      this.$emit('check', { checked: item, index: index });
    },
    tdClick: function tdClick(row, column, td, event) {
      this.$parent.$emit('tdClick', { row: row, column: column, td: td, event: event });
    },
    tdDblClick: function tdDblClick(row, column, td, event) {
      this.$parent.$emit('tdDblClick', { row: row, column: column, td: td, event: event });
    },
    trClick: function trClick(row, event) {
      this.$parent.$emit('trClick', { row: row, event: event });
    },
    trDblClick: function trDblClick(row, event) {
      this.$parent.$emit('trDblClick', { row: row, event: event });
    },
    getObjectValue: function getObjectValue(obj, path) {
      var pathArr = path.split('.');
      var val = obj;
      while (pathArr.length) {
        var symbol = pathArr.shift();
        val = val[symbol];
      }
      return val;
    },
    renderSelectionTd: function renderSelectionTd(column, trData, index) {
      var h = this.$createElement;

      return h(
        'td',
        {
          'class': this.border ? 'is-' + column.align : 'no-border is-' + column.align,
          on: {
            'click': function click(e) {
              return e.stopPropagation();
            },
            'dblclick': function dblclick(e) {
              return e.stopPropagation();
            }
          }
        },
        [h(
          'div',
          { 'class': 'cell' },
          [h(
            'label',
            { 'class': 'check-box' },
            [h('input', {
              'class': 'check-box-input',
              attrs: { disabled: this.$parent.selectable ? this.$parent.selectable.call(this, trData, index) : false,

                type: 'checkbox' },
              domProps: {
                'checked': trData.checked
              },
              on: {
                'click': this.check.bind(this, trData, index)
              }
            }), h('span', { 'class': (trData.checked ? 'is-checked' : '') + ' indicator' })]
          )]
        )]
      );
    },
    renderDefaultTd: function renderDefaultTd(column, trData, index) {
      var _this = this;

      var h = this.$createElement;

      return h(
        'td',
        {
          'class': this.border ? 'is-' + column.align : 'no-border is-' + column.align,
          on: {
            'click': function click(e) {
              _this.tdClick(trData, column, trData[column.prop], e);
            },
            'dblclick': function dblclick(e) {
              _this.tdDblClick(trData, column, trData[column.prop], e);
            }
          }
        },
        [h(
          'div',
          { 'class': 'cell', style: { width: column.width + 'px' } },
          [column.formatter && typeof column.formatter === 'function' ? column.formatter(this.getObjectValue(trData, column.prop)) : this.getObjectValue(trData, column.prop)]
        )]
      );
    },
    renderCustomizeTd: function renderCustomizeTd(column, trData, index) {
      var h = this.$createElement;

      return h(
        'td',
        {
          'class': this.border ? 'is-' + column.align : 'no-border is-' + column.align },
        [h(
          'div',
          { 'class': 'cell', style: { width: column.width + 'px' } },
          [column.render({ row: trData, index: index })]
        )]
      );
    },
    trClassname: function trClassname(index) {
      return index % 2 === 0 ? 'odd' : 'even';
    }
  },

  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    return h(
      'div',
      { 'class': 'qb-table-body-wrapper hover-highlight' },
      [h(
        'table',
        {
          attrs: {
            cellspacing: '0',
            cellpadding: '0',
            border: '0' }
        },
        [h('colgroup', [this.columns.map(function (column) {
          return h('col', {
            attrs: { width: column.width }
          });
        })]), h('tbody', [this.data.map(function (trData, index) {
          return h(
            'tr',
            {
              'class': _this2.rowClassName && typeof _this2.rowClassName === 'function' ? _this2.trClassname(index) + ' ' + _this2.rowClassName({ row: trData, rowIndex: index }) : _this2.trClassname(index),
              on: {
                'click': function click(e) {
                  _this2.trClick(trData, e);
                },
                'dblclick': function dblclick(e) {
                  _this2.trDblClick(trData, e);
                }
              }
            },
            [_this2.columns.map(function (column) {
              switch (column.type) {
                case 'selection':
                  return _this2.renderSelectionTd(column, trData, index);
                case '':
                  if (column.render) {
                    return _this2.renderCustomizeTd(column, trData, index);
                  }
                  return _this2.renderDefaultTd(column, trData, index);
              }
            })]
          );
        })])]
      )]
    );
  }
};

/* script */
var __vue_script__$1 = script$1;

/* template */

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = undefined;
/* style inject */

/* style inject SSR */

var TableBody = normalizeComponent_1({}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

//
var script$2 = {
  components: {
    TableHeader: TableHeader,
    TableBody: TableBody
  },
  props: {
    data: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    width: {
      type: String,
      default: '100%'
    },
    theme: {
      type: String,
      default: 'black'
    },
    height: {
      type: String,
      default: '500px'
    },
    border: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default: null
    },
    selectable: {
      type: Function,
      default: null
    }
  },
  data: function data() {
    return {
      columns: [],
      colID: 0,
      tableData: []
    };
  },

  computed: {
    tableWrapper: function tableWrapper() {
      return {
        width: this.width
      };
    },
    selected: function selected() {
      var selectedData = JSON.parse(JSON.stringify(this.tableData.filter(function (item) {
        return item.checked;
      })));
      return selectedData.map(function (item) {
        delete item.checked;
        return item;
      });
    }
  },
  watch: {
    columns: function columns(v) {
      if (v.length === this.$slots.default.filter(function (item) {
        return !!item.tag;
      }).length) {
        this.setColWidth();
      }
    },

    data: {
      handler: function handler(v) {
        var _this = this;

        this.tableData = JSON.parse(JSON.stringify(v.map(function (item) {
          return _extends({}, item, { checked: false });
        })));
        this.$nextTick(function () {
          _this.$emit('selectChange', _this.selected);
        });
      },
      immediate: true
    }
  },
  created: function created() {
    this.$on('insertColumn', this.insertColumn);
  },

  methods: {
    insertColumn: function insertColumn(config) {
      config.colID = this.colID;
      config.sortDireaction = null;
      this.colID++;
      this.columns.push(config);
    },
    setColWidth: function setColWidth() {
      var columnLength = this.columns.length;
      var tableWidth = this.$el.clientWidth;
      var setedWidthCol = this.columns.filter(function (item) {
        return item.width;
      });
      var setedWidthNum = setedWidthCol.length;
      var setedTotalWidth = setedWidthCol.reduce(function (prev, curr) {
        if (curr.width) {
          prev += parseFloat(curr.width);
        }
        return prev;
      }, 0);
      var avgWidth = (tableWidth - setedTotalWidth) / (columnLength - setedWidthNum);
      this.columns.forEach(function (column) {
        if (!column.width) {
          column.width = '' + Math.ceil(avgWidth);
        }
      });
    },
    allSelectionCallback: function allSelectionCallback() {
      var _this2 = this;

      var canCheckData = this.selectable ? this.tableData.filter(function (item, index) {
        return !_this2.selectable(item, index);
      }) : this.tableData;
      var allSelect = canCheckData.every(function (item) {
        return item.checked;
      });
      canCheckData.forEach(function (item) {
        item.checked = !allSelect;
      });
      this.$emit('selectChange', this.selected);
    },
    checkCallback: function checkCallback(_ref) {
      var checked = _ref.checked,
          index = _ref.index;

      this.tableData[index].checked = !this.tableData[index].checked;
      this.$emit('selectChange', this.selected);
    },
    getObjectValue: function getObjectValue(obj, path) {
      var pathArr = path.split('.');
      var val = obj;
      while (pathArr.length) {
        var symbol = pathArr.shift();
        val = val[symbol];
      }
      return val;
    },
    sortCallback: function sortCallback(_ref2) {
      var _this3 = this;

      var prop = _ref2.prop,
          direaction = _ref2.direaction;

      var index = this.columns.findIndex(function (item) {
        return item.prop === prop;
      });
      var oldDireaction = this.columns[index].sortDireaction;
      var defaultSortFn = function defaultSortFn(a, b) {
        var p1 = _this3.getObjectValue(a, prop);
        var p2 = _this3.getObjectValue(b, prop);
        if (typeof p1 === 'string' && typeof p2 === 'string') {
          return nowDireaction === 'A' ? p1.localeCompare(p2) : p2.localeCompare(p1);
        }
        if (typeof p1 === 'number' && typeof p2 === 'number') {
          return nowDireaction === 'A' ? p1 - p2 : p2 - p1;
        }
        if (p1 === null || p1 === undefined) {
          return nowDireaction === 'D' ? 1 : -1;
        }
        if (p2 === null || p2 === undefined) {
          return nowDireaction === 'D' ? -1 : 1;
        }
        return nowDireaction === 'A' ? 1 : -1;
      };
      var nowDireaction = void 0;
      function _reset() {
        this.columns.forEach(function (item) {
          if (item.prop !== prop) {
            item.sortDireaction = null;
          }
        });
      }
      if (oldDireaction === null) {
        nowDireaction = 'D';
      } else if (direaction === null) {
        nowDireaction = oldDireaction === 'A' ? 'D' : 'A';
      } else {
        nowDireaction = direaction;
      }

      this.tableData.sort(defaultSortFn);
      _reset.call(this);
      this.columns[index].sortDireaction = nowDireaction;
    }
  }
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__ = function __vue_render__() {
  var _obj;
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", {
    staticClass: "table-wrapper",
    class: (_obj = { "no-border": !_vm.border }, _obj[_vm.theme] = _vm.theme, _obj),
    style: _vm.tableWrapper
  }, [_vm._t("default"), _vm._v(" "), _c("table-header", {
    attrs: {
      columns: _vm.columns,
      data: _vm.tableData,
      border: _vm.border
    },
    on: { allSelection: _vm.allSelectionCallback, sort: _vm.sortCallback }
  }), _vm._v(" "), _c("table-body", {
    attrs: {
      columns: _vm.columns,
      data: _vm.tableData,
      border: _vm.border,
      "row-class-name": _vm.rowClassName
    },
    on: { check: _vm.checkCallback }
  })], 2);
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

/* style */
var __vue_inject_styles__$2 = undefined;
/* scoped */
var __vue_scope_id__$2 = undefined;
/* module identifier */
var __vue_module_identifier__$2 = undefined;
/* functional template */
var __vue_is_functional_template__$2 = false;
/* style inject */

/* style inject SSR */

var VueTable = normalizeComponent_1({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, undefined, undefined);

//

var script$3 = {
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
  data: function data() {
    return {};
  },
  created: function created() {},
  mounted: function mounted() {
    this.columnConfig = _extends({}, this.$props, {
      render: this.$scopedSlots.default
    });
    this.$parent.$emit('insertColumn', this.columnConfig);
  },
  render: function render() {
    return null;
  }
};

/* script */
var __vue_script__$3 = script$3;

/* template */

/* style */
var __vue_inject_styles__$3 = undefined;
/* scoped */
var __vue_scope_id__$3 = undefined;
/* module identifier */
var __vue_module_identifier__$3 = undefined;
/* functional template */
var __vue_is_functional_template__$3 = undefined;
/* style inject */

/* style inject SSR */

var VueTableColumn = normalizeComponent_1({}, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, undefined, undefined);

function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component('v-table', VueTable);
  Vue.component('v-table-column', VueTableColumn);
}

export default install;
