import commander from 'commander';
import chalk from 'chalk';
import shell from 'shelljs';
import {checkTag} from '../../check/libCheck';
import {getProject} from '../../helper/utils';

const hook = async () => {
    // npm 5- 特殊行为 npm install会触发prepublish hook
    const npmConfigArgv = JSON.parse((process && process.env && process.env.npm_config_argv) || '{}');
    const argv = (npmConfigArgv && npmConfigArgv.original) || [];
    if (argv.includes('install')) {
        return;
    }
    let isSuccess = true;
    const {type} = commander;
    const project = getProject(type);
    switch (project) {
        case 'airjs-common':
        case 'catalyst':
        case 'console':
            break;
        case 'lib-node':
        case 'lib-catalyst':
        case 'lib-common':
            await checkTag();
            break;
        default:
            console.log('找不到对应的执行命令，请确认您的工程类型是否正确？');
    }
    if (!isSuccess) {
        console.log(chalk.red('pre commit Error!'));
        shell.exit(1);
    }
};

export default hook;
