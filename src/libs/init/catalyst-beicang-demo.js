/* eslint-disable no-console */
import * as path from 'path';
import {transform} from './transform';

export const initCatalystBeicangDemo = function (answer) {
    transform(answer, path.join(__dirname, './template/catalyst-beicang-demo/**/*'), path.join(__dirname, './template/catalyst-beicang-demo'));
};
