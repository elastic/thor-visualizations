'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (series) {
  var divisor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var multipier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.7;

  var first = _lodash2.default.first(series);
  if (_lodash2.default.isPlainObject(first)) {
    try {
      return (first.data[1][0] - first.data[0][0]) / divisor * multipier;
    } catch (e) {
      return 1000;
    }
  } else {
    try {
      return (series[1][0] - series[0][0]) / divisor;
    } catch (e) {
      return 1000;
    }
  }
};

module.exports = exports['default'];