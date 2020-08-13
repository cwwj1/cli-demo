import chalk from 'chalk';
import shell from 'shelljs';
import {execSync as _execSync} from 'child_process';
import fs from 'fs';
import path from 'path';

/* ------------------------------ execSync ------------------------------ */

/**
 *
 * @param evalCode 具体执行命令
 * @param execSyncOptions execSync额外参数
 * @description execSync函数二次分装
 */
export const execSync = (
    evalCode,
    execSyncOptions,
    forceExit
) => {
    if (typeof execSyncOptions === 'boolean') {
        forceExit = execSyncOptions;
        execSyncOptions = {
            stdio: 'inherit',
            encoding: 'utf8',
        };
    }
    try {
        const result = _execSync(evalCode, Object.assign({
            encoding: 'utf8',
        }, execSyncOptions));
        return (result || '').trim();
    } catch (error) {
        !(execSyncOptions && execSyncOptions.slience) && console.error(chalk.red(`${evalCode} execError: \n `), error.stderr || error.stdout || error);
        if (forceExit) {
            shell.exit(1);
        }
        return error;
    }
};

/* ------------------------------ compare ------------------------------ */

/**
 *
 * @param target 需要转换的数字或字符串
 * @returns 转换以后的数字数组
 * @description 将数字或以点隔开的数字字符串切割为数组，不可转换为数字的字符串转化为0
 */
const convertToArray = (target) => {
    if (typeof target === 'number') {
        return [target];
    }
    return target
        .split('.')
        .map((item) => {
            const numberItem = Number(item);
            return !Number.isNaN(numberItem) ? numberItem : 0;
        });
};

/**
 *
 * @param source 要比较的数字或字符串
 * @param target 被比较的数字或字符串
 * @returns 1: source 大于target -1: source 小于target 0: source等于target
 */
export const compare = (source, target) => {
    if (source === target) {
        return 0;
    }
    const arrayedSource = convertToArray(source);
    const arrayedTarget = convertToArray(target);
    for (const index in arrayedSource) {
        const _source = arrayedSource[index];
        const _target = arrayedTarget[index] || 0;
        if (_source > _target) {
            return 1;
        } else if (_source < _target) {
            return -1;
        }
    }
    if (arrayedSource.length < arrayedTarget.length) {
        return -1;
    }
    return 0;
};

/* ------------------------------ getProject ------------------------------ */
export const getProject = (type) => {
    if (['lib-common', 'lib-catalyst', 'lib-node', 'airjs-common', 'catalyst', 'console'].includes(type || '')) {
        return type || '';
    }
    const fullPath = path.resolve('./package.json');
    const isExist = fs.existsSync(fullPath);
    if (!isExist) {
        console.error(chalk.red(`❌ 当前文件：${fullPath}不存在！`));
        shell.exit(1);
    }
    const keywords = require(fullPath).keywords || []; // eslint-disable-line global-require
    if (keywords.includes('lib-catalyst')) {
        return 'lib-catalyst';
    } else if (keywords.includes('lib-node')) {
        return 'lib-node';
    } else if (keywords.includes('lib-common')) {
        return 'lib-common';
    } else if (keywords.includes('airjs-common')) {
        return 'airjs-common';
    } else if (keywords.includes('catalyst')) {
        return 'catalyst';
    } else if (keywords.includes('console')) {
        return 'console';
    }
    console.error(chalk.red(`❌ 当前keywords：${keywords}不符合规范！，请使用'lib-catalyst', 'lib-node', 'lib-common', 'airjs-common', 'catalyst', 'console'`));
    shell.exit(1);
    return '';
};
