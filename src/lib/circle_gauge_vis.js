import React, { Component } from 'react';
import GaugeVis from './gauge_vis';
class CircleGaugeVis extends GaugeVis {

  constructor(props) {
    super(props);
    this.opts.series.pie.innerRadius = 0.9;
    this.opts.series.pie.startAngle = 1.5;
  }

  caluclateData(value) {
    let color = this.props.color || '#8ac336';
    if (this.props.thresholds) {
      if (value > 0.60) color = '#fbce47';
      if (value > 0.80) color = '#d76051';
    }
    return [
      { color: color, data: (value) },
      { color: '#DDDDDD', data: 1 - value },
    ];
  }

  render() {
      return (
        <div className="chart" style={{ height: this.height }}>
          <div ref="target"/>
        </div>
      );
    }
}

export default CircleGaugeVis;

