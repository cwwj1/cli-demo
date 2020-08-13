/* eslint-disable no-process-exit */
/* eslint-disable no-console */
// import commander from 'commander';
import inquirer from 'inquirer';
import { initCatalystBeidianDemo } from './catalyst-bedian-demo';
import { initCatalystBeicangDemo } from './catalyst-beicang-demo';
import chalk from 'chalk';
import { execSync } from '../helper/utils';
import * as path from 'path';
// import request from 'request';

// program: commander.CommanderStatic

const cwd = process.cwd();

export const init = async function () {
    const promptList = [{
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
        validate: iuput => {
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
        validate: iuput => {
            if (iuput.length > 0) {
                return true;
            }
            console.log(chalk.red('\n必须填写工程名字'));
            return false;
        }
    }];

    const answer = await inquirer.prompt(promptList);
    console.log('--------------answer--------------', answer);

    // MARK: init

    console.log(`🚚 [1/3]开始初始化基础库模板...`);

    if (answer.platform === '贝店') {
        initCatalystBeidianDemo(answer);
    } else if (answer.platform === '贝仓') {
        initCatalystBeicangDemo(answer);
    }
    console.log(chalk.green(`✅ 模板文件初始化完成`));

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
    console.log(chalk.green(`
    ____       _ __         _    _________ 
   / __ )___  (_) /_  ___  (_)  / ____/ (_)
  / __  / _ \\/ / __ \\/ _ \\/ /  / /   / / / 
 / /_/ /  __/ / /_/ /  __/ /  / /___/ / /  
/_____/\\___/_/_.___/\\___/_/   \\____/_/_/   
                                           `));
    console.log('\n\n\n');
};