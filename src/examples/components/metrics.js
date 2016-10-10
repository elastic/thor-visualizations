import React from 'react';
import { ResizableBox } from 'react-resizable';
import generateData from '../lib/generate_data';
import Metric from '../../lib/metric';
import Color from 'color';
import _ from 'lodash';
import numeral from 'numeral';
export default React.createClass({
  render() {
    const tickFormatter = n => numeral(n).format('0.0b');
    const metric = {
      formatter: n => `${numeral(n).format('0.0b')}/s`,
      label: 'Current Traffic',
      data: generateData()
    };

    const metricWithoutLabel = {
      formatter: n => `${numeral(n).format('0.0b')}/s`,
      data: generateData()
    };

    const secondary = {
      formatter: n => `${numeral(n).format('0.0b')}/s`,
      label: 'Peak',
      data: 120293993,
      color: '#d76051'
    };

    return (
      <div>
        <h2>Metric</h2>
        <ResizableBox
          className="examples__box"
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <Metric metric={metric} />
        </ResizableBox>
        <h2>Metric with Secondary</h2>
        <ResizableBox
          className="examples__box"
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <Metric metric={metric} secondary={secondary} />
        </ResizableBox>
        <h2>Metric Dark Background</h2>
        <ResizableBox
          className="examples__box"
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <Metric
            backgroundColor='#9980b2'
            reversed={true}
            fontSize={100} metric={metric}/>
        </ResizableBox>
      </div>
    );
  }
});
