import commander from 'commander';
import publish from '../libs/publish/publish';
commander
    .usage('[<tarball>|<folder>]')
    .parse(process.argv);

publish();
