'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flot = require('./flot');

var _flot2 = _interopRequireDefault(_flot);

var _get_last_value = require('./get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

var _get_value_by = require('./get_value_by');

var _get_value_by2 = _interopRequireDefault(_get_value_by);

var _reactResizeAware = require('react-resize-aware');

var _reactResizeAware2 = _interopRequireDefault(_reactResizeAware);

var _circle_gauge_vis = require('./circle_gauge_vis');

var _circle_gauge_vis2 = _interopRequireDefault(_circle_gauge_vis);

var _reactDom = require('react-dom');

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'circle_gauge',
  getInitialState: function getInitialState() {
    return { scale: 1, top: 0, left: 0, translateX: 1, translateY: 1 };
  },
  getDefaultProps: function getDefaultProps() {
    return { innerLine: 2, gaugeLine: 10 };
  },
  calculateCorrdinates: function calculateCorrdinates() {
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
  },
  componentDidMount: function componentDidMount() {
    var resize = (0, _reactDom.findDOMNode)(this.refs.resize);
    if (!resize) return;
    resize.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  componentWillUnmount: function componentWillUnmount() {
    var resize = (0, _reactDom.findDOMNode)(this.refs.resize);
    if (!resize) return;
    resize.removeEventListener('resize', this.handleResize);
  },


  // When the component updates it might need to be resized so we need to
  // recalculate the corrdinates and only update if things changed a little. THis
  // happens when the number is too wide or you add a new series.
  componentDidUpdate: function componentDidUpdate() {
    var newState = this.calculateCorrdinates();
    if (newState && !_lodash2.default.isEqual(newState, this.state)) {
      this.setState(newState);
    };
  },
  calcDimensions: function calcDimensions(el, scale) {
    var newWidth = Math.floor(el.clientWidth * scale);
    var newHeight = Math.floor(el.clientHeight * scale);
    return [newWidth, newHeight];
  },
  handleResize: function handleResize() {
    // Bingo!
    var newState = this.calculateCorrdinates();
    newState && this.setState(newState);
  },
  render: function render() {
    var metric = this.props.metric;
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
          top: this.state.top,
          left: this.state.left,
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
      color: metric && metric.color || '#8ac336'
    };
    var valueStyle = {};
    if (this.props.valueColor) {
      valueStyle.color = this.props.valueColor;
    }

    var metrics = void 0;
    if (metric) {
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
    var className = 'thorCircleGauge';
    if (this.props.reversed) className += ' reversed';
    return _react2.default.createElement(
      'div',
      { className: className },
      _react2.default.createElement(
        _reactResizeAware2.default,
        { className: 'thorCircleGauge__resize', ref: 'resize' },
        metrics,
        _react2.default.createElement(_circle_gauge_vis2.default, gaugeProps)
      )
    );
  }
});
module.exports = exports['default'];