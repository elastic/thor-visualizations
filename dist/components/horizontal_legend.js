'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _create_legend_series = require('../lib/create_legend_series');

var _create_legend_series2 = _interopRequireDefault(_create_legend_series);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HorizontalLegend(props) {
  var rows = props.series.map((0, _create_legend_series2.default)(props));
  var legendStyle = {};
  var legendControlClass = 'fa fa-chevron-down';
  if (!props.showLegend) {
    legendStyle.display = 'none';
    legendControlClass = 'fa fa-chevron-up';
  }
  return _react2.default.createElement(
    'div',
    { className: 'rhythm_chart__legend-horizontal' },
    _react2.default.createElement(
      'div',
      { className: 'rhythm_chart__legend-control' },
      _react2.default.createElement('i', { className: legendControlClass, onClick: props.onClick })
    ),
    _react2.default.createElement(
      'div',
      { className: 'rhythm_chart__legend-series', style: legendStyle },
      rows
    )
  );
}

HorizontalLegend.propTypes = {
  legendPosition: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  onToggle: _react.PropTypes.func,
  series: _react.PropTypes.array,
  showLegend: _react.PropTypes.bool,
  seriesValues: _react.PropTypes.object,
  seriesFilter: _react.PropTypes.array,
  tickFormatter: _react.PropTypes.func
};

exports.default = HorizontalLegend;
module.exports = exports['default'];