'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _create_legend_series = require('../lib/create_legend_series');

var _create_legend_series2 = _interopRequireDefault(_create_legend_series);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function VerticalLegend(props) {
  var rows = props.series.map((0, _create_legend_series2.default)(props));
  var seriesStyle = {};
  var legendStyle = {};
  var controlStyle = {};
  var openClass = 'fa-chevron-left';
  var closeClass = 'fa-chevron-right';
  if (props.legendPosition === 'left') {
    openClass = 'fa-chevron-right';
    closeClass = 'fa-chevron-left';
    legendStyle.order = '-1';
    controlStyle.order = '2';
  }
  var legendControlClass = 'fa ' + closeClass;
  legendStyle.width = 200;
  if (!props.showLegend) {
    legendStyle.width = 12;
    seriesStyle.display = 'none';
    legendControlClass = 'fa ' + openClass;
  }
  return _react2.default.createElement(
    'div',
    { className: 'rhythm_chart__legend', style: legendStyle },
    _react2.default.createElement(
      'div',
      { className: 'rhythm_chart__legend-control', style: controlStyle },
      _react2.default.createElement('i', { className: legendControlClass, onClick: props.onClick })
    ),
    _react2.default.createElement(
      'div',
      { className: 'rhythm_chart__legend-series', style: seriesStyle },
      rows
    )
  );
}

VerticalLegend.propTypes = {
  legendPosition: _react.PropTypes.string,
  onClick: _react.PropTypes.func,
  onToggle: _react.PropTypes.func,
  series: _react.PropTypes.array,
  showLegend: _react.PropTypes.bool,
  seriesValues: _react.PropTypes.object,
  seriesFilter: _react.PropTypes.array,
  tickFormatter: _react.PropTypes.func
};

exports.default = VerticalLegend;
module.exports = exports['default'];