import React, { PropTypes } from 'react';
import Gauge from './gauge';

function CircleGauge(props) {
  return (<Gauge type="circle" {...props}/>);
}

CircleGauge.propTypes = {
  gaugeLine  : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  innerColor : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  innerLine  : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max        : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  metric     : PropTypes.object,
  reversed   : PropTypes.bool,
  type       : PropTypes.oneOf(['half', 'circle']),
  valueColor : PropTypes.string,
};

export default CircleGauge;
