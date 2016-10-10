'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (data) {
  if (_lodash2.default.isNumber(data)) return data;
  if (!Array.isArray(data)) return 0;
  // First try the last value
  var last = data[data.length - 1];
  var lastValue = Array.isArray(last) && last[1];
  if (lastValue) return lastValue;

  // If the last value is zero or null because of a partial bucket or
  // some kind of timeshift weirdness we will show the second to last.
  var secondToLast = data[data.length - 2];
  return _lodash2.default.isArray(secondToLast) && secondToLast[1] || 0;
};

module.exports = exports['default'];