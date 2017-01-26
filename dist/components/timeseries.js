'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _flot = require('../lib/flot');

var _flot2 = _interopRequireDefault(_flot);

var _get_last_value = require('../lib/get_last_value');

var _get_last_value2 = _interopRequireDefault(_get_last_value);

var _timeseries_chart = require('./timeseries_chart');

var _timeseries_chart2 = _interopRequireDefault(_timeseries_chart);

var _legend = require('./legend');

var _legend2 = _interopRequireDefault(_legend);

var _events = require('../lib/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Timeseries = function (_Component) {
  _inherits(Timeseries, _Component);

  function Timeseries(props) {
    _classCallCheck(this, Timeseries);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    var values = _this.getLastValues(props);
    _this.state = {
      showLegend: props.legend != null ? props.legend : true,
      values: values || {},
      show: _lodash2.default.keys(values) || [],
      ignoreLegendUpdates: false,
      ignoreVisabilityUpdates: false
    };
    _this.toggleFilter = _this.toggleFilter.bind(_this);
    _this.handleHideClick = _this.handleHideClick.bind(_this);
    _this.plothover = _this.plothover.bind(_this);
    return _this;
  }

  Timeseries.prototype.filterLegend = function filterLegend(id) {
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
  };

  Timeseries.prototype.toggleFilter = function toggleFilter(event, id) {
    var show = this.filterLegend(id);
    if (_lodash2.default.isFunction(this.props.onFilter)) {
      this.props.onFilter(show);
    }
    _events2.default.trigger('toggleFilter', id, this);
  };

  Timeseries.prototype.getLastValues = function getLastValues(props) {
    var values = {};
    props.series.forEach(function (row) {
      // we need a valid identifier
      if (!row.id) row.id = row.label;
      values[row.id] = (0, _get_last_value2.default)(row.data);
    });
    return values;
  };

  Timeseries.prototype.updateLegend = function updateLegend(pos, item) {
    var values = {};
    if (pos) {
      this.props.series.forEach(function (row) {
        if (row.data && _lodash2.default.isArray(row.data)) {
          if (item && row.data[item.dataIndex] && row.data[item.dataIndex][0] === item.datapoint[0]) {
            values[row.id] = row.data[item.dataIndex][1];
          } else {
            var closest = void 0;
            for (var i = 0; i < row.data.length; i++) {
              closest = i;
              if (row.data[i] && pos.x < row.data[i][0]) break;
            }
            if (!row.data[closest]) return values[row.id] = null;
            var _row$data$closest = row.data[closest];
            var time = _row$data$closest[0];
            var value = _row$data$closest[1];

            values[row.id] = value != null && value || null;
          }
        }
      });
    } else {
      _lodash2.default.assign(values, this.getLastValues(this.props));
    }

    this.setState({ values: values });
  };

  Timeseries.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
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
  };

  Timeseries.prototype.plothover = function plothover(event, pos, item) {
    this.updateLegend(pos, item);
  };

  Timeseries.prototype.handleHideClick = function handleHideClick() {
    this.setState({ showLegend: !this.state.showLegend });
  };

  Timeseries.prototype.render = function render() {
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
          _react2.default.createElement(_timeseries_chart2.default, {
            crosshair: this.props.crosshair,
            onBrush: this.props.onBrush,
            plothover: this.plothover,
            reversed: this.props.reversed,
            series: this.props.series,
            show: this.state.show,
            tickFormatter: this.props.tickFormatter,
            yaxes: this.props.yaxes })
        ),
        _react2.default.createElement(_legend2.default, {
          legendPosition: this.props.legendPosition,
          onClick: this.handleHideClick,
          onToggle: this.toggleFilter,
          series: this.props.series,
          showLegend: this.state.showLegend,
          seriesValues: this.state.values,
          seriesFilter: this.state.show,
          tickFormatter: this.props.tickFormatter })
      )
    );
  };

  return Timeseries;
}(_react.Component);

Timeseries.defaultProps = {
  legned: true
};

Timeseries.propTypes = {
  legend: _react.PropTypes.bool,
  legendPosition: _react.PropTypes.string,
  onFilter: _react.PropTypes.func,
  series: _react.PropTypes.array,
  reversed: _react.PropTypes.bool,
  tickFormatter: _react.PropTypes.func
};

exports.default = Timeseries;
module.exports = exports['default'];