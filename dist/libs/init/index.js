'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = undefined;

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _catalystBedianDemo = require('./catalyst-bedian-demo');

var _catalystBeicangDemo = require('./catalyst-beicang-demo');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../helper/utils');

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import request from 'request';

// program: commander.CommanderStatic

/* eslint-disable no-process-exit */
/* eslint-disable no-console */
// import commander from 'commander';
var cwd = process.cwd();

var init = exports.init = async function init() {
    var promptList = [{
        type: 'list',
        name: 'libType',
        message: '请选择框架类型?',
        choices: ['catalyst（推荐）']
    }, {
        type: 'list',
        name: 'platform',
        message: '请选择所属业务（不同业务，不同模版）',
        choices: ['贝店', '贝仓', '贝贝', '其他（以贝仓为原型）']
    }, {
        type: 'list',
        name: 'function',
        message: '请选择要包含的基础功能',
        choices: ['1、登录注册+核心链路']
    }, {
        type: 'list',
        name: 'loginTpye',
        message: '请选择你希望的登录注册方案',
        choices: ['1、登录操作，统一跳转至【小程序登录页】', '2、其他...']
    }, {
        type: 'input',
        name: 'appid',
        message: '输入小程序appID（默认为空）',
        validate: function validate(iuput) {
            return true;
            // if (iuput.length > 0) {
            //     return true;
            // }
            // console.log(chalk.red('\n输入小程序appID'));
            // return false;
        }
    }, {
        type: 'input',
        name: 'projectName',
        message: '请输入工程名称',
        validate: function validate(iuput) {
            if (iuput.length > 0) {
                return true;
            }
            console.log(_chalk2.default.red('\n必须填写工程名字'));
            return false;
        }
    }];

    var answer = await _inquirer2.default.prompt(promptList);
    console.log('--------------answer--------------', answer);

    // MARK: init

    console.log('\uD83D\uDE9A [1/3]\u5F00\u59CB\u521D\u59CB\u5316\u57FA\u7840\u5E93\u6A21\u677F...');

    if (answer.platform === '贝店') {
        (0, _catalystBedianDemo.initCatalystBeidianDemo)(answer);
    } else if (answer.platform === '贝仓') {
        (0, _catalystBeicangDemo.initCatalystBeicangDemo)(answer);
    }
    console.log(_chalk2.default.green('\u2705 \u6A21\u677F\u6587\u4EF6\u521D\u59CB\u5316\u5B8C\u6210'));

    // console.log(`🔎 [2/3]开始安装生产依赖...`);
    // if (prods.length) {
    //     execSync(`npm install --registry=http://npm.repos.beibei.com.cn ${prods.join(' ')}`, {
    //         cwd: path.join(cwd, answer.projectName),
    //         stdio: 'inherit',
    //     }, true);
    // }
    // console.log(chalk.green(`✅ dependencies 依赖安装完成[ ${prods.slice(0, 3)}... 共${prods.length}个依赖... ]`));

    // console.log(`🔎 [3/3]开始安装开发依赖...`);
    // if (devs.length) {
    //     execSync(`npm install --registry=http://npm.repos.beibei.com.cn ${devs.join(' ')} -D`, {
    //         cwd: path.join(cwd, answer.projectName),
    //         stdio: 'inherit',
    //     }, true);
    // }
    // console.log(chalk.green(`✅ devDependencies 依赖安装完成[ ${devs.slice(0, 3)}... 共${devs.length}个依赖... ]`));

    // MARK: end
    console.log('\n\n\n');
    console.log(_chalk2.default.green('\n    ____       _ __         _    _________ \n   / __ )___  (_) /_  ___  (_)  / ____/ (_)\n  / __  / _ \\/ / __ \\/ _ \\/ /  / /   / / / \n / /_/ /  __/ / /_/ /  __/ /  / /___/ / /  \n/_____/\\___/_/_.___/\\___/_/   \\____/_/_/   \n                                           '));
    console.log('\n\n\n');
};