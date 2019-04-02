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
    },
    width: {
      type: Number,
      default: 0
    }
  },
  data: function data() {
    return {
      deep: 0
    };
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
          attrs: { rowSpan: column.rowSpan,
            colSpan: column.colSpan
          },
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
    },
    renderExpendTh: function renderExpendTh(column, index) {
      var h = this.$createElement;

      return h(
        'th',
        {
          key: index + column.prop,
          attrs: { rowSpan: column.rowSpan,
            colSpan: column.colSpan
          },
          'class': this.border ? '' : 'no-border' },
        [h('div', { 'class': 'cell' })]
      );
    }
  },
  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    console.log('xx', this.columns);
    return h(
      'div',
      { 'class': 'qb-table-header-wrapper' },
      [h(
        'table',
        {
          attrs: {
            cellspacing: '0',
            cellpadding: '0',
            border: '0'
          },
          style: { width: this.width + 'px' } },
        [h('colgroup', [this.columns.map(function (column) {
          return h('col', {
            attrs: { width: column.width ? column.width : column.avgWidth }
          });
        })]), h('thead', [this.$parent.headerRows.map(function (columns, index) {
          return h('tr', [columns.map(function (column, index) {
            var html = void 0;
            switch (column.type) {
              case 'selection':
                html = _this2.renderSelectionTh(column, index);
                break;
              case 'expend':
                html = _this2.renderExpendTh(column, index);
                break;
              case '':
                html = h(
                  'th',
                  {
                    key: index + column.prop,
                    attrs: { rowSpan: column.rowSpan,
                      colSpan: column.colSpan
                    },
                    'class': _this2.border ? 'is-' + (column.headerAlign ? column.headerAlign : column.align) : 'no-border is-' + (column.headerAlign ? column.headerAlign : column.align) },
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
          })]);
        })])]
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
  inject("data-v-6c6b1882_0", { source: "\n/*# sourceMappingURL=tableHeader.vue.map */", map: { "version": 3, "sources": ["tableHeader.vue"], "names": [], "mappings": ";AACA,0CAA0C", "file": "tableHeader.vue" }, media: undefined });
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
    },
    height: {
      type: [Number, null],
      default: null
    },
    width: {
      type: Number,
      default: 0
    }
  },
  watch: {},
  methods: {
    check: function check(item, index) {
      this.$emit('check', { checked: item, index: index });
    },
    expend: function expend(item, index) {
      this.$emit('expend', { trData: item, index: index });
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
    getExpendTdClass: function getExpendTdClass(column, trData, index) {
      var classArr = this.getDefaultTd(column, trData, index).split(' ');
      if (trData.expend) {
        classArr.push('expended');
      } else {
        classArr.push('expend');
      }
      return classArr.join(' ');
    },
    getDefaultTdClass: function getDefaultTdClass(column, trData, index) {
      var classArr = [];
      if (column.align) {
        classArr.push('is-' + column.align);
      }
      if (!this.border) {
        classArr.push('no-border');
      }
      return classArr.join(' ');
    },
    getTableWrapperClass: function getTableWrapperClass() {
      var classArr = ['qb-table-body-wrapper', 'hover-highlight'];
      if (this.height) {
        classArr.push('table-body-wrapper-fixed');
      }
      return classArr.join(' ');
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
          'class': this.getDefaultTdClass(column, trData, index),
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
    renderExpendTd: function renderExpendTd(column, trData, index) {
      var h = this.$createElement;

      return h(
        'td',
        {
          'class': this.getDefaultTdClass(column, trData, index) },
        [h(
          'div',
          { 'class': 'cell' },
          [h('i', {
            'class': trData.expend ? 'expend  expended' : 'expend',
            on: {
              'click': this.expend.bind(this, trData, index)
            }
          })]
        )]
      );
    },
    renderDefaultTd: function renderDefaultTd(column, trData, index) {
      var _this = this;

      var h = this.$createElement;

      return h(
        'td',
        {
          'class': this.getDefaultTdClass(column, trData, index),
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
          { 'class': 'cell', style: { width: (column.width ? column.width : column.avgWidth) + 'px' } },
          [column.formatter && typeof column.formatter === 'function' ? column.formatter(this.getObjectValue(trData, column.prop)) : this.getObjectValue(trData, column.prop)]
        )]
      );
    },
    renderCustomizeTd: function renderCustomizeTd(column, trData, index) {
      var h = this.$createElement;

      return h(
        'td',
        {
          'class': this.getDefaultTdClass(column, trData, index) },
        [h(
          'div',
          { 'class': 'cell', style: { width: (column.width ? column.width : column.avgWidth) + 'px' } },
          [column.render({ row: trData, index: index })]
        )]
      );
    },
    renderExpendTr: function renderExpendTr(column, trData, index) {
      var h = this.$createElement;

      return h('tr', [h(
        'td',
        {
          attrs: { colSpan: this.columns.length }
        },
        [h(
          'div',
          { 'class': 'cell' },
          [column.render({ row: trData, index: index })]
        )]
      )]);
    },
    trClassname: function trClassname(index) {
      return index % 2 === 0 ? 'odd' : 'even';
    }
  },

  render: function render() {
    var _this2 = this;

    var h = arguments[0];

    var expendColumn = this.columns.filter(function (columns) {
      return columns.type === 'expend';
    });
    return h(
      'div',
      { 'class': this.getTableWrapperClass(), style: { height: this.height ? this.height + 'px' : null } },
      [h(
        'table',
        {
          attrs: {
            cellspacing: '0',
            cellpadding: '0',
            border: '0'
          },
          style: { width: this.width + 'px' } },
        [h('colgroup', [this.columns.map(function (column) {
          return h('col', {
            attrs: { width: column.width ? column.width : column.avgWidth }
          });
        })]), h('tbody', [this.data.map(function (trData, index) {
          return [h(
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
                case 'expend':
                  return _this2.renderExpendTd(column, trData, index);
                case '':
                  if (column.render) {
                    return _this2.renderCustomizeTd(column, trData, index);
                  }
                  return _this2.renderDefaultTd(column, trData, index);
              }
            })]
          ), expendColumn.length && trData.expend ? _this2.renderExpendTr(expendColumn[0], trData, index) : null];
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
      type: [String, null],
      default: null
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
    var getScrollbarWidth = function getScrollbarWidth() {
      var outer = document.createElement('div');
      outer.style = {
        position: 'absolute',
        left: '-10000000px',
        width: '100px',
        visibility: 'hidden'
      };
      document.body.appendChild(outer);
      var outerWidth = outer.offsetWidth;
      outer.style.overflow = 'scroll';
      var inner = document.createElement('div');
      inner.style = {
        width: '100%'
      };
      outer.appendChild(inner);
      var innerWidth = inner.offsetWidth;
      var scrollbarWidth = outerWidth - innerWidth;
      outer.parentNode.removeChild(outer);
      return scrollbarWidth;
    };
    return {
      columns: [],
      colID: 0,
      tableData: [],
      headerHeight: null,
      bodyHeight: null,
      maxLevel: 0,
      tableID: Math.random() * Math.random(),
      scrollBarWidth: getScrollbarWidth(),
      scrollY: false,
      realColumns: [],
      tableWrapperWidth: null
    };
  },

  computed: {
    tableHeaderRef: function tableHeaderRef() {
      return 'table_header_' + this.tableID;
    },
    tableBodyRef: function tableBodyRef() {
      return 'table_body_' + this.tableID;
    },
    tableWrapperRef: function tableWrapperRef() {
      return 'table_wrapper_' + this.tableID;
    },
    tableWrapper: function tableWrapper() {
      return {
        width: this.width
      };
    },
    tableHeaderWidth: function tableHeaderWidth() {
      return this.realColumns.reduce(function (prev, next) {
        if (next.width) { prev += parseInt(next.width); }
        if (next.avgWidth) { prev += parseInt(next.avgWidth); }
        return prev;
      }, 0);
      // let width = null
      // if (!this.scrollY) width = this.tableWrapperWidth
      // width = this.tableWrapperWidth - this.scrollBarWidth
      // return width
    },
    selected: function selected() {
      var selectedData = JSON.parse(JSON.stringify(this.tableData.filter(function (item) {
        return item.checked;
      })));
      return selectedData.map(function (item) {
        delete item.checked;
        return item;
      });
    },
    allColumns: function allColumns() {
      var oldColumnComponents = this.columns.map(function (item) {
        return item.context;
      });
      return this.getAllColumns(0, oldColumnComponents).map(function (item) {
        return _extends({ pos: item.pos }, item.columnConfig);
      });
    },
    maxRows: function maxRows() {
      return this.allColumns.reduce(function (prev, now) {
        prev = now.pos.row > prev ? now.pos.row : prev;
        return prev;
      }, 1);
    },
    headerRows: function headerRows() {
      var _this = this;

      var rows = [];
      // TODO: MAXLEVEL
      for (var i = 1; i <= 3; i++) {
        rows.push([]);
      }

      this.allColumns.forEach(function (column) {
        if (!column.context.$children.length) {
          column.rowSpan = _this.maxRows - column.pos.row + 1;
          column.colSpan = 1;
        } else {
          column.rowSpan = 1;
          column.colSpan = column.context.$children.length;
        }
        rows[column.pos.row - 1].push(column);
      });
      return rows;
    }
  },
  watch: {
    allColumns: {
      handler: function handler(v) {
        this.realColumns = v.filter(function (item) {
          return !item.context.$children.length;
        });
        this.setColWidth();
      }
    },
    data: {
      handler: function handler(v) {
        var _this2 = this;

        this.tableData = JSON.parse(JSON.stringify(v.map(function (item) {
          return _extends({}, item, { checked: false, expend: false });
        })));
        this.$nextTick(function () {
          _this2.$emit('selectChange', _this2.selected);
        });
      },
      immediate: true
    },
    height: {
      handler: function handler(v) {
        if (v) {
          this.calcHeight();
        }
      },
      immediate: true
    }
  },
  created: function created() {
    this.$on('insertColumn', this.insertColumn);
  },
  mounted: function mounted() {
    // this.calcTableWrapper()
  },

  methods: {
    insertColumn: function insertColumn(config) {
      config.colID = this.colID;
      config.sortDireaction = null;
      this.colID++;
      this.columns.push(config);
    },
    getRealColumn: function getRealColumn() {
      this.realColumns = this.allColumns.filter(function (item) {
        return !item.context.$children.length;
      });
    },
    setColWidth: function setColWidth() {
      var columnLength = this.realColumns.length;
      var tableWidth = this.scrollY ? this.$el.clientWidth - this.scrollBarWidth : this.$el.clientWidth;
      var setedWidthCol = this.realColumns.filter(function (item) {
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
      this.realColumns.forEach(function (column) {
        if (!column.width) {
          column.avgWidth = '' + Math.ceil(avgWidth);
        }
      });
      this.realColumns = this.realColumns.slice(0);
    },
    allSelectionCallback: function allSelectionCallback() {
      var _this3 = this;

      var canCheckData = this.selectable ? this.tableData.filter(function (item, index) {
        return !_this3.selectable(item, index);
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
    expendCallback: function expendCallback(_ref2) {
      var trData = _ref2.trData,
          index = _ref2.index;

      this.tableData[index].expend = !trData.expend;
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
    sortCallback: function sortCallback(_ref3) {
      var _this4 = this;

      var prop = _ref3.prop,
          direaction = _ref3.direaction;

      var index = this.allColumns.findIndex(function (item) {
        return item.prop === prop;
      });
      var oldDireaction = this.allColumns[index].sortDireaction;
      var defaultSortFn = function defaultSortFn(a, b) {
        var p1 = _this4.getObjectValue(a, prop);
        var p2 = _this4.getObjectValue(b, prop);
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
        this.allColumns.forEach(function (item) {
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
      this.allColumns[index].sortDireaction = nowDireaction;
    },

    // 此函数引用自element-ui中table-column.js (本人写不好递归 😄)
    getAllColumns: function getAllColumns() {
      var _this5 = this;

      var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var columns = arguments[1];

      var result = [];
      level++;
      columns.forEach(function (column, index) {
        column.pos = {
          col: index + 1,
          row: level
        };
        if (column.$children) {
          result.push(column);
          result.push.apply(result, _this5.getAllColumns(level, column.$children));
        } else {
          result.push(column);
        }
      });
      return result;
    },
    calcHeight: function calcHeight() {
      var _this6 = this;

      if (!this.$refs[this.tableHeaderRef]) { return this.$nextTick(function () {
        _this6.calcHeight();
      }); }
      if (!this.$refs[this.tableHeaderRef].$el.clientHeight) { return this.$nextTick(function () {
        _this6.calcHeight();
      }); }
      this.headerHeight = this.$refs[this.tableHeaderRef].$el.clientHeight;
      this.bodyHeight = parseInt(this.height) - this.headerHeight;
      this.$nextTick(function () {
        var body = _this6.$refs[_this6.tableBodyRef].$el;
        _this6.scrollY = body.scrollHeight > body.clientHeight;
        _this6.setColWidth();
      });
    }
    // calcTableWrapper() {
    //   if (!this.$refs[this.tableWrapperRef]) return this.$nextTick(() => { this.calcTableWrapper })
    //   if (!this.$refs[this.tableWrapperRef].offsetWidth) return this.$nextTick(() => { this.calcTableWrapper })
    //   this.tableWrapperWidth = this.$refs[this.tableWrapperRef].offsetWidth
    // }

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
    ref: _vm.tableWrapperRef,
    staticClass: "table-wrapper",
    class: (_obj = { "no-border": !_vm.border }, _obj[_vm.theme] = _vm.theme, _obj["table-wrapper-fixed"] = _vm.scrollY, _obj),
    style: _vm.tableWrapper
  }, [_vm._t("default"), _vm._v(" "), _c("table-header", {
    ref: _vm.tableHeaderRef,
    attrs: {
      columns: _vm.realColumns,
      data: _vm.tableData,
      border: _vm.border,
      width: _vm.tableHeaderWidth
    },
    on: { allSelection: _vm.allSelectionCallback, sort: _vm.sortCallback }
  }), _vm._v(" "), _c("table-body", {
    ref: _vm.tableBodyRef,
    attrs: {
      columns: _vm.realColumns,
      data: _vm.tableData,
      border: _vm.border,
      height: _vm.bodyHeight,
      width: _vm.tableHeaderWidth,
      "row-class-name": _vm.rowClassName
    },
    on: { check: _vm.checkCallback, expend: _vm.expendCallback }
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
  data: function data() {
    return {};
  },
  created: function created() {
    var _this = this;

    this.$options.render = function (h) {
      return h('div', { style: { display: 'none' } }, _this.$slots.default);
    };
  },
  mounted: function mounted() {
    this.columnConfig = _extends({}, this.$props, {
      context: this,
      render: this.$scopedSlots.default
    });
    this.$parent.$emit('insertColumn', this.columnConfig);
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
