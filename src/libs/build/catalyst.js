import _commander from 'commander';
import path from 'path';
import {
    execSync as _execSync,
    compare,
} from '../helper/utils';

const commander = _commander;
const execSync = _execSync;

const startScript = () => {
    const {filter} = commander;
    const fullPath = path.resolve('./package.json');
    // eslint-disable-next-line global-require
    const packageJson = require(fullPath);
    const dep = packageJson.dependencies || {};
    const devDep = packageJson.devDependencies || {};
    const originToolkitVersion = dep['@catalyst/catalyst-toolkit'] || devDep['@catalyst/catalyst-toolkit'];
    const numberIndex = originToolkitVersion.search(/\d/);
    const toolkitVersion = originToolkitVersion.slice(numberIndex);
    const rm = compare(toolkitVersion, '1.0.0') >= 0 ? '' : 'rimraf ./dist && ';
    // eslint-disable-next-line max-len
    let script = `${rm}BUILD_OLD_WXMP=true npx node ./bin/build-all.js`;
    if (filter && script) {
        script += ` "${filter}"`;
    }
    return execSync(script, {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
};

export default startScript;
