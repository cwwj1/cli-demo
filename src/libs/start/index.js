/*
 * @Author: chenjie.lu
 * @Date: 2020-02-03 13:57:49
 * @Last Modified by: chenjie.lu
 * @Last Modified time: 2020-02-19 22:13:53
 * @Description: 启动对应工程
 */

import _commander from 'commander';
import {getProject as _getProject} from '../helper/utils';
import {checkEnv as _checkEnv} from '../check-env';
import _nodeCommonScript from './nodeCommon';
import _catalystScript from './catalyst';
import _consoleScript from './console';

const getProject = _getProject;
const commander = _commander;
const checkEnv = _checkEnv;
const nodeCommonScript = _nodeCommonScript;
const catalystScript = _catalystScript;
const consoleScript = _consoleScript;

const start = async () => {
    await checkEnv();
    let {type: project} = commander;
    if (!project) {
        project = getProject();
    }
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
