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

var _gauge_vis = require('./gauge_vis');

var _gauge_vis2 = _interopRequireDefault(_gauge_vis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gauge = function (_Component) {
  _inherits(Gauge, _Component);

  function Gauge(props) {
    _classCallCheck(this, Gauge);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.height = props.height || 150;
    _this.width = props.width || 150;
    return _this;
  }

  Gauge.prototype.formatValue = function formatValue(value) {
    var format = this.props.format || '0.00%';
    if (_lodash2.default.isFunction(format)) {
      return format(value);
    }
    return (0, _numeral2.default)(value).format(format);
  };

  Gauge.prototype.render = function render() {
    var value = (0, _get_last_value2.default)(this.props.metric.data);
    var titleFontSize = this.height * 0.3;
    var labelFontSize = this.height * 0.3;
    var gaugeProps = {
      value: value,
      max: this.props.max || 1,
      height: this.height,
      width: this.width,
      thresholds: this.props.thresholds != null ? this.props.thresholds : true,
      color: this.props.color || '#8ac336'
    };
    return _react2.default.createElement(
      'div',
      { className: 'gauge', ref: 'gauge' },
      _react2.default.createElement(
        'div',
        {
          className: 'title',
          style: { fontSize: titleFontSize },
          ref: 'title' },
        this.props.title
      ),
      _react2.default.createElement(_gauge_vis2.default, gaugeProps),
      _react2.default.createElement(
        'div',
        {
          className: 'label',
          style: { fontSize: labelFontSize },
          ref: 'label' },
        this.formatValue(value)
      )
    );
  };

  return Gauge;
}(_react.Component);

exports.default = Gauge;
module.exports = exports['default'];