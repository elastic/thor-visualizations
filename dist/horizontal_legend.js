'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'horizontal_legend',
  formatter: function formatter(value) {
    if (_lodash2.default.isFunction(this.props.tickFormatter)) return this.props.tickFormatter(value);
    return value;
  },
  createSeries: function createSeries(row, i) {
    var _this = this;

    var formatter = row.tickFormatter || this.formatter;
    var value = formatter(this.props.seriesValues[row.id]);
    var classes = ['rhythm_chart__legend_item'];
    var key = row.id;
    if (!_lodash2.default.includes(this.props.seriesFilter, row.id)) classes.push('disabled');
    if (!row.label || row.legend === false) return _react2.default.createElement('div', { key: key, style: { display: 'none' } });
    return _react2.default.createElement(
      'div',
      {
        className: classes.join(' '),
        onClick: function onClick(event) {
          return _this.props.onToggle(event, row.id);
        },
        key: key },
      _react2.default.createElement(
        'div',
        { className: 'rhythm_chart__legend_label' },
        _react2.default.createElement('i', { className: 'fa fa-circle', style: { color: row.color } }),
        _react2.default.createElement(
          'span',
          null,
          row.label
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'rhythm_chart__legend_value' },
        value
      )
    );
  },
  render: function render() {
    var rows = this.props.series.map(this.createSeries);
    var legendStyle = {};
    var legendControlClass = 'fa fa-chevron-down';
    if (!this.props.showLegend) {
      legendStyle.display = 'none';
      legendControlClass = 'fa fa-chevron-up';
    }
    return _react2.default.createElement(
      'div',
      { className: 'rhythm_chart__legend-horizontal' },
      _react2.default.createElement(
        'div',
        { className: 'rhythm_chart__legend-control' },
        _react2.default.createElement('i', { className: legendControlClass, onClick: this.props.onClick })
      ),
      _react2.default.createElement(
        'div',
        { className: 'rhythm_chart__legend-series', style: legendStyle },
        rows
      )
    );
  }
});
module.exports = exports['default'];