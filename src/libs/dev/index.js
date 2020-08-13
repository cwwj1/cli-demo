import {getProject} from '../helper/utils';
import nodeCommonScript from './nodeCommon';
import catalystScript from './catalyst';
import consoleScript from './console';

const start = () => {
    const project = getProject();
    switch (project) {
        case 'airjs-common':
            nodeCommonScript();
            break;
        case 'catalyst':
            catalystScript();
            break;
        case 'console':
            consoleScript();
            break;
        default:
            console.log('找不到对应的执行命令，您是否在基础库执行了start命令？');
            console.log('基础库请自行增加start命令');
    }
};

export default start;
