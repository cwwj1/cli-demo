'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../helper/utils');

var execSync = _utils.execSync;

var build = function build() {
    // eslint-disable-line
    return execSync('./node_modules/.bin/webpack --config ./bin/build-hms/webpack.hms.conf.js --env production  --progress', {
        stdio: 'inherit',
        encoding: 'utf8'
    }, true);
};

exports.default = build;
module.exports = exports.default;