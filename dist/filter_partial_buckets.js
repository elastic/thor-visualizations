'use strict';

exports.__esModule = true;
exports.default = filterPartialBuckets;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* calling .subtract or .add on a moment object mutates the object
 * so this function shortcuts creating a fresh object */
function getTime(bucket) {
  return _moment2.default.utc(bucket[0]);
}

/* find the milliseconds of difference between 2 moment objects */
function getDelta(t1, t2) {
  return _moment2.default.duration(t1 - t2).asMilliseconds();
}

function filterPartialBuckets(min, max, bucketSize) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return function (bucket) {
    var bucketTime = getTime(bucket);

    // timestamp is too late to be complete
    if (getDelta(max, bucketTime.add(bucketSize, 'seconds')) < bucketSize * 1000) {
      return false;
    }

    /* Table listing metrics don't need to filter the beginning of data for
     * partial buckets. They just boil down the data into max/min/last/slope
     * numbers instead of graphing it. So table listing data buckets pass
    * ignoreEarly */
    if (options.ignoreEarly !== true) {
      // timestamp is too early to be complete
      if (getDelta(bucketTime.subtract(bucketSize, 'seconds'), min) < 0) {
        return false;
      }
    }

    return true;
  };
};
module.exports = exports['default'];