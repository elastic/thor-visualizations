'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gauge = require('./gauge');

var _gauge2 = _interopRequireDefault(_gauge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HalfGuage(props) {
  return _react2.default.createElement(_gauge2.default, _extends({ type: 'half' }, props));
}

HalfGuage.propTypes = {
  gaugeLine: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  innerColor: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  innerLine: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  max: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  metric: _react.PropTypes.object,
  reversed: _react.PropTypes.bool,
  type: _react.PropTypes.oneOf(['half', 'circle']),
  valueColor: _react.PropTypes.string
};

exports.default = HalfGuage;
module.exports = exports['default'];