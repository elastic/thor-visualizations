'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _get_last_value = require('../lib/get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TopN = function (_Component) {
  _inherits(TopN, _Component);

  function TopN() {
    _classCallCheck(this, TopN);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  TopN.prototype.handleClick = function handleClick(item) {
    var _this2 = this;

    return function (e) {
      if (_this2.props.onClick) {
        _this2.props.onClick(item);
      }
    };
  };

  TopN.prototype.renderRow = function renderRow(maxValue) {
    var _this3 = this;

    return function (item) {
      var key = '' + (item.id || item.label);
      var lastValue = (0, _get_last_value2.default)(item.data, item.data.length);
      var formatter = item.tickFormatter || _this3.props.tickFormatter;
      var value = formatter(lastValue);
      var width = 100 * (lastValue / maxValue) + '%';
      var backgroundColor = item.color;
      var style = {};
      if (_this3.props.onClick) {
        style.cursor = 'pointer';
      }
      return _react2.default.createElement(
        'tr',
        { key: key,
          onClick: _this3.handleClick(_extends({ lastValue: lastValue }, item)),
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
  };

  TopN.prototype.render = function render() {
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
  };

  return TopN;
}(_react.Component);

TopN.defaultProps = {
  tickFormatter: function tickFormatter(n) {
    return n;
  },
  onClick: function onClick(i) {
    return i;
  }
};

TopN.propTypes = {
  tickFormatter: _react.PropTypes.func,
  onClick: _react.PropTypes.func,
  series: _react.PropTypes.array,
  reversed: _react.PropTypes.bool
};

exports.default = TopN;
module.exports = exports['default'];