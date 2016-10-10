import moment from 'moment';
export default () => {
  const data = [];
  const end = moment.utc();
  const start = end.clone().subtract(1, 'hour');
  while (start.valueOf() < end.valueOf()) {
    let y  = Math.round(Math.random() * (1000000 / 2));
    data.push([ start.valueOf(), y ]);
    start.add(1, 'minute');
    if (data.length > 100) break;
  }
  return data;

};
