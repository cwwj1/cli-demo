'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startScript = function startScript() {
    // eslint-disable-next-line max-len
    // 对catalyst工程的过滤方法临时兼容
    var npmFilter = '';
    try {
        var npmConfig = JSON.parse(process.env.npm_config_argv || '{}');
        var argv = npmConfig.remain || [];
        if (argv.length > 0) {
            console.log('您正在使用bf cli，临时对老catalyst过滤的方式兼容处理，该兼容可能不准确，请使用-f参数来过滤页面，详见bf dev -h');
            npmFilter = argv[0];
        }
    } catch (error) {
        npmFilter = '';
    }

    var _commander$ctlBuildTy = _commander2.default.ctlBuildType,
        ctlBuildType = _commander$ctlBuildTy === undefined ? 'all' : _commander$ctlBuildTy,
        filter = _commander2.default.filter;

    var script = '';
    switch (ctlBuildType) {
        case 'all':
            script = 'npx rimraf /catalyst_tmp && ./node_modules/.bin/ctl';
            break;
        case 'weex':
            script = 'npx rimraf /catalyst_tmp && ./node_modules/.bin/ctl --dev_weex';
            break;
        case 'web':
            script = 'npx rimraf /catalyst_tmp && node ./node_modules/.bin/ctl --dev_web';
            break;
        case 'wxmp':
            script = 'npx rimraf /catalyst_tmp && BUILD_OLD_WXMP=true ./node_modules/.bin/ctl --dev_wxmp';
            break;
        case 'old_wxmp':
            script = 'npx rimraf /catalyst_tmp && ./node_modules/.bin/ctl --dev_old_wxmp';
            break;
        case 'new_wxmp':
            script = 'npx rimraf /catalyst_tmp && ./node_modules/.bin/ctl --dev_new_wxmp';
            break;
        default:
            console.log('找不到对应的类型，请确认输入的ctl-build-type是否正确？');
    }
    if ((filter || npmFilter) && script) {
        script += ' "' + (filter || npmFilter) + '"';
    }
    script && (0, _utils.execSync)('npx rimraf /catalyst_tmp && ' + script, {
        stdio: 'inherit',
        encoding: 'utf8'
    });
};

exports.default = startScript;
module.exports = exports.default;