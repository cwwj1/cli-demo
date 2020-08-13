import {execSync} from '../helper/utils';
import path from 'path';

export default (dir = '') => {
    const dirPath = path.resolve(dir);
    const packageJSONPath = path.resolve('./package.json');
    // eslint-disable-next-line global-require
    const version = require(packageJSONPath).version;
    execSync(`git -C ${dirPath} tag v${version}`, true);
    execSync(`git -C ${dirPath} push origin v${version}`, true);
    console.log(`提交tag成功！版本号${version}`);
    return true;
};
