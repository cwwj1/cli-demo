import commander from 'commander';
import chalk from 'chalk';
import shell from 'shelljs';
import {execSync as _execSync} from '../helper/utils';
import _check from '../check/libCheck';
import _postPublish from './postpublish';

const execSync = _execSync;
const check = _check;
const postPublish = _postPublish;

const publish = async () => {
    process.env.BF_CHECK = 'pass';
    await check();
    console.log(chalk.green('1) ctl check success'));
    const {args = []} = commander;
    const dir = args[0] || '';
    if (!execSync(`npm publish ${dir} --registry="http://npm.repos.beibei.com.cn"`)) {
        shell.exit(1);
    }
    console.log(chalk.green('2) npm publish success'));
    postPublish(dir);
    console.log(chalk.green('3) git tag success'));
    return true;
};

export default publish;
