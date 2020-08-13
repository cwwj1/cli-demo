'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('../helper/utils');

var startScript = function startScript() {
    (0, _utils.execSync)('node ./bin/build/clean-file', {
        stdio: 'inherit',
        encoding: 'utf8'
    }, true);
    (0, _utils.execSync)('npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./bin/build/webpack.prod.conf.js', {
        stdio: 'inherit',
        encoding: 'utf8'
    }, true);
    // eslint-disable-next-line max-len
    (0, _utils.execSync)('npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./bin/build-libs/webpack.libs.conf.js', {
        stdio: 'inherit',
        encoding: 'utf8'
    }, true);
};

exports.default = startScript;
module.exports = exports.default;