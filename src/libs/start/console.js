import _commander from 'commander';
import path from 'path';
import {execSync as _execSync} from '../helper/utils';

const commander = _commander;
const execSync = _execSync;

const startScript = () => {
    // eslint-disable-next-line max-len
    const {platform} = commander;
    if (platform === 'win') {
        const fullPath = path.resolve('./package.json');
        const projectName = require(fullPath).name; // eslint-disable-line global-require
        // eslint-disable-next-line max-len
        return execSync(`sudo ./node_modules/.bin/airjs-deploy-win ${projectName} dev && rm -f /tmp/local_source.lock && ./node_modules/.bin/webpack-dev-server --config ./bin/build/webpack.dev.conf.js --port 8000 --watch-poll`, {
            stdio: 'inherit',
            encoding: 'utf8',
        });
    }
    // eslint-disable-next-line max-len
    return execSync('sudo ./node_modules/.bin/airjs-docker-up -d "-p 80:80 -p 8000:8000 -p 9229:9229" -w "[\'app\', \'bin\', \'config\', \'index.web.js\']"', {
        stdio: 'inherit',
        encoding: 'utf8',
    });
};

export default startScript;
