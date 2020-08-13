'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _publish = require('../libs/publish/publish');

var _publish2 = _interopRequireDefault(_publish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.usage('[<tarball>|<folder>]').parse(process.argv);

(0, _publish2.default)();