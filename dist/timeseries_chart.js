'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _flot = require('./flot');

var _flot2 = _interopRequireDefault(_flot);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _reactResizeAware = require('react-resize-aware');

var _reactResizeAware2 = _interopRequireDefault(_reactResizeAware);

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

var _calculate_bar_width = require('./calculate_bar_width');

var _calculate_bar_width2 = _interopRequireDefault(_calculate_bar_width);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Chart = _react2.default.createClass({
  displayName: 'Chart',
  componentWillMount: function componentWillMount(props) {},
  shouldComponentUpdate: function shouldComponentUpdate(props) {
    var _this = this;

    if (!this.plot) return true;
    if (props.reversed !== this.props.reversed) {
      return true;
    }
    if (props.yaxes && this.props.yaxes) {
      // We need to rerender if the axis change
      var valuesChanged = props.yaxes.some(function (axis, i) {
        return !_lodash2.default.isEqual(_lodash2.default.omitBy(axis, _lodash2.default.isFunction), _lodash2.default.omitBy(_this.props.yaxes[i], _lodash2.default.isFunction));
      });
      if (props.yaxes.length !== this.props.yaxes.length || valuesChanged) {
        return true;
      }
    }
    return false;
  },
  shutdownChart: function shutdownChart() {
    if (!this.plot) return;
    var target = this.refs.target;

    (0, _flot2.default)(target).unbind('plothover', this.props.plothover);
    if (this.props.onMouseOver) (0, _flot2.default)(target).on('plothover', this.handleMouseOver);
    if (this.props.onMouseLeave) (0, _flot2.default)(target).on('mouseleave', this.handleMouseLeave);
    if (this.props.onBrush) (0, _flot2.default)(target).off('plotselected', this.brushChart);
    this.plot.shutdown();
    if (this.props.onCrosshair) {
      (0, _flot2.default)(target).off('plothover', this.handlePlotover);
      _events2.default.off('thorPlotover', this.handleThorPlotover);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.shutdownChart();
    (0, _reactDom.findDOMNode)(this.refs.resize).removeEventListener('resize', this.handleResize);
  },
  filterByShow: function filterByShow(show) {
    if (show) {
      return function (metric) {
        return show.some(function (id) {
          return _lodash2.default.startsWith(id, metric.id);
        });
      };
    }
    return function (metric) {
      return true;
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(newProps) {
    if (this.plot) {
      var series = newProps.series;
      var markings = newProps.markings;

      var options = this.plot.getOptions();
      _lodash2.default.set(options, 'series.bars.barWidth', (0, _calculate_bar_width2.default)(series));
      if (markings) _lodash2.default.set(options, 'grid.markings', markings);
      this.plot.setData(this.calculateData(series, newProps.show));
      this.plot.setupGrid();
      this.plot.draw();
    }
  },
  componentDidMount: function componentDidMount() {
    this.renderChart();
    (0, _reactDom.findDOMNode)(this.refs.resize).addEventListener('resize', this.handleResize);
  },
  componentDidUpdate: function componentDidUpdate() {
    this.shutdownChart();
    this.renderChart();
  },
  calculateData: function calculateData(data, show) {
    var series = [];
    return (0, _lodash2.default)(data).filter(this.filterByShow(show)).map(function (set) {
      if (_lodash2.default.isPlainObject(set)) {
        return set;
      }
      return {
        color: '#990000',
        data: set
      };
    }).reverse().value();
  },
  getOptions: function getOptions() {
    var yaxes = this.props.yaxes || [{}];

    var lineColor = this.props.reversed ? _colors2.default.lineColorReversed : _colors2.default.lineColor;
    var textColor = this.props.reversed ? _colors2.default.textColorReversed : _colors2.default.textColor;
    var valueColor = this.props.reversed ? _colors2.default.valueColorReversed : _colors2.default.valueColor;

    var opts = {
      legend: { show: false },
      yaxes: yaxes,
      yaxis: {
        color: lineColor,
        font: { color: textColor },
        tickFormatter: this.props.tickFormatter
      },
      xaxis: {
        color: lineColor,
        timezone: 'browser',
        mode: 'time',
        font: { color: textColor }
      },
      series: {
        shadowSize: 0
      },
      grid: {
        margin: 0,
        borderWidth: 1,
        borderColor: lineColor,
        hoverable: true,
        mouseActiveRadius: 50
      }
    };

    if (this.props.onBrush) {
      _lodash2.default.set(opts, 'selection', { mode: 'x', color: textColor });
    }
    _lodash2.default.set(opts, 'series.bars.barWidth', (0, _calculate_bar_width2.default)(this.props.series));
    return _lodash2.default.assign(opts, this.props.options);
  },
  renderChart: function renderChart() {
    var _this2 = this;

    var _props = this.props;
    var min = _props.min;
    var max = _props.max;

    var type = this.props.type || 'line';
    var target = this.refs.target;
    var series = this.props.series;

    var parent = (0, _flot2.default)(target.parentElement);
    var data = this.calculateData(series, this.props.show);

    this.plot = _flot2.default.plot(target, data, this.getOptions());

    this.handleResize = function (e) {
      if (!_this2.plot) return;
      _this2.plot.resize();
      _this2.plot.setupGrid();
      _this2.plot.draw();
    };

    this.handleResize();

    this.handleMouseOver = function () {
      var _props2;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (_this2.props.onMouseOver) (_props2 = _this2.props).onMouseOver.apply(_props2, args.concat([_this2.plot]));
    };

    this.handleMouseLeave = function () {
      var _props3;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (_this2.props.onMouseLeave) (_props3 = _this2.props).onMouseLeave.apply(_props3, args.concat([_this2.plot]));
      if (_this2.props.onCrosshair) _this2.props.onCrosshair();
    };

    (0, _flot2.default)(target).on('plothover', this.handleMouseOver);
    (0, _flot2.default)(target).on('mouseleave', this.handleMouseLeave);

    if (this.props.onCrosshair) {

      this.handlePlotover = function (e, pos, item) {
        _events2.default.trigger('thorPlotover', [pos, item, _this2.plot]);
      };
      (0, _flot2.default)(target).on('plothover', this.handlePlotover);

      this.handleThorPlotover = function (e, pos, item, originalPlot) {
        if (_this2.plot !== originalPlot) {
          _this2.props.onCrosshair(pos, item, _this2.plot, originalPlot);
        }
      };
      _events2.default.on('thorPlotover', this.handleThorPlotover);
    }

    if (_lodash2.default.isFunction(this.props.plothover)) {
      (0, _flot2.default)(target).bind('plothover', this.props.plothover);
    }

    (0, _flot2.default)(target).on('mouseleave', function (e) {
      _events2.default.trigger('rhythmPlotLeave');
    });

    if (_lodash2.default.isFunction(this.props.onBrush)) {
      this.brushChart = function (e, ranges) {
        _this2.props.onBrush(ranges);
        _this2.plot.clearSelection();
      };
      (0, _flot2.default)(target).on('plotselected', this.brushChart);
    }

    this.state = {
      crosshair: { x: null, y: null }
    };
  },
  render: function render() {
    var style = {
      position: 'relative',
      display: 'flex',
      rowDirection: 'column',
      flex: '1 0 auto'
    };
    return _react2.default.createElement(
      _reactResizeAware2.default,
      { ref: 'resize', style: style },
      _react2.default.createElement('div', { ref: 'target', style: style })
    );
  }
});

exports.default = _react2.default.createClass({
  displayName: 'timeseries_chart',
  getInitialState: function getInitialState() {
    return { show: false };
  },
  calculateLeftRight: function calculateLeftRight(item, plot) {
    var el = this.refs.container;
    var offset = plot.offset();
    var canvas = plot.getCanvas();
    var point = plot.pointOffset({ x: item.datapoint[0], y: item.datapoint[1] });
    var edge = (point.left + 10) / canvas.width;
    var right = void 0;
    var left = void 0;
    if (edge > 0.5) {
      right = canvas.width - point.left;
      left = null;
    } else {
      right = null;
      left = point.left;
    }
    return [left, right];
  },
  handleMouseOver: function handleMouseOver(e, pos, item, plot) {
    if (item) {
      var plotOffset = plot.getPlotOffset();
      var point = plot.pointOffset({ x: item.datapoint[0], y: item.datapoint[1] });

      var _calculateLeftRight = this.calculateLeftRight(item, plot);

      var left = _calculateLeftRight[0];
      var right = _calculateLeftRight[1];

      var top = point.top;
      this.setState({
        show: true,
        item: item,
        left: left,
        right: right,
        crosshairRight: right,
        crosshairLeft: left,
        top: top + 10,
        bottom: plotOffset.bottom
      });
    }
  },
  handleCrosshair: function handleCrosshair(pos, item, plot) {
    if (item) {
      var series = this.props.series[0];

      var _calculateLeftRight2 = this.calculateLeftRight(item, plot);

      var left = _calculateLeftRight2[0];
      var right = _calculateLeftRight2[1];

      this.setState({
        showCrosshair: true,
        crosshairLeft: left,
        crosshairRight: right
      });
    } else {
      this.setState({ showCrosshair: false });
    }
  },
  handleMouseLeave: function handleMouseLeave(e, plot) {
    this.setState({ show: false });
  },
  render: function render() {
    var _state = this.state;
    var item = _state.item;
    var right = _state.right;
    var top = _state.top;
    var left = _state.left;
    var crosshairLeft = _state.crosshairLeft;
    var crosshairRight = _state.crosshairRight;
    var series = this.props.series;

    var tooltip = void 0;
    var crosshair = void 0;

    var showCrosshair = this.state.showCrosshair || this.state.show;

    var styles = (0, _reactcss2.default)({
      showCrosshair: {
        crosshair: {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: crosshairLeft,
          right: crosshairRight,
          width: '2px',
          backgroundColor: this.props.reversed ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          zIndex: 500001
        }
      },
      show: {
        tooltipContainer: {
          position: 'absolute',
          top: top - 26,
          left: left,
          right: right,
          zIndex: 50000,
          display: 'flex',
          alignItems: 'center'
        },
        tooltip: {
          backgroundColor: this.props.reversed ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          color: this.props.reversed ? 'black' : 'white',
          fontSize: '12px',
          padding: '4px 8px',
          borderRadius: '4px'
        },
        rightCaret: {
          display: right ? 'block' : 'none',
          color: this.props.reversed ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
        },
        leftCaret: {
          display: left ? 'block' : 'none',
          color: this.props.reversed ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
        },
        date: {
          color: this.props.reversed ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'
        },
        items: {
          display: 'flex',
          alignItems: 'center'
        },
        text: {
          whiteSpace: 'nowrap',
          marginRight: 5
        },
        icon: {
          marginRight: 5
        },
        value: {
          flexShrink: 0,
          marginLeft: 5
        }
      },
      hide: {
        tooltipContainer: { display: 'none' }
      },
      hideCrosshair: {
        crosshair: { display: 'none' }
      }
    }, { show: this.state.show, hide: !this.state.show, showCrosshair: showCrosshair, hideCrosshair: !showCrosshair });

    if (item) {
      var metric = series.find(function (r) {
        return r.id === item.series.id;
      });
      var formatter = metric && metric.tickFormatter || this.props.tickFormatter || function (v) {
        return v;
      };
      var value = item.datapoint[2] ? item.datapoint[1] - item.datapoint[2] : item.datapoint[1];
      var caretClassName = right ? 'fa fa-caret-right' : 'fa-caret-left';
      tooltip = _react2.default.createElement(
        'div',
        { style: styles.tooltipContainer },
        _react2.default.createElement('i', { className: 'fa fa-caret-left', style: styles.leftCaret }),
        _react2.default.createElement(
          'div',
          { style: styles.tooltip },
          _react2.default.createElement(
            'div',
            { style: styles.items },
            _react2.default.createElement(
              'div',
              { style: styles.icon },
              _react2.default.createElement('i', { className: 'fa fa-circle', style: { color: item.series.color } })
            ),
            _react2.default.createElement(
              'div',
              { style: styles.text },
              item.series.label
            ),
            _react2.default.createElement(
              'div',
              { style: styles.value },
              formatter(value)
            )
          ),
          _react2.default.createElement(
            'div',
            { style: styles.date },
            (0, _moment2.default)(item.datapoint[0]).format('lll')
          )
        ),
        _react2.default.createElement('i', { className: 'fa fa-caret-right', style: styles.rightCaret })
      );
    }

    crosshair = _react2.default.createElement('div', { style: styles.crosshair });

    var container = {
      display: 'flex',
      rowDirection: 'column',
      flex: '1 0 auto',
      position: 'relative'
    };

    var params = _extends({
      onMouseLeave: this.handleMouseLeave,
      onMouseOver: this.handleMouseOver
    }, this.props);

    if (this.props.crosshair) {
      params.onCrosshair = this.handleCrosshair;
    }

    return _react2.default.createElement(
      'div',
      { ref: 'container', style: container },
      tooltip,
      crosshair,
      _react2.default.createElement(Chart, params)
    );
  }
});
module.exports = exports['default'];