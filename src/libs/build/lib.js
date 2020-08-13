import _commander from 'commander';
import {execSync as _execSync} from '../helper/utils';

const commander = _commander;
const execSync = _execSync;

const build = () => {
    const {filter} = commander;
    let script = 'npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./node_modules/@fe-tool/webpack-config/src/webpack.libs.conf.js';
    if (filter) {
        script += ` -f "${filter}"`;
    }
    return execSync(script, {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
};

export default build;
