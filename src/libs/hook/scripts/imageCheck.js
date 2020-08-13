import {execSync} from '../../helper/utils';

const imageCheck = () => {
    const result = execSync('npx image-check --size=1024 --diff=HEAD');
    if (result && result.match(/校验通过/)) {
        return true;
    }
    return false;
};

export default imageCheck;
