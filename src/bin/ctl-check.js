import chalk from 'chalk';
import commander from 'commander';
import {getProject} from '../libs/helper/utils';
import libCheck from '../libs/check/libCheck';
// import nodeCommonCheck from '../libs/check/node-common';

commander
    .option('-d, --dir <path>', '需要检测的项目根目录')
    .option('-n, --ignore', '跳过检测')
    .option('-t, --type <projectType>', '强制指定检测类型，可选类型：lib-catalyst, lib-node, catalyst, airjs-common, console')
    .parse(process.argv);

const {
    ignore,
    type: _type,
} = commander;

const type = getProject(_type);
if (ignore) {
    console.log(chalk.keyword('orange')('⚠️  危险！！强制跳过检测！'));
}
switch (type) {
    case 'lib':
    case 'lib-common':
    case 'lib-catalyst':
    case 'lib-node':
        libCheck();
        break;
    case 'airjs-common':
        // nodeCommonCheck();
        break;
    default:
        console.log('找不到对应的执行命令，类型是否正确？');
}

