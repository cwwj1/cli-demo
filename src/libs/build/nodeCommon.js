import _commander from 'commander';
import {execSync as _execSync} from '../helper/utils';

const commander = _commander;
const execSync = _execSync;

const startScript = () => {
    const {filter} = commander;
    let script = 'npx cross-env NODE_ENV=production node ./node_modules/@fe-tool/webpack-config/src/deploy.js --config ./node_modules/@fe-tool/webpack-config/src/webpack.prod.conf.js';
    if (filter) {
        script = `npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./node_modules/@fe-tool/webpack-config/src/webpack.prod.conf.js -f "${filter}"`;
    }
    return execSync(`node ./node_modules/@fe-tool/webpack-config/src/clean-file && ${script}`, {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
};

export default startScript;
