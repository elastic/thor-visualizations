'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flot = require('./flot');

var _flot2 = _interopRequireDefault(_flot);

var _get_last_value = require('./get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sparkline = function (_Component) {
  _inherits(Sparkline, _Component);

  function Sparkline(props) {
    _classCallCheck(this, Sparkline);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    var max = props.max;
    var min = props.min;
    _this.height = props.height || 75;
    _this.width = props.width || 150;
    _this.opts = {
      legend: { show: false },
      xaxis: {
        timezone: 'browser',
        mode: 'time',
        show: false
      },
      yaxis: { show: false },
      series: {
        shadowSize: 0,
        lines: {
          lineWidth: props.line ? 1 : 0, fill: props.line ? 0.0 : 1.0,
          show: true
        }
      },
      grid: {
        backgroundColor: '#EEEEEE',
        borderWidth: 0
      }
    };

    if (props.max) _lodash2.default.set(_this.opts, 'yaxis.max', props.max);
    if (props.min) _lodash2.default.set(_this.opts, 'yaxis.min', props.min);
    return _this;
  }

  Sparkline.prototype.componentWillUnmount = function componentWillUnmount() {
    this.plot.shutdown();
  };

  Sparkline.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    if (!this.plot) return true;
    return false;
  };

  Sparkline.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    if (this.plot) {
      var metrics = newProps.metrics;

      this.plot.setData(this.calculateData(metrics));
      this.plot.setupGrid();
      this.plot.draw();
    }
  };

  Sparkline.prototype.componentDidMount = function componentDidMount() {
    this.renderChart();
  };

  Sparkline.prototype.calculateData = function calculateData(data) {
    var last = (0, _get_last_value2.default)(data);
    var dataPoint = {
      color: this.props.color || '#6eadc1',
      data: data,
      lines: {}
    };
    if (this.props.thresholds) {
      dataPoint.color = '#d76051';
      dataPoint.threshold = [{ below: 0.60, color: '#8ac336' }, { below: 0.80, color: '#fbce47' }];
    }
    return [dataPoint];
  };

  Sparkline.prototype.renderChart = function renderChart() {
    var target = this.refs.target;
    var metrics = this.props.metrics;

    var data = this.calculateData(metrics);
    (0, _flot2.default)(target).width(this.width).height(this.height);
    this.plot = _flot2.default.plot(target, data, this.opts);
  };

  Sparkline.prototype.render = function render() {
    return _react2.default.createElement('div', { className: 'sparkline', ref: 'target' });
  };

  return Sparkline;
}(_react.Component);

exports.default = Sparkline;
module.exports = exports['default'];