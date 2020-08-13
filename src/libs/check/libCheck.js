/*
 * @Author: chenjie.lu
 * @Date: 2020-01-13 13:57:49
 * @Last Modified by: chenjie.lu
 * @Last Modified time: 2020-02-25 09:40:27
 * @Description: 基础库发布前检查
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import _shell from 'shelljs';
import commander from 'commander';
import _request from 'request';
import {
    execSync as _execSync,
    compare,
} from '../helper/utils';

const shell = _shell;
const execSync = _execSync;
const request = _request;

// 检查依赖是否安装
const checkRequiredDependence = () => {
    const hadGit = shell.which('git');
    const hadNpm = shell.which('npm');
    if (!(hadGit && hadNpm)) {
        console.log(chalk.red('❌ 请安装git和npm'));
        shell.exit(1);
    }
    console.log(chalk.green('✅ 已安装git和npm'));
};

// 检查npm版本
const checkNpmVersion = () => {
    const result = execSync('npm -v') || '';
    if (compare(result, '6.4.1') <= 0) {
        console.log(chalk.red('❌ npm 版本必须大于 6.4.1'));
        shell.exit(1);
    }
    console.log(chalk.green('✅ npm 版本符合要求'));
};

// 获取cnpm中当前包最新的版本号
const getLastestVersionInCnpm = (packageName) => new Promise((resolve, reject) => {
    request.get(`http://npm.repos.beibei.com.cn/${packageName}`, (err, _response, body) => {
        if (err) {
            reject(err);
            return;
        }
        try {
            body = JSON.parse(body);
        } catch (error) {
            console.error(chalk.red(`http://npm.repos.beibei.com.cn/${packageName} 包不存在`));
            shell.exit(1);
        }
        resolve(body && body['dist-tags'] && body['dist-tags'].latest);
    });
});

// 检查版本号是否已经提升
const checkIsUpdatedVersion = async (dir) => {
    // eslint-disable-next-line global-require
    const packageJson = require(path.resolve(dir, './package.json'));
    const {
        version,
        name,
    } = packageJson;
    const cnpmVersion = await getLastestVersionInCnpm(name);
    const changelog = fs.readFileSync(path.resolve(dir, './CHANGELOG.md'), {
        encoding: 'utf8',
    });
    const isMatchChangelog = changelog.match(version);
    if (
        cnpmVersion && compare(cnpmVersion, version) >= 1
    ) {
        console.log(chalk.red(`❌ 请更新基础库的版本，线上版本为${cnpmVersion}，本地为${version}`));
        shell.exit(1);
    }
    if (!isMatchChangelog) {
        console.log(chalk.red('❌ CHANGELOG与package.json版本不匹配！'));
        shell.exit(1);
    }
    console.log(chalk.green('✅ 基础库版本号已升级'));
};

// 检查是否资源已经打包
const checkIsBuild = (dir) => {
    const result = execSync('npm run build') || '';
    if (result.match('npm ERR')) {
        console.log(chalk.red('❌ BUILD 失败，请检查本地环境！'));
        console.log(result);
        shell.exit(1);
    }
    const isCommit = execSync(`LANG=en_GB git -C ${path.resolve(dir)} status`) || '';
    if (isCommit.indexOf('nothing to commit') === -1 ||
        isCommit.indexOf('use "git push" to publish your local commits') > -1) {
        console.log(chalk.red('❌ 您的本地分支还有未提交的改动，请先提交修改再发布模块'));
        shell.exit(1);
    }
    console.log(chalk.green('✅ 静态资源检测通过'));
};

// 是否在master分支进行发布操作
const isMaster = (dir) => {
    if ((execSync(`git -C ${path.resolve(dir)} symbolic-ref --short -q HEAD`) || '').indexOf('master') === -1) {
        console.log(chalk.red('❌ 模块必须基于主干 master 进行发布！'));
        shell.exit(1);
    }
    console.log(chalk.green('✅ 模块基于master分支发布'));
};

const checkTag = () => {
    if (process.env && process.env.npm_lifecycle_script) {
        // 通过hook触发
        if (process.env.BF_CHECK !== 'pass') {
            console.log(chalk.red('❌ 请使用bf publish进行发布！'));
            shell.exit(1);
        }
    } else {
        console.log(chalk.green('✅ ctl check通过，请使用bf publish发布'));
    }
};

const check = async () => {
    const {dir = ''} = commander;
    checkRequiredDependence();
    checkNpmVersion();
    await checkIsUpdatedVersion(dir);
    checkIsBuild(dir);
    isMaster(dir);
    checkTag();
};

export default check;
export {checkTag};
