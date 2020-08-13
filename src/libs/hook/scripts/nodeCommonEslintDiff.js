/* eslint-disable no-process-exit */
import fs from 'fs';
import path from 'path';
// import {CLIEngine} from 'eslint';
import getEslint from './getEslint';
import {execSync} from '../../helper/utils';

const eslintDiff = () => {
    const CLIEngine = getEslint();
    const cli = new CLIEngine({
        extensions: ['.js', '.vue'],
    });

    const stdout = execSync('git diff --name-only --cached --diff-filter=ACM');

    if (!stdout) {
        return true;
    }
    let isSuccess = true;
    const diffFileArray = stdout.split('\n').filter((diffFile) => (
        /^(?!assets2).+(\.js|\.vue)(\n|$)/gi.test(diffFile)
    ));
    if (diffFileArray.length > 0) {
        console.log('eslint 待检查的文件列表');
        console.log(diffFileArray);
        const report = cli.executeOnFiles(diffFileArray);
        const errorReport = CLIEngine.getErrorResults(report.results);
        if (errorReport.length) {
            isSuccess = false;
            console.log(cli.getFormatter('codeframe')(errorReport));
            try {
                fs.writeFileSync(
                    path.resolve(__dirname, '../eslint-result.html'),
                    cli.getFormatter('html')(report.results.filter((item) => item.messages.length)));
            } catch (e) { }
        }
    }
    if (isSuccess) {
        console.log('\x1b[32m', 'ESLint passed');
    }
    return isSuccess;
};

export default eslintDiff;
