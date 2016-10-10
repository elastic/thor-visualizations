'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gauge_vis = require('./gauge_vis');

var _gauge_vis2 = _interopRequireDefault(_gauge_vis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CircleGaugeVis = function (_GaugeVis) {
  _inherits(CircleGaugeVis, _GaugeVis);

  function CircleGaugeVis(props) {
    _classCallCheck(this, CircleGaugeVis);

    var _this = _possibleConstructorReturn(this, _GaugeVis.call(this, props));

    _this.opts.series.pie.innerRadius = 0.9;
    _this.opts.series.pie.startAngle = 1.5;
    return _this;
  }

  CircleGaugeVis.prototype.caluclateData = function caluclateData(value) {
    var color = this.props.color || '#8ac336';
    if (this.props.thresholds) {
      if (value > 0.60) color = '#fbce47';
      if (value > 0.80) color = '#d76051';
    }
    return [{ color: color, data: value }, { color: '#DDDDDD', data: 1 - value }];
  };

  CircleGaugeVis.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { className: 'chart', style: { height: this.height } },
      _react2.default.createElement('div', { ref: 'target' })
    );
  };

  return CircleGaugeVis;
}(_gauge_vis2.default);

exports.default = CircleGaugeVis;
module.exports = exports['default'];