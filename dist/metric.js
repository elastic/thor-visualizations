'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactDom = require('react-dom');

var _reactResizeAware = require('react-resize-aware');

var _reactResizeAware2 = _interopRequireDefault(_reactResizeAware);

var _get_last_value = require('./get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

var _reactcss = require('reactcss');

var _reactcss2 = _interopRequireDefault(_reactcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'metric',
  getInitialState: function getInitialState() {
    return { scale: 1, left: 0, top: 0, translateX: 1, translateY: 1 };
  },
  getDefaultProps: function getDefaultProps() {
    return { fontSize: 60 };
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


  // When the component updates it might need to be resized so we need to
  // recalculate the corrdinates and only update if things changed a little. THis
  // happens when the number is too wide or you add a new series.
  componentDidUpdate: function componentDidUpdate() {
    var newState = this.calculateCorrdinates();
    if (!_lodash2.default.isEqual(newState, this.state)) {
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
    this.setState(newState);
  },
  render: function render() {
    var _props = this.props;
    var metric = _props.metric;
    var secondary = _props.secondary;
    var _state = this.state;
    var scale = _state.scale;
    var translateX = _state.translateX;
    var translateY = _state.translateY;
    var top = _state.top;
    var left = _state.left;

    var primaryFormatter = metric && metric.formatter || function (n) {
      return n;
    };
    var primaryValue = primaryFormatter((0, _get_last_value2.default)(metric && metric.data || 0));
    var styles = (0, _reactcss2.default)({
      default: {
        container: {},
        inner: {
          top: this.state.top,
          left: this.state.left,
          transform: 'matrix(' + scale + ', 0, 0, ' + scale + ', ' + translateX + ', ' + translateY + ')'
        },
        primary_text: {
          color: 'rgba(0,0,0,0.5)'
        },
        primary_value: {
          color: '#000'
        },
        secondary_text: {
          color: 'rgba(0,0,0,0.5)'
        },
        secondary_value: {
          color: '#000'
        }
      },
      reversed: {
        primary_text: {
          color: 'rgba(255,255,255,0.7)'
        },
        primary_value: {
          color: '#FFF'
        },
        secondary_text: {
          color: 'rgba(255,255,255,0.7)'
        },
        secondary_value: {
          color: '#FFF'
        }

      }
    }, this.props);

    if (this.props.backgroundColor) styles.container.backgroundColor = this.props.backgroundColor;
    if (metric && metric.color) styles.primary_value.color = metric.color;
    var primaryLabel = void 0;
    if (metric && metric.label) {
      primaryLabel = _react2.default.createElement(
        'div',
        { style: styles.primary_text, className: 'rhythm_metric__primary-label' },
        metric.label
      );
    }

    var secondarySnippet = void 0;
    if (secondary) {
      var secondaryFormatter = secondary.formatter || function (n) {
        return n;
      };
      var secondaryValue = secondaryFormatter((0, _get_last_value2.default)(secondary.data));
      if (secondary.color) styles.secondary_value.color = secondary.color;
      var secondaryLabel = void 0;
      if (secondary.label) {
        secondaryLabel = _react2.default.createElement(
          'div',
          { style: styles.secondary_text, className: 'rhythm_metric__secondary-label' },
          secondary.label
        );
      }
      secondarySnippet = _react2.default.createElement(
        'div',
        { className: 'rhythm_metric__secondary' },
        secondaryLabel,
        _react2.default.createElement(
          'div',
          { style: styles.secondary_value, className: 'rhythm_metric__secondary-value' },
          secondaryValue
        )
      );
    }

    return _react2.default.createElement(
      'div',
      { className: 'rhythm_metric', ref: 'container', style: styles.container },
      _react2.default.createElement(
        _reactResizeAware2.default,
        { ref: 'resize', className: 'rhythm_metric__resize' },
        _react2.default.createElement(
          'div',
          { ref: 'inner', className: 'rhythm_metric__inner', style: styles.inner },
          _react2.default.createElement(
            'div',
            { className: 'rhythm_metric__primary' },
            primaryLabel,
            _react2.default.createElement(
              'div',
              { style: styles.primary_value, className: 'rhythm_metric__primary-value' },
              primaryValue
            )
          ),
          secondarySnippet
        )
      )
    );
  }
});
module.exports = exports['default'];