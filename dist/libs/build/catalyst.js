'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander2 = require('commander');

var _commander3 = _interopRequireDefault(_commander2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commander = _commander3.default;
var execSync = _utils.execSync;

var startScript = function startScript() {
    var filter = commander.filter;

    var fullPath = _path2.default.resolve('./package.json');
    // eslint-disable-next-line global-require
    var packageJson = require(fullPath);
    var dep = packageJson.dependencies || {};
    var devDep = packageJson.devDependencies || {};
    var originToolkitVersion = dep['@catalyst/catalyst-toolkit'] || devDep['@catalyst/catalyst-toolkit'];
    var numberIndex = originToolkitVersion.search(/\d/);
    var toolkitVersion = originToolkitVersion.slice(numberIndex);
    var rm = (0, _utils.compare)(toolkitVersion, '1.0.0') >= 0 ? '' : 'rimraf ./dist && ';
    // eslint-disable-next-line max-len
    var script = rm + 'BUILD_OLD_WXMP=true npx node ./bin/build-all.js';
    if (filter && script) {
        script += ' "' + filter + '"';
    }
    return execSync(script, {
        stdio: 'inherit',
        encoding: 'utf8'
    }, true);
};

exports.default = startScript;
module.exports = exports.default;