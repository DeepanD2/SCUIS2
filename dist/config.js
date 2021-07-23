"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var _default = {
  PORT: process.env.PORT || 8080,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'shhh',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'sb'
};
exports.default = _default;