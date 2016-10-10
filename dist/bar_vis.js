"use strict";

exports.__esModule = true;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  var bars = props.values.map(function (val) {
    var width = val.value < 1 ? val.value * 100 : 100;
    var style = {
      backgroundColor: val.color,
      width: width + "%"
    };
    return _react2.default.createElement("div", { key: val.color, className: "bar", style: style });
  });
  return _react2.default.createElement(
    "div",
    { className: "bar-vis" },
    bars
  );
};

module.exports = exports['default'];