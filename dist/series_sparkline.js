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

var _sparkline = require('./sparkline');

var _sparkline2 = _interopRequireDefault(_sparkline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SeriesSparkline = function (_Sparkline) {
  _inherits(SeriesSparkline, _Sparkline);

  function SeriesSparkline(props) {
    _classCallCheck(this, SeriesSparkline);

    return _possibleConstructorReturn(this, _Sparkline.call(this, props));
  }

  SeriesSparkline.prototype.calculateData = function calculateData(data) {
    return (0, _lodash2.default)(data).map(function (set) {
      if (_lodash2.default.isPlainObject(set)) {
        return set;
      }
      return {
        color: '#990000',
        data: set
      };
    }).reverse().value();
  };

  return SeriesSparkline;
}(_sparkline2.default);

exports.default = SeriesSparkline;
module.exports = exports['default'];