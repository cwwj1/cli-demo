'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander2 = require('commander');

var _commander3 = _interopRequireDefault(_commander2);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commander = _commander3.default;
var execSync = _utils.execSync;

var build = function build() {
    var filter = commander.filter;

    var script = 'npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./node_modules/@fe-tool/webpack-config/src/webpack.libs.conf.js';
    if (filter) {
        script += ' -f "' + filter + '"';
    }
    return execSync(script, {
        stdio: 'inherit',
        encoding: 'utf8'
    }, true);
};

exports.default = build;
module.exports = exports.default;