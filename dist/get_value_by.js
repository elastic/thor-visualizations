'use strict';

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn, data) {
  if (_lodash2.default.isNumber(data)) return data;
  if (!Array.isArray(data)) return 0;
  var values = data.map(function (v) {
    return v[1];
  });
  return _lodash2.default[fn](values);
};

module.exports = exports['default'];