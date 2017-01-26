'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (data) {
  var lookback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (_lodash2.default.isNumber(data)) return data;
  if (!Array.isArray(data)) return 0;
  // First try the last value
  var last = data[data.length - 1];
  var lastValue = Array.isArray(last) && last[1];
  if (lastValue) return lastValue;

  // If the last value is zero or null because of a partial bucket or
  // some kind of timeshift weirdness we will show the second to last.
  var lookbackCounter = 1;
  var value = void 0;
  while (lookback > lookbackCounter && !value) {
    var next = data[data.length - ++lookbackCounter];
    value = _lodash2.default.isArray(next) && next[1] || 0;
  }
  return value || 0;
};

module.exports = exports['default'];