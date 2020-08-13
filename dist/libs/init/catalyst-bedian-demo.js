'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.initCatalystBeidianDemo = undefined;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _transform = require('./transform');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initCatalystBeidianDemo = exports.initCatalystBeidianDemo = function initCatalystBeidianDemo(answer) {
    (0, _transform.transform)(answer, path.resolve(__dirname, './template/catalyst-beicang-demo/**/*'), path.resolve(__dirname, './template/catalyst-beicang-demo'));
};