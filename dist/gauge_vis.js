'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flot = require('./flot');

var _flot2 = _interopRequireDefault(_flot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GaugeVis = function (_Component) {
  _inherits(GaugeVis, _Component);

  function GaugeVis(props) {
    _classCallCheck(this, GaugeVis);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.height = props.height || 150;
    _this.width = props.width || 150;
    _this.opts = {
      series: {
        pie: {
          innerRadius: 0.7,
          show: true,
          startAngle: 1
        }
      }
    };
    return _this;
  }

  GaugeVis.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
    if (!this.plot) return true;
    return false;
  };

  GaugeVis.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    if (this.plot) {
      var max = newProps.max || 1;
      this.plot.setData(this.caluclateData(newProps.value / max));
      this.plot.draw();
    }
  };

  GaugeVis.prototype.componentDidMount = function componentDidMount() {
    this.renderGauge();
  };

  GaugeVis.prototype.componentWillUnmount = function componentWillUnmount() {
    this.plot.shutdown();
  };

  GaugeVis.prototype.caluclateData = function caluclateData(value) {
    var color = this.props.color || '#8ac336';
    if (this.props.thresholds) {
      if (value > 0.60) color = '#fbce47';
      if (value > 0.80) color = '#d76051';
    }
    return [{ color: color, data: value * 0.5 }, { color: '#DDDDDD', data: 0.5 - value * 0.5 }, { color: '#FFFFFF', data: 0.5 }];
  };

  GaugeVis.prototype.renderGauge = function renderGauge() {
    var target = this.refs.target;

    var max = this.props.max || 1;
    var data = this.caluclateData(this.props.value / max);
    (0, _flot2.default)(target).width(this.width).height(this.height);
    this.plot = _flot2.default.plot(target, data, this.opts);
  };

  GaugeVis.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { className: 'chart', style: { overflow: 'hidden', height: this.height / 2 } },
      _react2.default.createElement('div', { ref: 'target' })
    );
  };

  return GaugeVis;
}(_react.Component);

exports.default = GaugeVis;
module.exports = exports['default'];