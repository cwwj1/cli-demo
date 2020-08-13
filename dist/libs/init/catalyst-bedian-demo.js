import * as path from 'path';
import { transform } from './transform';

export const initCatalystBeidianDemo = function (answer) {
    transform(answer, path.resolve(__dirname, './template/catalyst-beicang-demo/**/*'), path.resolve(__dirname, './template/catalyst-beicang-demo'));
};