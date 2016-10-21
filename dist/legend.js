'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _vertical_legend = require('./vertical_legend');

var _vertical_legend2 = _interopRequireDefault(_vertical_legend);

var _horizontal_legend = require('./horizontal_legend');

var _horizontal_legend2 = _interopRequireDefault(_horizontal_legend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'legend',
  render: function render() {
    if (this.props.legendPosition === 'bottom') {
      return _react2.default.createElement(_horizontal_legend2.default, this.props);
    }
    return _react2.default.createElement(_vertical_legend2.default, this.props);
  }
});
module.exports = exports['default'];