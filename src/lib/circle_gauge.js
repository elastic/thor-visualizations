import _ from 'lodash';
import numeral from 'numeral';
import React, { Component } from 'react';
import $ from './flot';
import getLastValue from './get_last_value';
import CircleGaugeVis from './circle_gauge_vis';

class CircleGauge extends Component {

  constructor(props) {
    super(props);
    this.height = props.height || 150;
    this.width = props.width || 150;
  }

  render() {
    const value = getLastValue(this.props.metrics);
    const format = this.props.format || '0.00%';
    const titleFontSize = this.height * 0.1;
    const labelFontSize = this.height * 0.2;
    const gaugeProps = {
      value,
      max: this.props.max || 1,
      height: this.height,
      width: this.width,
      thresholds: this.props.thresholds != null ? this.props.thresholds : true,
      color: this.props.color || '#8ac336'
    };
    return (
      <div className="circle-gauge" style={{ width: this.width, height: this.height }}>
        <div className="metrics">
          <div
            className="title"
            style={{ fontSize: titleFontSize }}
            ref="title">{ this.props.title }</div>
          <div
            className="label"
            style={{ fontSize: labelFontSize }}
            ref="label">{ numeral(value).format(format) }</div>
        </div>
        <CircleGaugeVis {...gaugeProps}/>
      </div>
    );
  }

}

export default CircleGauge;

