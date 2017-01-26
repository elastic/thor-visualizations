import React, { PropTypes } from 'react';
import Gauge from './gauge';

function HalfGuage(props) {
  return (<Gauge type="half" {...props}/>);
}

HalfGuage.propTypes = {
  gaugeLine  : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  innerColor : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  innerLine  : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max        : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  metric     : PropTypes.object,
  reversed   : PropTypes.bool,
  type       : PropTypes.oneOf(['half', 'circle']),
  valueColor : PropTypes.string,
};

export default HalfGuage;

