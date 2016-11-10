'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flot = require('./flot');

var _flot2 = _interopRequireDefault(_flot);

var _reactResizeAware = require('react-resize-aware');

var _reactResizeAware2 = _interopRequireDefault(_reactResizeAware);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactDom = require('react-dom');

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'half_gauge_vis',
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
    var _props = this.props;
    var value = _props.value;
    var max = _props.max;
    var color = _props.color;
    var reversed = _props.reversed;
    var _state = this.state;
    var scale = _state.scale;
    var translateX = _state.translateX;
    var translateY = _state.translateY;
    var top = _state.top;
    var left = _state.left;

    var size = 2 * Math.PI * 50;
    var sliceSize = 0.6;
    var percent = value < max ? value / max : 1;
    var styles = (0, _reactcss2.default)({
      default: {
        resize: {
          position: 'relative',
          display: 'flex',
          rowDirection: 'column',
          flex: '1 0 auto'
        },
        svg: {
          position: 'absolute',
          top: this.state.top,
          left: this.state.left,
          transform: 'matrix(' + scale + ', 0, 0, ' + scale + ', ' + translateX + ', ' + translateY + ')'
        }
      }
    }, this.props);

    var props = {
      circle: {
        r: 50,
        cx: 60,
        cy: 60,
        fill: 'rgba(0,0,0,0)',
        stroke: color,
        strokeWidth: this.props.gaugeLine,
        strokeDasharray: percent * sliceSize * size + ' ' + size,
        transform: 'rotate(-197.8 60 60)'
      },
      circleBackground: {
        r: 50,
        cx: 60,
        cy: 60,
        fill: 'rgba(0,0,0,0)',
        stroke: this.props.reversed ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        strokeDasharray: sliceSize * size + ' ' + size,
        strokeWidth: this.props.innerLine,
        transform: 'rotate(162 60 60)'
      }
    };

    if (this.props.innerColor) {
      props.circleBackground.stroke = this.props.innerColor;
    }
    return _react2.default.createElement(
      _reactResizeAware2.default,
      { ref: 'resize', style: styles.resize },
      _react2.default.createElement(
        'div',
        { style: styles.svg, ref: 'inner' },
        _react2.default.createElement(
          'svg',
          { width: 120.72, height: 78.72 },
          _react2.default.createElement('circle', props.circleBackground),
          _react2.default.createElement('circle', props.circle)
        )
      )
    );
  }
});
module.exports = exports['default'];