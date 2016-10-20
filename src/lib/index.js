import getLastValue from './get_last_value';
import flot from './flot';
import events from './events';
import filterPartialBuckets from './filter_partial_buckets';
import calculateAuto from './calculate_auto';

import Timeseries from './timeseries';
import Metric from './metric';
import Gauge from './gauge';
import CircleGauge from './circle_gauge';
import TopN from './top_n';

export default {
  // visualizations
  TopN,
  Timeseries,
  Gauge,
  CircleGauge,
  Metric,
  // utilities
  getLastValue,
  flot,
  events,
  filterPartialBuckets,
  calculateAuto,
};
