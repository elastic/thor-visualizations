import React from 'react';
import getLastValue from './get_last_value';
export default React.createClass({

  getDefaultProps() {
    return {
      tickFormatter: n => n,
      onClick: e => e
    };
  },

  renderLabels() {
    return item => {
      const key = `${item.id || item.label}-label`;
      return (
        <div key={key}
          onClick={e => this.props.onClick(e, item)}
          className="rhythm_top_n__label">
          { item.label }
        </div>
      );
    };
  },

  renderBars(maxValue) {
    return item => {
      const key = `${item.id || item.label}-bar`;
      const lastValue = getLastValue(item.data);
      const width = `${100 * (lastValue / maxValue)}%`;
      const backgroundColor = item.color;
      return (
        <div key={key} className="rhythm_top_n__bar">
          <div className="rhythm_top_n__inner-bar" style={{ width, backgroundColor }}></div>
        </div>
      );
    };
  },

  renderValues() {
    return item => {
      const key = `${item.id || item.label}-value`;
      const lastValue = getLastValue(item.data);
      const value = this.props.tickFormatter(lastValue);
      return (<div key={key} className="rhythm_top_n__value">{ value }</div>);
    };
  },

  renderRow(maxValue) {
    return item => {
      const key = `${item.id || item.label}`;
      const lastValue = getLastValue(item.data);
      const value = this.props.tickFormatter(lastValue);
      const width = `${100 * (lastValue / maxValue)}%`;
      const backgroundColor = item.color;
      return (
        <tr key={key}>
          <td width="1*" className="rhythm_top_n__label">{ item.label }</td>
          <td width="100%" className="rhythm_top_n__bar">
            <div className="rhythm_top_n__inner-bar"
              style={{ width, backgroundColor }}/>
          </td>
          <td width="1*" className="rhythm_top_n__value">{ value }</td>
        </tr>
      );
    };
  },

  render() {
    const maxValue = this.props.series.reduce((max, series) => {
      const lastValue = getLastValue(series.data);
      return lastValue > max ? lastValue : max;
    }, 0);

    const rows = this.props.series.map(this.renderRow(maxValue));
    let className = 'rhythm_top_n';
    if (this.props.reversed) {
      className += ' reversed';
    }

    return (
      <div className={className}>
        <table className="rhythm_top_n__table">
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
    );

    // const labels = this.props.series.map(this.renderLabels(maxValue));
    // const bars = this.props.series.map(this.renderBars(maxValue));
    // const values = this.props.series.map(this.renderValues(maxValue));
    // return (
    //   <div className="rhythm_top_n">
    //     <div className="rhythm_top_n__container">
    //       <div className="rhythm_top_n__labels">{ labels }</div>
    //       <div className="rhythm_top_n__bars">{ bars }</div>
    //       <div className="rhythm_top_n__values">{ values }</div>
    //     </div>
    //   </div>
    // );
  }

});
