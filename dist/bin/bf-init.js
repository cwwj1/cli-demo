import commander from 'commander';
import { init } from '../libs/init';

commander.parse(process.argv);

init();