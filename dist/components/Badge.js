"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Badge = props => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "badge ".concat(!props.value ? 'badge--none' : '', " "),
    style: {
      backgroundColor: "lightBlue",
      width: "30px",
      textAlign: "center",
      border: "1.5px solid black",
      borderRadius: "50%"
    }
  }, /*#__PURE__*/_react.default.createElement("h4", null, props.value || 0));
};
var _default = exports.default = Badge;