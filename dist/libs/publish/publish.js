'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _utils = require('../helper/utils');

var _libCheck = require('../check/libCheck');

var _libCheck2 = _interopRequireDefault(_libCheck);

var _postpublish = require('./postpublish');

var _postpublish2 = _interopRequireDefault(_postpublish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execSync = _utils.execSync;
var check = _libCheck2.default;
var postPublish = _postpublish2.default;

var publish = async function publish() {
    process.env.BF_CHECK = 'pass';
    await check();
    console.log(_chalk2.default.green('1) bf check success'));
    var _commander$args = _commander2.default.args,
        args = _commander$args === undefined ? [] : _commander$args;

    var dir = args[0] || '';
    if (!execSync('npm publish ' + dir + ' --registry="http://npm.repos.beibei.com.cn"')) {
        _shelljs2.default.exit(1);
    }
    console.log(_chalk2.default.green('2) npm publish success'));
    postPublish(dir);
    console.log(_chalk2.default.green('3) git tag success'));
    return true;
};

exports.default = publish;
module.exports = exports.default;