import _ from 'lodash';
import numeral from 'numeral';
import React, { Component } from 'react';
import $ from './flot';
import getLastValue from './get_last_value';
import TimeseriesChart from './timeseries_chart';
import eventBus from './events';
export default React.createClass({
  getInitialState() {
    const values = this.getLastValues();
    return {
      showLegend: this.props.legend != null ? this.props.legend : true,
      values: values || {},
      show: _.keys(values) || [],
      ignoreLegendUpdates: false,
      ignoreVisabilityUpdates: false
    };
  },

  getDefaultProps() {
    return { legend: true };
  },

  format(value) {
    if (_.isFunction(this.props.tickFormatter)) return this.props.tickFormatter(value);
    return value;
  },

  filterLegend(id) {
    if (!_.has(this.state.values, id)) return [];
    const notAllShown = _.keys(this.state.values).length !== this.state.show.length;
    const isCurrentlyShown = _.includes(this.state.show, id);
    const show = [];
    if (notAllShown && isCurrentlyShown) {
      this.setState({ ignoreVisabilityUpdates: false, show: Object.keys(this.state.values) });
    } else {
      show.push(id);
      this.setState({ ignoreVisabilityUpdates: true, show: [id] });
    }
    return show;
  },

  toggleFilter(event, id) {
    const show = this.filterLegend(id);
    if (_.isFunction(this.props.onFilter)) {
      this.props.onFilter(show);
    }
    eventBus.trigger('toggleFilter', id, this);
  },

  createSeries(row, i) {
    const formatter = row.tickFormatter || this.format;
    const value = formatter(this.state.values[row.id]);
    const classes = ['rhythm_chart__legend_item'];
    const key = row.id;
    if (!_.includes(this.state.show, row.id)) classes.push('disabled');
    if (!row.label || row.legend === false) return (<div key={ key } style={{display: 'none'}}/>);
    return (
      <div
        className={ classes.join(' ') }
        onClick={ event => this.toggleFilter(event, row.id) }
        key={ key }>
        <div className="rhythm_chart__legend_label">
          <i className="fa fa-circle" style={{ color: row.color }}></i>
          <span>{ row.label }</span>
        </div>
        <div className="rhythm_chart__legend_value">{ value }</div>
      </div>
    );
  },

  getLastValues(props) {
    props = props || this.props;
    const values = {};
    props.series.forEach((row) => {
      // we need a valid identifier
      if (!row.id) row.id = row.label;
      values[row.id] = getLastValue(row.data);
    });
    return values;
  },

  updateLegend(pos) {
    const values = {};
    if (pos) {
      this.props.series.forEach((row) => {
        let closest;
        if (row.data && _.isArray(row.data)) {
          for (let i = 0; i < row.data.length; i++) {
            closest = i;
            if (row.data[i] && pos.x < row.data[i][0]) break;
          }
          if (!row.data[closest]) return values[row.id] = 0;
          const [ time, value ] = row.data[closest];
          values[row.id] = value || 0;
        }
      });
    } else {
      _.assign(values, this.getLastValues());
    }

    this.setState({ values });
  },


  componentWillReceiveProps(props) {
    if (props.legend !== this.props.legend) this.setState({ showLegend: props.legend });
    if (!this.state.ignoreLegendUpdates) {
      const values = this.getLastValues(props);
      const currentKeys = _.keys(this.state.values);
      const keys = _.keys(values);
      const diff = _.difference(keys, currentKeys);
      const nextState = { values: values };
      if (diff.length && !this.state.ignoreVisabilityUpdates) {
        nextState.show = keys;
      }
      this.setState(nextState);
    }
  },

  plothover(event, pos, item) {
    this.updateLegend(pos);
  },

  handleHideClick() {
    this.setState({ showLegend: !this.state.showLegend });
  },

  render() {
    const rows = this.props.series.map(this.createSeries);
    const legendStyle = { };
    let legendControlClass = 'fa fa-chevron-right';
    let legnedWidth = 200;
    if (!this.state.showLegend) {
      legnedWidth = 12;
      legendStyle.display = 'none';
      legendControlClass = 'fa fa-chevron-left';
    }
    let className = 'rhythm_chart';
    if (this.props.reversed) {
      className += ' reversed';
    }
    return (
      <div className={className}>
        <div className="rhythm_chart__content">
          <div className="rhythm_chart__visualization">
            <TimeseriesChart
              show={ this.state.show }
              plothover={ this.plothover}
              {...this.props}/>
          </div>
          <div className="rhythm_chart__legend" style={{width: legnedWidth}}>
            <div className="rhythm_chart__legend-control">
              <i className={legendControlClass} onClick={this.handleHideClick}/>
            </div>
            <div className="rhythm_chart__legend-series" style={legendStyle}>
              { rows }
           </div>
          </div>
        </div>
      </div>
    );
  }

});
