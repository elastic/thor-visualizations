import React from 'react';
import { ResizableBox } from 'react-resizable';
import TopN from '../../lib/top_n';
import numeral from 'numeral';
import generateData from '../lib/generate_data';
import getLastValue from '../../lib/get_last_value';
import _ from 'lodash';
export default React.createClass({
  render() {
    const barChartSeries = _.sortBy(_.times(20).map(n => {
      return {
        label: `Series ${_.repeat(n, n)}`,
        data: generateData(),
        color: 'rgba(0,0,0,0.4)'
      };
    }), item => getLastValue(item.data)).reverse();
    _.first(barChartSeries).color = '#e8488b';
    const tickFormatter = n => numeral(n).format('0.0b');
    return (
      <div>
        <h2>Top N</h2>
        <ResizableBox
          className="examples__box"
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <TopN
            tickFormatter={tickFormatter}
            series={barChartSeries} />
        </ResizableBox>
        <h2>Top N Reversed</h2>
        <ResizableBox
          className="examples__box"
          style={{backgroundColor: '#80c383'}}
          width={900}
          height={300}
          minConstraints={[200,150]}
          maxConstraints={[900,300]}>
          <TopN
            reversed={true}
            tickFormatter={tickFormatter}
            series={barChartSeries} />
        </ResizableBox>
      </div>
    );
  }
});
