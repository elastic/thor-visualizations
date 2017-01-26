'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return function (row, i) {

    function tickFormatter(value) {
      if (_lodash2.default.isFunction(props.tickFormatter)) return props.tickFormatter(value);
      return value;
    }

    var formatter = row.tickFormatter || tickFormatter;
    var value = formatter(props.seriesValues[row.id]);
    var classes = ['rhythm_chart__legend_item'];
    var key = row.id;
    if (!_lodash2.default.includes(props.seriesFilter, row.id)) classes.push('disabled');
    if (!row.label || row.legend === false) return _react2.default.createElement('div', { key: key, style: { display: 'none' } });
    return _react2.default.createElement(
      'div',
      {
        className: classes.join(' '),
        onClick: function onClick(event) {
          return props.onToggle(event, row.id);
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
  };
};

module.exports = exports['default'];