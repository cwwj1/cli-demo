import {execSync} from '../../helper/utils';

const checkBundleFile = () => {
    const result = execSync('git diff --name-only --cached') || '';
    if (result.match(/assets2\/(static|webpack-assets)/)) {
        console.log('请不要提交打包后的文件');
        return false;
    }
    console.log('checkbundle 通过！');
    return true;
};

export default checkBundleFile;
