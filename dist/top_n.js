'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _get_last_value = require('./get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'top_n',
  getDefaultProps: function getDefaultProps() {
    return {
      tickFormatter: function tickFormatter(n) {
        return n;
      },
      onClick: function onClick(e) {
        return e;
      }
    };
  },
  renderLabels: function renderLabels() {
    var _this = this;

    return function (item) {
      var key = (item.id || item.label) + '-label';
      return _react2.default.createElement(
        'div',
        { key: key,
          onClick: function onClick(e) {
            return _this.props.onClick(e, item);
          },
          className: 'rhythm_top_n__label' },
        item.label
      );
    };
  },
  renderBars: function renderBars(maxValue) {
    return function (item) {
      var key = (item.id || item.label) + '-bar';
      var lastValue = (0, _get_last_value2.default)(item.data);
      var width = 100 * (lastValue / maxValue) + '%';
      var backgroundColor = item.color;
      return _react2.default.createElement(
        'div',
        { key: key, className: 'rhythm_top_n__bar' },
        _react2.default.createElement('div', { className: 'rhythm_top_n__inner-bar', style: { width: width, backgroundColor: backgroundColor } })
      );
    };
  },
  renderValues: function renderValues() {
    var _this2 = this;

    return function (item) {
      var key = (item.id || item.label) + '-value';
      var lastValue = (0, _get_last_value2.default)(item.data);
      var value = _this2.props.tickFormatter(lastValue);
      return _react2.default.createElement(
        'div',
        { key: key, className: 'rhythm_top_n__value' },
        value
      );
    };
  },
  renderRow: function renderRow(maxValue) {
    var _this3 = this;

    return function (item) {
      var key = '' + (item.id || item.label);
      var lastValue = (0, _get_last_value2.default)(item.data);
      var value = _this3.props.tickFormatter(lastValue);
      var width = 100 * (lastValue / maxValue) + '%';
      var backgroundColor = item.color;
      return _react2.default.createElement(
        'tr',
        { key: key },
        _react2.default.createElement(
          'td',
          { width: '1*', className: 'rhythm_top_n__label' },
          item.label
        ),
        _react2.default.createElement(
          'td',
          { width: '100%', className: 'rhythm_top_n__bar' },
          _react2.default.createElement('div', { className: 'rhythm_top_n__inner-bar',
            style: { width: width, backgroundColor: backgroundColor } })
        ),
        _react2.default.createElement(
          'td',
          { width: '1*', className: 'rhythm_top_n__value' },
          value
        )
      );
    };
  },
  render: function render() {
    var maxValue = this.props.series.reduce(function (max, series) {
      var lastValue = (0, _get_last_value2.default)(series.data);
      return lastValue > max ? lastValue : max;
    }, 0);

    var rows = this.props.series.map(this.renderRow(maxValue));
    var className = 'rhythm_top_n';
    if (this.props.reversed) {
      className += ' reversed';
    }

    return _react2.default.createElement(
      'div',
      { className: className },
      _react2.default.createElement(
        'table',
        { className: 'rhythm_top_n__table' },
        _react2.default.createElement(
          'tbody',
          null,
          rows
        )
      )
    );

    // const labels = this.props.series.map(this.renderLabels(maxValue));
    // const bars = this.props.series.map(this.renderBars(maxValue));
    // const values = this.props.series.map(this.renderValues(maxValue));
    // return (
    //   <div className="rhythm_top_n">
    //     <div className="rhythm_top_n__container">
    //       <div className="rhythm_top_n__labels">{ labels }</div>
    //       <div className="rhythm_top_n__bars">{ bars }</div>
    //       <div className="rhythm_top_n__values">{ values }</div>
    //     </div>
    //   </div>
    // );
  }
});
module.exports = exports['default'];