'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flot = require('../lib/flot');

var _flot2 = _interopRequireDefault(_flot);

var _get_last_value = require('../lib/get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

var _get_value_by = require('../lib/get_value_by');

var _get_value_by2 = _interopRequireDefault(_get_value_by);

var _simianhackerReactResizeAware = require('simianhacker-react-resize-aware');

var _simianhackerReactResizeAware2 = _interopRequireDefault(_simianhackerReactResizeAware);

var _gauge_vis = require('./gauge_vis');

var _gauge_vis2 = _interopRequireDefault(_gauge_vis);

var _reactDom = require('react-dom');

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Gauge = function (_Component) {
  _inherits(Gauge, _Component);

  function Gauge(props) {
    _classCallCheck(this, Gauge);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      scale: 1,
      top: 0,
      left: 0,
      translateX: 1,
      translateY: 1
    };

    _this.handleResize = _this.handleResize.bind(_this);
    return _this;
  }

  Gauge.prototype.calculateCorrdinates = function calculateCorrdinates() {
    var inner = (0, _reactDom.findDOMNode)(this.refs.inner);
    var resize = (0, _reactDom.findDOMNode)(this.refs.resize);
    var scale = this.state.scale;

    if (!inner || !resize) return;

    // Let's start by scaling to the largest dimension
    if (resize.clientWidth - resize.clientHeight < 0) {
      scale = resize.clientWidth / inner.clientWidth;
    } else {
      scale = resize.clientHeight / inner.clientHeight;
    }

    var _calcDimensions = this.calcDimensions(inner, scale);

    var newWidth = _calcDimensions[0];
    var newHeight = _calcDimensions[1];

    // Now we need to check to see if it will still fit

    if (newWidth > resize.clientWidth) {
      scale = resize.clientWidth / inner.clientWidth;
    }
    if (newHeight > resize.clientHeight) {
      scale = resize.clientHeight / inner.clientHeight;
    }

    // Calculate the final dimensions

    // Because scale is middle out we need to translate
    // the new X,Y corrdinates
    var _calcDimensions2 = this.calcDimensions(inner, scale);

    newWidth = _calcDimensions2[0];
    newHeight = _calcDimensions2[1];
    var translateX = (newWidth - inner.clientWidth) / 2;
    var translateY = (newHeight - inner.clientHeight) / 2;

    // Center up and down
    var top = Math.floor((resize.clientHeight - newHeight) / 2);
    var left = Math.floor((resize.clientWidth - newWidth) / 2);

    return { scale: scale, top: top, left: left, translateY: translateY, translateX: translateX };
  };

  Gauge.prototype.componentDidMount = function componentDidMount() {
    var resize = (0, _reactDom.findDOMNode)(this.refs.resize);
    if (!resize) return;
    resize.addEventListener('resize', this.handleResize);
    this.handleResize();
  };

  Gauge.prototype.componentWillUnmount = function componentWillUnmount() {
    var resize = (0, _reactDom.findDOMNode)(this.refs.resize);
    if (!resize) return;
    resize.removeEventListener('resize', this.handleResize);
  };

  // When the component updates it might need to be resized so we need to
  // recalculate the corrdinates and only update if things changed a little. THis
  // happens when the number is too wide or you add a new series.


  Gauge.prototype.componentDidUpdate = function componentDidUpdate() {
    var newState = this.calculateCorrdinates();
    if (newState && !_lodash2.default.isEqual(newState, this.state)) {
      this.setState(newState);
    }
  };

  Gauge.prototype.calcDimensions = function calcDimensions(el, scale) {
    var newWidth = Math.floor(el.clientWidth * scale);
    var newHeight = Math.floor(el.clientHeight * scale);
    return [newWidth, newHeight];
  };

  Gauge.prototype.handleResize = function handleResize() {
    // Bingo!
    var newState = this.calculateCorrdinates();
    newState && this.setState(newState);
  };

  Gauge.prototype.render = function render() {
    var _props = this.props;
    var metric = _props.metric;
    var type = _props.type;
    var _state = this.state;
    var scale = _state.scale;
    var translateX = _state.translateX;
    var translateY = _state.translateY;
    var top = _state.top;
    var left = _state.left;

    var value = metric && (0, _get_last_value2.default)(metric.data, 5) || 0;
    var max = metric && (0, _get_value_by2.default)('max', metric.data) || 1;
    var formatter = metric && (metric.tickFormatter || metric.formatter) || this.props.tickFormatter || function (v) {
      return v;
    };
    var title = metric && metric.label || '';
    var styles = (0, _reactcss2.default)({
      default: {
        inner: {
          top: this.state.top || 0,
          left: this.state.left || 0,
          transform: 'matrix(' + scale + ', 0, 0, ' + scale + ', ' + translateX + ', ' + translateY + ')'
        }
      }
    }, this.props);

    var gaugeProps = {
      reversed: this.props.reversed,
      value: value,
      gaugeLine: this.props.gaugeLine,
      innerLine: this.props.innerLine,
      innerColor: this.props.innerColor,
      max: this.props.max || max,
      color: metric && metric.color || '#8ac336',
      type: type
    };
    var valueStyle = {};
    if (this.props.valueColor) {
      valueStyle.color = this.props.valueColor;
    }

    var metrics = void 0;
    if (metric) {
      if (type === 'half') {
        metrics = _react2.default.createElement(
          'div',
          {
            className: 'thorHalfGauge__metrics',
            ref: 'inner',
            style: styles.inner },
          _react2.default.createElement(
            'div',
            {
              className: 'thorHalfGauge__label',
              ref: 'title' },
            title
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'thorHalfGauge__value',
              style: valueStyle,
              ref: 'label' },
            formatter(value)
          )
        );
      } else {
        metrics = _react2.default.createElement(
          'div',
          {
            className: 'thorCircleGauge__metrics',
            ref: 'inner',
            style: styles.inner },
          _react2.default.createElement(
            'div',
            {
              className: 'thorCircleGauge__value',
              style: valueStyle,
              ref: 'label' },
            formatter(value)
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'thorCircleGauge__label',
              ref: 'title' },
            title
          )
        );
      }
    }
    var className = type === 'half' ? 'thorHalfGauge' : 'thorCircleGauge';
    if (this.props.reversed) className = 'reversed ' + className;
    return _react2.default.createElement(
      'div',
      { className: className },
      _react2.default.createElement(
        _simianhackerReactResizeAware2.default,
        { className: className + '__resize', ref: 'resize' },
        metrics,
        _react2.default.createElement(_gauge_vis2.default, gaugeProps)
      )
    );
  };

  return Gauge;
}(_react.Component);

Gauge.propTypes = {
  type: 'half',
  innerLine: 2,
  gaugeLine: 10
};

Gauge.propTypes = {
  gaugeLine: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  innerColor: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  innerLine: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  max: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
  metric: _react.PropTypes.object,
  reversed: _react.PropTypes.bool,
  type: _react.PropTypes.oneOf(['half', 'circle']),
  valueColor: _react.PropTypes.string
};

exports.default = Gauge;
module.exports = exports['default'];