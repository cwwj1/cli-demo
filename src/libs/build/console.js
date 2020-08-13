import {execSync} from '../helper/utils';

const startScript = () => {
    execSync('node ./bin/build/clean-file', {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
    execSync('npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./bin/build/webpack.prod.conf.js', {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
    // eslint-disable-next-line max-len
    execSync('npx cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./bin/build-libs/webpack.libs.conf.js', {
        stdio: 'inherit',
        encoding: 'utf8',
    }, true);
};

export default startScript;
