import {execSync as _execSync} from '../helper/utils';

const execSync = _execSync;

const build = () => { // eslint-disable-line
    return execSync('./node_modules/.bin/webpack --config ./bin/build-hms/webpack.hms.conf.js --env production  --progress', {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
};

export default build;
