'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var _chart_vis = require('./chart_vis');

var _chart_vis2 = _interopRequireDefault(_chart_vis);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chart = function (_Component) {
  _inherits(Chart, _Component);

  function Chart(props) {
    _classCallCheck(this, Chart);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    var values = _this.getLastValues();
    _this.state = {
      values: values || [],
      show: _lodash2.default.keys(values) || [],
      ignoreLegendUpdates: false,
      ignoreVisabilityUpdates: false
    };

    var debouncedUpdateLegend = _lodash2.default.debounce(function (pos) {
      _this.updateLegend(pos);
    }, 50, { leading: false, trailing: true });

    _this.handlePlotHover = function (e, pos) {
      _this.setState({ ignoreLegendUpdates: true });
      debouncedUpdateLegend(pos);
    };

    _this.handlePlotLeave = function (e) {
      if (_this.state.ignoreLegendUpdates) {
        debouncedUpdateLegend();
      } else {
        _this.updateLegend();
      }
      _this.setState({ ignoreLegendUpdates: false });
    };

    _this.handleFilterToggle = function (e, label, source) {
      if (source !== _this) _this.filterLegend(label);
    };
    return _this;
  }

  Chart.prototype.format = function format(value) {
    if (_lodash2.default.isFunction(this.props.tickFormatter)) return this.props.tickFormatter(value);
    return value;
  };

  Chart.prototype.filterLegend = function filterLegend(label) {
    if (!_lodash2.default.has(this.state.values, label)) return [];
    var notAllShown = _lodash2.default.keys(this.state.values).length !== this.state.show.length;
    var isCurrentlyShown = _lodash2.default.includes(this.state.show, label);
    var show = [];
    if (notAllShown && isCurrentlyShown) {
      this.setState({ ignoreVisabilityUpdates: false, show: Object.keys(this.state.values) });
    } else {
      show.push(label);
      this.setState({ ignoreVisabilityUpdates: true, show: [label] });
    }
    return show;
  };

  Chart.prototype.toggleFilter = function toggleFilter(event, label) {
    var show = this.filterLegend(label);
    if (_lodash2.default.isFunction(this.props.onFilter)) {
      this.props.onFilter(show);
    }
    _events2.default.trigger('toggleFilter', label, this);
  };

  Chart.prototype.createSeries = function createSeries(row) {
    var _this2 = this;

    var value = this.format(this.state.values[row.label]);
    var classes = ['rhythm_chart__legend_item'];
    if (!_lodash2.default.includes(this.state.show, row.label)) classes.push('disabled');
    return _react2.default.createElement(
      'div',
      {
        className: classes.join(' '),
        onClick: function onClick(event) {
          return _this2.toggleFilter(event, row.label);
        },
        key: row.label },
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

  Chart.prototype.getLastValues = function getLastValues(props) {
    props = props || this.props;
    var values = {};
    props.metrics.forEach(function (row) {
      values[row.label] = (0, _get_last_value2.default)(row.data);
    });
    return values;
  };

  Chart.prototype.updateLegend = function updateLegend(pos) {
    var values = {};
    if (pos) {
      this.props.metrics.forEach(function (row) {
        var closest = void 0;
        if (row.data && _lodash2.default.isArray(row.data)) {
          for (var i = 0; i < row.data.length; i++) {
            closest = i;
            if (row.data[i] && pos.x < row.data[i][0]) break;
          }
          if (!row.data[closest]) return values[row.label] = 0;
          var _row$data$closest = row.data[closest];
          var time = _row$data$closest[0];
          var value = _row$data$closest[1];

          values[row.label] = value || 0;
        }
      });
    } else {
      _lodash2.default.assign(values, this.getLastValues());
    }

    this.setState({ values: values });
  };

  Chart.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (!this.state.ignoreLegendUpdates) {
      var values = this.getLastValues(props);
      var currentKeys = _lodash2.default.keys(this.state.values);
      var keys = _lodash2.default.keys(values);
      var diff = _lodash2.default.difference(keys, currentKeys);
      var nextState = { values: values };
      if (diff.length && !this.state.ignoreVisabilityUpdates) {
        nextState.show = keys;
      }
      this.setState(nextState);
    }
  };

  Chart.prototype.plothover = function plothover(event, pos, item) {
    // this.setState({ ignoreLegendUpdates: true });
    this.updateLegend(pos);
    _events2.default.trigger('rhythmPlothover', pos);
  };

  Chart.prototype.componentDidMount = function componentDidMount() {
    if (this.props.crosshair) {
      _events2.default.on('rhythmPlothover', this.handlePlotHover);
      _events2.default.on('rhythmPlotLeave', this.handlePlotLeave);
    }
    _events2.default.on('toggleFilter', this.handleFilterToggle);
  };

  Chart.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.props.crosshair) {
      _events2.default.off('rhythmPlothover', this.handlePlotHover);
      _events2.default.off('rhythmPlotLeave', this.handlePlotLeave);
    }
    _events2.default.off('toggleFilter', this.handleFilterToggle);
  };

  Chart.prototype.render = function render() {
    var _this3 = this;

    var rows = this.props.metrics.map(function (row) {
      return _this3.createSeries(row);
    });
    var title = this.props.title && _react2.default.createElement(
      'div',
      { className: 'rhythm_chart__title' },
      this.props.title
    ) || '';
    var legendHeight = (this.props.height || 75) - 5;
    return _react2.default.createElement(
      'div',
      { className: 'rhythm_chart' },
      title,
      _react2.default.createElement(
        'div',
        { className: 'rhythm_chart__content' },
        _react2.default.createElement(
          'div',
          { className: 'rhythm_chart__visualization' },
          _react2.default.createElement(_chart_vis2.default, _extends({
            show: this.state.show,
            plothover: this.plothover.bind(this)
          }, this.props))
        ),
        _react2.default.createElement(
          'div',
          { className: 'rhythm_chart__legend', style: { height: legendHeight + 'px' } },
          rows
        )
      )
    );
  };

  return Chart;
}(_react.Component);

exports.default = Chart;
module.exports = exports['default'];