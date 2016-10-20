'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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
  handleClick: function handleClick(item) {
    var _this3 = this;

    return function (e) {
      if (_this3.props.onClick) {
        _this3.props.onClick(item);
      }
    };
  },
  renderRow: function renderRow(maxValue) {
    var _this4 = this;

    return function (item) {
      var key = '' + (item.id || item.label);
      var lastValue = (0, _get_last_value2.default)(item.data, item.data.length);
      var formatter = item.tickFormatter || _this4.props.tickFormatter;
      var value = formatter(lastValue);
      var width = 100 * (lastValue / maxValue) + '%';
      var backgroundColor = item.color;
      var style = {};
      if (_this4.props.onClick) {
        style.cursor = 'pointer';
      };
      return _react2.default.createElement(
        'tr',
        { key: key,
          onClick: _this4.handleClick(_extends({ lastValue: lastValue }, item)),
          style: style },
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
    if (!this.props.series) return _react2.default.createElement('div', { style: { display: 'none' } });
    var maxValue = this.props.series.reduce(function (max, series) {
      var lastValue = (0, _get_last_value2.default)(series.data, series.data.length);
      return lastValue > max ? lastValue : max;
    }, 0);

    var rows = _lodash2.default.sortBy(this.props.series, function (s) {
      return (0, _get_last_value2.default)(s.data, s.data.length);
    }).reverse().map(this.renderRow(maxValue));
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