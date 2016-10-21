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

var _timeseries_chart = require('./timeseries_chart');

var _timeseries_chart2 = _interopRequireDefault(_timeseries_chart);

var _legend = require('./legend');

var _legend2 = _interopRequireDefault(_legend);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'timeseries',
  getInitialState: function getInitialState() {
    var values = this.getLastValues();
    return {
      showLegend: this.props.legend != null ? this.props.legend : true,
      values: values || {},
      show: _lodash2.default.keys(values) || [],
      ignoreLegendUpdates: false,
      ignoreVisabilityUpdates: false
    };
  },
  getDefaultProps: function getDefaultProps() {
    return { legend: true };
  },
  filterLegend: function filterLegend(id) {
    if (!_lodash2.default.has(this.state.values, id)) return [];
    var notAllShown = _lodash2.default.keys(this.state.values).length !== this.state.show.length;
    var isCurrentlyShown = _lodash2.default.includes(this.state.show, id);
    var show = [];
    if (notAllShown && isCurrentlyShown) {
      this.setState({ ignoreVisabilityUpdates: false, show: Object.keys(this.state.values) });
    } else {
      show.push(id);
      this.setState({ ignoreVisabilityUpdates: true, show: [id] });
    }
    return show;
  },
  toggleFilter: function toggleFilter(event, id) {
    var show = this.filterLegend(id);
    if (_lodash2.default.isFunction(this.props.onFilter)) {
      this.props.onFilter(show);
    }
    _events2.default.trigger('toggleFilter', id, this);
  },
  getLastValues: function getLastValues(props) {
    props = props || this.props;
    var values = {};
    props.series.forEach(function (row) {
      // we need a valid identifier
      if (!row.id) row.id = row.label;
      values[row.id] = (0, _get_last_value2.default)(row.data);
    });
    return values;
  },
  updateLegend: function updateLegend(pos) {
    var values = {};
    if (pos) {
      this.props.series.forEach(function (row) {
        var closest = void 0;
        if (row.data && _lodash2.default.isArray(row.data)) {
          for (var i = 0; i < row.data.length; i++) {
            closest = i;
            if (row.data[i] && pos.x < row.data[i][0]) break;
          }
          if (!row.data[closest]) return values[row.id] = 0;
          var _row$data$closest = row.data[closest];
          var time = _row$data$closest[0];
          var value = _row$data$closest[1];

          values[row.id] = value || 0;
        }
      });
    } else {
      _lodash2.default.assign(values, this.getLastValues());
    }

    this.setState({ values: values });
  },
  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (props.legend !== this.props.legend) this.setState({ showLegend: props.legend });
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
  },
  plothover: function plothover(event, pos, item) {
    this.updateLegend(pos);
  },
  handleHideClick: function handleHideClick() {
    this.setState({ showLegend: !this.state.showLegend });
  },
  render: function render() {
    var className = 'rhythm_chart';
    if (this.props.reversed) {
      className += ' reversed';
    }
    var style = {};
    if (this.props.legendPosition === 'bottom') {
      style.flexDirection = 'column';
    }
    return _react2.default.createElement(
      'div',
      { className: className },
      _react2.default.createElement(
        'div',
        { style: style, className: 'rhythm_chart__content' },
        _react2.default.createElement(
          'div',
          { className: 'rhythm_chart__visualization' },
          _react2.default.createElement(_timeseries_chart2.default, _extends({
            show: this.state.show,
            plothover: this.plothover
          }, this.props))
        ),
        _react2.default.createElement(_legend2.default, _extends({
          showLegend: this.state.showLegend,
          seriesFilter: this.state.show,
          seriesValues: this.state.values,
          onClick: this.handleHideClick,
          onToggle: this.toggleFilter
        }, this.props))
      )
    );
  }
});
module.exports = exports['default'];