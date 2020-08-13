import {
    getProject as _getProject,
    // execSync,
} from '../helper/utils';
import _nodeCommonScript from './nodeCommon';
import _catalystScript from './catalyst';
import _consoleScript from './console';
import _checkKeywords from '../hook/scripts/checkIllegalKeywords';

const getProject = _getProject;
const nodeCommonScript = _nodeCommonScript;
const catalystScript = _catalystScript;
const consoleScript = _consoleScript;
const checkKeywords = _checkKeywords;

const start = () => {
    if (!checkKeywords(true)) {
        console.log(123);
        process.exit(1); // eslint-disable-line no-process-exit
    }
    const project = getProject();
    switch (project) {
        case 'airjs-common':
            return nodeCommonScript();
        case 'catalyst':
            return catalystScript();
        case 'console':
            return consoleScript();
        default:
            console.log('找不到对应的执行命令，您是否在基础库执行了start命令？');
            console.log('基础库请自行增加start命令');
            return false;
    }
};

export default start;
