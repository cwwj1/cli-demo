'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkTag = undefined;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _request2 = require('request');

var _request3 = _interopRequireDefault(_request2);

var _utils = require('../helper/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var shell = _shelljs2.default; /*
                                * @Author: chenjie.lu
                                * @Date: 2020-01-13 13:57:49
                                * @Last Modified by: chenjie.lu
                                * @Last Modified time: 2020-02-25 09:40:27
                                * @Description: 基础库发布前检查
                                */

var execSync = _utils.execSync;
var request = _request3.default;

// 检查依赖是否安装
var checkRequiredDependence = function checkRequiredDependence() {
    var hadGit = shell.which('git');
    var hadNpm = shell.which('npm');
    if (!(hadGit && hadNpm)) {
        console.log(_chalk2.default.red('❌ 请安装git和npm'));
        shell.exit(1);
    }
    console.log(_chalk2.default.green('✅ 已安装git和npm'));
};

// 检查npm版本
var checkNpmVersion = function checkNpmVersion() {
    var result = execSync('npm -v') || '';
    if ((0, _utils.compare)(result, '6.4.1') <= 0) {
        console.log(_chalk2.default.red('❌ npm 版本必须大于 6.4.1'));
        shell.exit(1);
    }
    console.log(_chalk2.default.green('✅ npm 版本符合要求'));
};

// 获取cnpm中当前包最新的版本号
var getLastestVersionInCnpm = function getLastestVersionInCnpm(packageName) {
    return new Promise(function (resolve, reject) {
        request.get('http://npm.repos.beibei.com.cn/' + packageName, function (err, _response, body) {
            if (err) {
                reject(err);
                return;
            }
            try {
                body = JSON.parse(body);
            } catch (error) {
                console.error(_chalk2.default.red('http://npm.repos.beibei.com.cn/' + packageName + ' \u5305\u4E0D\u5B58\u5728'));
                shell.exit(1);
            }
            resolve(body && body['dist-tags'] && body['dist-tags'].latest);
        });
    });
};

// 检查版本号是否已经提升
var checkIsUpdatedVersion = async function checkIsUpdatedVersion(dir) {
    // eslint-disable-next-line global-require
    var packageJson = require(path.resolve(dir, './package.json'));
    var version = packageJson.version,
        name = packageJson.name;

    var cnpmVersion = await getLastestVersionInCnpm(name);
    var changelog = fs.readFileSync(path.resolve(dir, './CHANGELOG.md'), {
        encoding: 'utf8'
    });
    var isMatchChangelog = changelog.match(version);
    if (cnpmVersion && (0, _utils.compare)(cnpmVersion, version) >= 1) {
        console.log(_chalk2.default.red('\u274C \u8BF7\u66F4\u65B0\u57FA\u7840\u5E93\u7684\u7248\u672C\uFF0C\u7EBF\u4E0A\u7248\u672C\u4E3A' + cnpmVersion + '\uFF0C\u672C\u5730\u4E3A' + version));
        shell.exit(1);
    }
    if (!isMatchChangelog) {
        console.log(_chalk2.default.red('❌ CHANGELOG与package.json版本不匹配！'));
        shell.exit(1);
    }
    console.log(_chalk2.default.green('✅ 基础库版本号已升级'));
};

// 检查是否资源已经打包
var checkIsBuild = function checkIsBuild(dir) {
    var result = execSync('npm run build') || '';
    if (result.match('npm ERR')) {
        console.log(_chalk2.default.red('❌ BUILD 失败，请检查本地环境！'));
        console.log(result);
        shell.exit(1);
    }
    var isCommit = execSync('LANG=en_GB git -C ' + path.resolve(dir) + ' status') || '';
    if (isCommit.indexOf('nothing to commit') === -1 || isCommit.indexOf('use "git push" to publish your local commits') > -1) {
        console.log(_chalk2.default.red('❌ 您的本地分支还有未提交的改动，请先提交修改再发布模块'));
        shell.exit(1);
    }
    console.log(_chalk2.default.green('✅ 静态资源检测通过'));
};

// 是否在master分支进行发布操作
var isMaster = function isMaster(dir) {
    if ((execSync('git -C ' + path.resolve(dir) + ' symbolic-ref --short -q HEAD') || '').indexOf('master') === -1) {
        console.log(_chalk2.default.red('❌ 模块必须基于主干 master 进行发布！'));
        shell.exit(1);
    }
    console.log(_chalk2.default.green('✅ 模块基于master分支发布'));
};

var checkTag = function checkTag() {
    if (process.env && process.env.npm_lifecycle_script) {
        // 通过hook触发
        if (process.env.BF_CHECK !== 'pass') {
            console.log(_chalk2.default.red('❌ 请使用bf publish进行发布！'));
            shell.exit(1);
        }
    } else {
        console.log(_chalk2.default.green('✅ bf check通过，请使用bf publish发布'));
    }
};

var check = async function check() {
    var _commander$dir = _commander2.default.dir,
        dir = _commander$dir === undefined ? '' : _commander$dir;

    checkRequiredDependence();
    checkNpmVersion();
    await checkIsUpdatedVersion(dir);
    checkIsBuild(dir);
    isMaster(dir);
    checkTag();
};

exports.default = check;
exports.checkTag = checkTag;