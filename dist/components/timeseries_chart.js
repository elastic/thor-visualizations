'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

var _flot_chart = require('./flot_chart');

var _flot_chart2 = _interopRequireDefault(_flot_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimeseriesChart = function (_Component) {
  _inherits(TimeseriesChart, _Component);

  function TimeseriesChart(props) {
    _classCallCheck(this, TimeseriesChart);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      showTooltip: false,
      mouseHoverTimer: false
    };
    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
    _this.handleMouseOver = _this.handleMouseOver.bind(_this);
    return _this;
  }

  TimeseriesChart.prototype.calculateLeftRight = function calculateLeftRight(item, plot) {
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
  };

  TimeseriesChart.prototype.handleMouseOver = function handleMouseOver(e, pos, item, plot) {

    if (typeof this.state.mouseHoverTimer === 'number') {
      window.clearTimeout(this.state.mouseHoverTimer);
    }

    if (item) {
      var plotOffset = plot.getPlotOffset();
      var point = plot.pointOffset({ x: item.datapoint[0], y: item.datapoint[1] });

      var _calculateLeftRight = this.calculateLeftRight(item, plot);

      var left = _calculateLeftRight[0];
      var right = _calculateLeftRight[1];

      var top = point.top;
      this.setState({
        showTooltip: true,
        item: item,
        left: left,
        right: right,
        top: top + 10,
        bottom: plotOffset.bottom
      });
    }
  };

  TimeseriesChart.prototype.handleMouseLeave = function handleMouseLeave(e, plot) {
    var _this2 = this;

    this.state.mouseHoverTimer = window.setTimeout(function () {
      _this2.setState({ showTooltip: false });
    }, 250);
  };

  TimeseriesChart.prototype.render = function render() {
    var _state = this.state;
    var item = _state.item;
    var right = _state.right;
    var top = _state.top;
    var left = _state.left;
    var series = this.props.series;

    var tooltip = void 0;

    var styles = (0, _reactcss2.default)({
      showTooltip: {
        tooltipContainer: {
          pointerEvents: 'none',
          position: 'absolute',
          top: top - 28,
          left: left,
          right: right,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          padding: '0 5px'
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
          color: this.props.reversed ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
          fontSize: '12px',
          lineHeight: '12px'
        },
        items: {
          display: 'flex',
          alignItems: 'center'
        },
        text: {
          whiteSpace: 'nowrap',
          fontSize: '12px',
          lineHeight: '12px',
          marginRight: 5
        },
        icon: {
          marginRight: 5
        },
        value: {
          fontSize: '12px',
          flexShrink: 0,
          lineHeight: '12px',
          marginLeft: 5
        }
      },
      hideTooltip: {
        tooltipContainer: { display: 'none' }
      }
    }, {
      showTooltip: this.state.showTooltip,
      hideTooltip: !this.state.showTooltip
    });

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

    var container = {
      display: 'flex',
      rowDirection: 'column',
      flex: '1 0 auto',
      position: 'relative'
    };

    var params = {
      crosshair: this.props.crosshair,
      onBrush: this.props.onBrush,
      onMouseLeave: this.handleMouseLeave,
      onMouseOver: this.handleMouseOver,
      options: this.props.options,
      plothover: this.props.plothover,
      reversed: this.props.reversed,
      series: this.props.series,
      show: this.props.show,
      tickFormatter: this.props.tickFormatter,
      yaxes: this.props.yaxes
    };

    return _react2.default.createElement(
      'div',
      { ref: 'container', style: container },
      tooltip,
      _react2.default.createElement(_flot_chart2.default, params)
    );
  };

  return TimeseriesChart;
}(_react.Component);

TimeseriesChart.propTypes = {
  crosshair: _react.PropTypes.bool,
  onBrush: _react.PropTypes.func,
  options: _react.PropTypes.object,
  plothover: _react.PropTypes.func,
  reversed: _react.PropTypes.bool,
  series: _react.PropTypes.array,
  show: _react.PropTypes.array,
  tickFormatter: _react.PropTypes.func,
  yaxes: _react.PropTypes.array
};

exports.default = TimeseriesChart;
module.exports = exports['default'];