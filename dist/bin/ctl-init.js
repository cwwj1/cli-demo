'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _init = require('../libs/init');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.parse(process.argv);

(0, _init.init)();