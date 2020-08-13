// 优先使用工程本身的eslint，以防出现不可预测的异常状况
import * as path from 'path';

const getEslint = () => {
    const cwd = process.cwd();
    const eslintPath = !path.relative(cwd, __dirname).startsWith('..') ?
        'eslint' :
        `${cwd}/node_modules/eslint`;
    console.log(`使用 ${eslintPath} 下的eslint`);
    const {CLIEngine} = require(eslintPath); // eslint-disable-line global-require
    return CLIEngine;
};

export default getEslint;
