'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flot = require('./flot');

var _flot2 = _interopRequireDefault(_flot);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function calculateBarWidth(metrics) {
  var divisor = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var multipier = arguments.length <= 2 || arguments[2] === undefined ? 1.12 : arguments[2];

  if (_lodash2.default.isPlainObject(metrics[0])) {
    try {
      return (metrics[0].data[1][0] - metrics[0].data[0][0]) / divisor * multipier;
    } catch (e) {
      return 1000;
    }
  } else {
    try {
      return (metrics[1][0] - metrics[0][0]) / divisor;
    } catch (e) {
      return 1000;
    }
  }
}

var ChartVis = function (_Component) {
  _inherits(ChartVis, _Component);

  function ChartVis(props) {
    _classCallCheck(this, ChartVis);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    var min = props.min;
    var max = props.max;

    _this.height = props.height || 75;
    _this.width = props.width || 150;
    var type = props.type || 'line';
    var barWidth = props.barWidth || calculateBarWidth(props.metrics);
    _this.opts = {
      legend: { show: false },
      yaxis: {
        color: '#EEEEEE',
        font: { color: '#CCCCCC' },
        tickFormatter: props.tickFormatter
      },
      xaxis: {
        color: '#EEEEEE',
        timezone: 'browser',
        mode: 'time',
        font: { color: '#CCCCCC' }
      },
      series: {
        stack: props.stack,
        shadowSize: 0,
        lines: {
          fill: props.fill != null ? props.fill : 0.5,
          lineWidth: props.line != null ? props.line : 0,
          show: type === 'line',
          zero: true
        },
        bars: {
          fill: props.fill != null ? props.fill : 0.5,
          lineWidth: props.line != null ? props.line : 0,
          barWidth: barWidth,
          align: 'center',
          show: type === 'bar'
        },
        points: {
          radius: 0.7,
          fill: 1.0,
          show: type === 'line'
        }
      },
      crosshair: {
        mode: 'x',
        color: '#666666',
        lineWidth: 2
      },
      grid: {
        margin: 0,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        hoverable: true,
        autoHighlight: false,
        mouseActiveRadius: 400
      }
    };

    if (props.timerange) {
      _lodash2.default.set(_this.opts, 'xaxis.max', props.timerange.max);
      _lodash2.default.set(_this.opts, 'xaxis.min', props.timerange.min);
    }
    if (props.max) _lodash2.default.set(_this.opts, 'yaxis.max', props.max);
    if (props.min) _lodash2.default.set(_this.opts, 'yaxis.min', props.min);
    if (props.onBrush) {
      _lodash2.default.set(_this.opts, 'selection', { mode: 'x', color: '#CCC' });
    }
    if (props.markings) {
      _lodash2.default.set(_this.opts, 'grid.markings', props.markings);
    }
    _this.handleResize = function (e) {
      _this.plot.resize();
      _this.plot.setupGrid();
      _this.plot.draw();
    };

    _this.setCrosshair = function (e, pos) {
      _this.plot.setCrosshair(pos);
    };

    _this.clearCrosshair = function (e) {
      _this.plot.clearCrosshair();
    };

    _this.brushChart = function (e, ranges) {
      if (_lodash2.default.isFunction(props.onBrush)) {
        props.onBrush(ranges);
        _this.plot.clearSelection();
      }
    };
    return _this;
  }

  ChartVis.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    if (!this.plot) return true;
    return false;
  };

  ChartVis.prototype.componentWillUnmount = function componentWillUnmount() {
    (0, _flot2.default)(this.plot.getPlaceholder()).unbind('plothover', this.props.plothover);
    window.removeEventListener('resize', this.handleResize);
    this.plot.shutdown();
    if (this.props.crosshair) {
      _events2.default.off('rhythmPlothover', this.setCrosshair);
      _events2.default.off('rhythmPlotLeave', this.clearCrosshair);
    }
    if (this.props.onBrush) {
      (0, _flot2.default)(this.plot.getPlaceholder()).off('plotselected', this.brushChart);
    }
  };

  ChartVis.prototype.filterByShow = function filterByShow(show) {
    if (show) {
      return function (metric) {
        return _lodash2.default.includes(show, metric.label);
      };
    }
    return function (metric) {
      return true;
    };
  };

  ChartVis.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    if (this.plot) {
      var metrics = newProps.metrics;
      var markings = newProps.markings;

      var options = this.plot.getOptions();
      _lodash2.default.set(options, 'series.bars.barWidth', calculateBarWidth(metrics));
      if (markings) _lodash2.default.set(options, 'grid.markings', markings);
      this.plot.setData(this.calculateData(metrics, newProps.show));
      this.plot.setupGrid();
      this.plot.draw();
    }
  };

  ChartVis.prototype.componentDidMount = function componentDidMount() {
    this.renderChart();
  };

  ChartVis.prototype.calculateData = function calculateData(data, show) {
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
  };

  ChartVis.prototype.renderChart = function renderChart() {
    var target = this.refs.target;
    var metrics = this.props.metrics;

    var parent = (0, _flot2.default)(target.parentElement);
    var data = this.calculateData(metrics, this.props.show);
    (0, _flot2.default)(target).height(this.height);
    this.plot = _flot2.default.plot(target, data, this.opts);
    window.addEventListener('resize', this.handleResize);
    if (_lodash2.default.isFunction(this.props.plothover)) {
      (0, _flot2.default)(target).bind('plothover', this.props.plothover);
    }
    (0, _flot2.default)(target).on('mouseleave', function (e) {
      _events2.default.trigger('rhythmPlotLeave');
    });
    if (this.props.crosshair) {
      _events2.default.on('rhythmPlothover', this.setCrosshair);
      _events2.default.on('rhythmPlotLeave', this.clearCrosshair);
    }
    if (this.props.onBrush) {
      (0, _flot2.default)(target).on('plotselected', this.brushChart);
    }
  };

  ChartVis.prototype.render = function render() {
    return _react2.default.createElement('div', { ref: 'target' });
  };

  return ChartVis;
}(_react.Component);

exports.default = ChartVis;
module.exports = exports['default'];