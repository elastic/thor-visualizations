import React from 'react';
import Timeseries from './timeseries';
import Metrics from './metrics';
import TopN from './top_n';
import Gauge from './gauge';
export default (props) => {
  return (
    <div className="examples">
      <h1>Thor Visualization :: Examples</h1>
      <div className="examples__visualizations">
        <Timeseries/>
        <Metrics/>
        <TopN/>
        <Gauge/>
      </div>
    </div>
  );
};
