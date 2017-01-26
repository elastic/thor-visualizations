'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _flot = require('../lib/flot');

var _flot2 = _interopRequireDefault(_flot);

var _events = require('../lib/events');

var _events2 = _interopRequireDefault(_events);

var _simianhackerReactResizeAware = require('simianhacker-react-resize-aware');

var _simianhackerReactResizeAware2 = _interopRequireDefault(_simianhackerReactResizeAware);

var _calculate_bar_width = require('../lib/calculate_bar_width');

var _calculate_bar_width2 = _interopRequireDefault(_calculate_bar_width);

var _colors = require('../lib/colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlotChart = function (_Component) {
  _inherits(FlotChart, _Component);

  function FlotChart() {
    _classCallCheck(this, FlotChart);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  FlotChart.prototype.shouldComponentUpdate = function shouldComponentUpdate(props, state) {
    var _this2 = this;

    if (!this.plot) return true;
    if (props.reversed !== this.props.reversed) {
      return true;
    }
    if (props.yaxes && this.props.yaxes) {
      // We need to rerender if the axis change
      var valuesChanged = props.yaxes.some(function (axis, i) {
        return _this2.props.yaxes[i] && axis.tickFormatter !== _this2.props.yaxes[i].tickFormatter && axis.position !== _this2.props.yaxes[i].position;
      });
      if (props.yaxes.length !== this.props.yaxes.length || valuesChanged) {
        return true;
      }
    }
    return false;
  };

  FlotChart.prototype.shutdownChart = function shutdownChart() {
    if (!this.plot) return;
    var target = this.refs.target;

    (0, _flot2.default)(target).unbind('plothover', this.props.plothover);
    if (this.props.onMouseOver) (0, _flot2.default)(target).on('plothover', this.handleMouseOver);
    if (this.props.onMouseLeave) (0, _flot2.default)(target).on('mouseleave', this.handleMouseLeave);
    if (this.props.onBrush) (0, _flot2.default)(target).off('plotselected', this.brushChart);
    this.plot.shutdown();
    if (this.props.crosshair) {
      (0, _flot2.default)(target).off('plothover', this.handlePlotover);
      _events2.default.off('thorPlotover', this.handleThorPlotover);
      _events2.default.off('thorPlotleave', this.handleThorPlotleave);
    }
    (0, _reactDom.findDOMNode)(this.refs.resize).removeEventListener('resize', this.handleResize);
  };

  FlotChart.prototype.componentWillUnmount = function componentWillUnmount() {
    this.shutdownChart();
  };

  FlotChart.prototype.filterByShow = function filterByShow(show) {
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
  };

  FlotChart.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    if (this.plot) {
      var series = newProps.series;
      var markings = newProps.markings;

      var options = this.plot.getOptions();
      _lodash2.default.set(options, 'series.bars.barWidth', (0, _calculate_bar_width2.default)(series));
      if (markings) _lodash2.default.set(options, 'grid.markings', markings);
      this.plot.setData(this.calculateData(series, newProps.show));
      this.plot.setupGrid();
      this.plot.draw();
    } else {
      this.renderChart();
    }
  };

  FlotChart.prototype.componentDidMount = function componentDidMount() {
    this.renderChart();
  };

  FlotChart.prototype.componentDidUpdate = function componentDidUpdate() {
    this.shutdownChart();
    this.renderChart();
  };

  FlotChart.prototype.calculateData = function calculateData(data, show) {
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

  FlotChart.prototype.getOptions = function getOptions() {
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
        mouseActiveRadius: 200
      }
    };

    if (this.props.crosshair) {
      _lodash2.default.set(opts, 'crosshair', {
        mode: 'x',
        color: this.props.reversed ? '#FFF' : '#000',
        lineWidth: 1
      });
    }

    if (this.props.onBrush) {
      _lodash2.default.set(opts, 'selection', { mode: 'x', color: textColor });
    }
    _lodash2.default.set(opts, 'series.bars.barWidth', (0, _calculate_bar_width2.default)(this.props.series));
    return _lodash2.default.assign(opts, this.props.options);
  };

  FlotChart.prototype.renderChart = function renderChart() {
    var _this3 = this;

    var resize = (0, _reactDom.findDOMNode)(this.refs.resize);

    if (resize.clientWidth > 0 && resize.clientHeight > 0) {
      var target = this.refs.target;
      var series = this.props.series;

      var parent = (0, _flot2.default)(target.parentElement);
      var data = this.calculateData(series, this.props.show);

      this.plot = _flot2.default.plot(target, data, this.getOptions());

      this.handleResize = function (e) {
        var resize = (0, _reactDom.findDOMNode)(_this3.refs.resize);
        if (resize.clientHeight > 0 && resize.clientHeight > 0) {
          if (!_this3.plot) return;
          _this3.plot.resize();
          _this3.plot.setupGrid();
          _this3.plot.draw();
        }
      };

      _lodash2.default.defer(function () {
        return _this3.handleResize();
      });
      (0, _reactDom.findDOMNode)(this.refs.resize).addEventListener('resize', this.handleResize);

      this.handleMouseOver = function () {
        var _props;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (_this3.props.onMouseOver) (_props = _this3.props).onMouseOver.apply(_props, args.concat([_this3.plot]));
      };

      this.handleMouseLeave = function () {
        var _props2;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (_this3.props.onMouseLeave) (_props2 = _this3.props).onMouseLeave.apply(_props2, args.concat([_this3.plot]));
      };

      (0, _flot2.default)(target).on('plothover', this.handleMouseOver);
      (0, _flot2.default)(target).on('mouseleave', this.handleMouseLeave);

      if (this.props.crosshair) {

        this.handleThorPlotover = function (e, pos, item, originalPlot) {
          if (_this3.plot !== originalPlot) {
            _this3.plot.setCrosshair({ x: _lodash2.default.get(pos, 'x') });
            _this3.props.plothover(e, pos, item);
          }
        };

        this.handlePlotover = function (e, pos, item) {
          return _events2.default.trigger('thorPlotover', [pos, item, _this3.plot]);
        };
        this.handlePlotleave = function (e) {
          return _events2.default.trigger('thorPlotleave');
        };
        this.handleThorPlotleave = function (e) {
          _this3.plot.clearCrosshair();
          if (_this3.props.plothover) _this3.props.plothover(e);
        };

        (0, _flot2.default)(target).on('plothover', this.handlePlotover);
        (0, _flot2.default)(target).on('mouseleave', this.handlePlotleave);
        _events2.default.on('thorPlotover', this.handleThorPlotover);
        _events2.default.on('thorPlotleave', this.handleThorPlotleave);
      }

      if (_lodash2.default.isFunction(this.props.plothover)) {
        (0, _flot2.default)(target).bind('plothover', this.props.plothover);
      }

      (0, _flot2.default)(target).on('mouseleave', function (e) {
        _events2.default.trigger('thorPlotleave');
      });

      if (_lodash2.default.isFunction(this.props.onBrush)) {
        this.brushChart = function (e, ranges) {
          _this3.props.onBrush(ranges);
          _this3.plot.clearSelection();
        };

        (0, _flot2.default)(target).on('plotselected', this.brushChart);
      }
    }
  };

  FlotChart.prototype.render = function render() {
    var style = {
      position: 'relative',
      display: 'flex',
      rowDirection: 'column',
      flex: '1 0 auto'
    };
    return _react2.default.createElement(
      _simianhackerReactResizeAware2.default,
      { ref: 'resize', style: style },
      _react2.default.createElement('div', { ref: 'target', style: style })
    );
  };

  return FlotChart;
}(_react.Component);

FlotChart.propTypes = {
  crosshair: _react.PropTypes.bool,
  onBrush: _react.PropTypes.func,
  onMouseOver: _react.PropTypes.func,
  onMouseLeave: _react.PropTypes.func,
  options: _react.PropTypes.object,
  plothover: _react.PropTypes.func,
  reversed: _react.PropTypes.bool,
  series: _react.PropTypes.array,
  show: _react.PropTypes.array,
  tickFormatter: _react.PropTypes.func,
  yaxes: _react.PropTypes.array
};

exports.default = FlotChart;
module.exports = exports['default'];