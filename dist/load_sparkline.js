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

var LoadSparkline = function (_Sparkline) {
  _inherits(LoadSparkline, _Sparkline);

  function LoadSparkline(props) {
    _classCallCheck(this, LoadSparkline);

    var _this = _possibleConstructorReturn(this, _Sparkline.call(this, props));

    _this.opts.yaxis.max = (0, _lodash2.default)(props.metrics).map(function (row) {
      return row[1];
    }).max() + 1;
    _this.opts.yaxis.min = 0;
    return _this;
  }

  return LoadSparkline;
}(_sparkline2.default);

exports.default = LoadSparkline;
module.exports = exports['default'];