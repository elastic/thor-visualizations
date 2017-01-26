'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// bar sizes are measured in milliseconds so this assumes that the different
// between timestamps is in milliseconds. A normal bar size is 70% which gives
// enough spacing for the bar.
exports.default = function (series) {
  var multipier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.7;

  var first = _lodash2.default.first(series);
  try {
    return (first.data[1][0] - first.data[0][0]) * multipier;
  } catch (e) {
    return 1000; // 1000 ms
  }
};

module.exports = exports['default'];