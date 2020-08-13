import commander from 'commander';
import {checkEnv} from '../libs/check-env';

commander
    .parse(process.argv);

checkEnv();
