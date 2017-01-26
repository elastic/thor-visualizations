import React from 'react';
import { ResizableBox } from 'react-resizable';
import moment from 'moment';
import Timeseries from '../../components/timeseries';
import generateData from '../lib/generate_data';
import Color from 'color';
import _ from 'lodash';
import numeral from 'numeral';

export default React.createClass({
  render() {
    const createSeries = (options) => {
      const color = new Color(options.color);
      return n => {
        const series = _.assign({}, options, {
          color: color.hexString(),
          label: `Series ${n + 1}`,
          data: generateData(),
        });
        color.darken(0.1);
        return series;
      };
    };

    const lineChartSeries = _.times(10).map(createSeries({
      color: '#C0FF6E',
      stack: false,
      lines: { show: true, lineWidth: 1, fill: 0 },
      points: { show: true, lineWidth: 1, radius: 1, fill: 1 }
    }));

    const areaChartSeries = _.times(10).map(createSeries({
      color: '#6EDBFF',
      stack: true,
      lines: { show: true, lineWidth: 1, fill: 0.5 },
      points: { show: true, lineWidth: 1, radius: 1, fill: 1 }
    }));

    const barChartSeries = _.times(10).map(createSeries({
      color: '#C599FF',
      stack: true,
      bars: { show: true, fill: 1, lineWidth: 0 }
    }));

    const tickFormatter = n => numeral(n).format('0.0b');

    return (
      <div>
        <h2>Timeseries Bar Chart</h2>
        <ResizableBox
          className="examples__box"
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <Timeseries
            tickFormatter={tickFormatter}
            series={barChartSeries} />
        </ResizableBox>
        <h2>Timeseries Line Chart</h2>
        <ResizableBox
          className="examples__box"
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <Timeseries
            onBrush={_.noop}
            legendPosition="bottom"
            crosshair={true}
            tickFormatter={tickFormatter}
            series={lineChartSeries} />
        </ResizableBox>
        <h2>Timeseries Area Chart</h2>
        <ResizableBox
          className="examples__box"
          style={{ backgroundColor: '#333' }}
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <Timeseries
            onBrush={_.noop}
            legendPosition="left"
            crosshair={true}
            reversed={true}
            tickFormatter={tickFormatter}
            series={areaChartSeries} />
        </ResizableBox>
      </div>
    );
  }
});
