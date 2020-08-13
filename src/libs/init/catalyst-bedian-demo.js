import * as path from 'path';
import {transform} from './transform';

export const initCatalystBeidianDemo = function (answer) {
    console.log('initCatalystBeidianDemo');
    transform(answer, path.resolve(__dirname, './template/catalyst-beidian-demo/**/*'), path.resolve(__dirname, './template/catalyst-beidian-demo'));
};
