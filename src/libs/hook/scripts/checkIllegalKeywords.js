import path from 'path';
import chalk from 'chalk';
import {execSync} from '../../helper/utils';

const checkBundleFile = (global) => {
    const keyword = 'hucdn.com'; // 需要检查的关键词
    let searchScope = path.resolve('./src');
    if (!global) {
        const GITDIFF = 'git diff HEAD --name-only --cached';
        const stdout = execSync(GITDIFF)
            .split('\n')
            .map((diffPath) => path.resolve(diffPath));
        console.log('关键词待检查的文件列表\n', stdout);
        searchScope = stdout.join(' ');
    }
    console.log(`grep -r -n '${keyword}' ${searchScope}`);
    const result = execSync(`grep -r -n '${keyword}' ${searchScope}`, {
        slience: true,
    });
    if (typeof result === 'string') {
        console.log(chalk.red('提交内容包含违法关键词：\n'));
        console.log(chalk.red(result));
        return false;
    }
    if (result && result.stderr) {
        console.log(result.stderr);
    }
    console.log(chalk.green(`提交内容不包含违法关键词：${keyword}\n`));
    return true;
};

export default checkBundleFile;
