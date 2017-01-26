'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _vertical_legend = require('./vertical_legend');

var _vertical_legend2 = _interopRequireDefault(_vertical_legend);

var _horizontal_legend = require('./horizontal_legend');

var _horizontal_legend2 = _interopRequireDefault(_horizontal_legend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Legend(props) {
  if (props.legendPosition === 'bottom') {
    return _react2.default.createElement(_horizontal_legend2.default, props);
  }
  return _react2.default.createElement(_vertical_legend2.default, props);
}

Legend.propTypes = {
  legendPosition: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  onToggle: _react.PropTypes.func,
  series: _react.PropTypes.array,
  showLegend: _react.PropTypes.bool,
  seriesValues: _react.PropTypes.object,
  seriesFilter: _react.PropTypes.array,
  tickFormatter: _react.PropTypes.func
};

exports.default = Legend;
module.exports = exports['default'];