import commander from 'commander';
import chalk from 'chalk';
import shell from 'shelljs';
import nodeCommonEslintDiff from '../scripts/nodeCommonEslintDiff';
import catalystEslintDiff from '../scripts/catalystEslintDiff';
import consoleEslintDiff from '../scripts/consoleEslintDiff';
import checkBundleFile from '../scripts/checkBundleFile';
import checkIllegalKeywords from '../scripts/checkIllegalKeywords';
import imageCheck from '../scripts/imageCheck';
import {getProject} from '../../helper/utils';

const hook = () => {
    let isSuccess = true;
    const {type} = commander;
    const project = getProject(type);
    switch (project) {
        case 'airjs-common':
            isSuccess = checkBundleFile() && checkIllegalKeywords() && nodeCommonEslintDiff() && imageCheck();
            break;
        case 'catalyst':
            isSuccess = checkBundleFile() && checkIllegalKeywords() && catalystEslintDiff();
            break;
        case 'console':
            isSuccess = checkBundleFile() && checkIllegalKeywords() && consoleEslintDiff();
            break;
        case 'lib-node':
        case 'lib-catalyst':
        case 'lib-common':
            break;
        default:
            console.log('找不到对应的执行命令，请确认您的工程类型是否正确？');
    }
    if (!isSuccess) {
        console.log(chalk.red('\nPRE COMMIT ERROR!'));
        shell.exit(1);
    }
};

export default hook;
