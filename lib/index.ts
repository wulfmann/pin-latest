#!/usr/bin/env node
import path from 'path';
import arg from 'arg';
import checkForUpdate from 'update-check';
import packageJson from '../package.json';
import PinLatest from './pin-latest';

const args = arg({
    '--help': Boolean,
    '--version': Boolean,
    '--debug': Boolean,
    '--exact': Boolean,
    '--write': Boolean,
    '-e': '--exact',
    '-w': '--write',
    '-v': '--version',
    '-h': '--help',
    '-d': '--debug',
});

// Version
if (args['--version']) {
    console.log(`pin-latest v${packageJson.version}`);
    process.exit(0);
}

// Help
if (args['--help']) {
    console.log(`
      Usage
        $ pin-latest <project-directory>
      Options
        --exact, -t     Set the exact version
        --write, -w     Write changes
        --version, -v   Version number
        --help, -h      Displays this message
        --debug, -d     Enable verbose logging
    `);
    process.exit(0);
}

const debug = args['--debug'] ? args['--debug'] : false;

const update = checkForUpdate(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
    try {
        const res = await update;
        if (res?.latest) {
            console.log('A new version of `pin-latest` is available!');
            console.log(
                'You can update by running: yarn global add pin-latest'
            );
        }
        process.exit();
    } catch {} // ignore error
}

async function run() {
    // handle project directory
    if (args._.length === 0) {
        console.error(`No project directory was specified`);
        process.exit(1);
    }

    const targetDirectory = path.resolve(args._[0]);

    const exact = args['--exact'] ? args['--exact'] : false;
    const write = args['--write'] ? args['--write'] : false;

    await PinLatest({
        targetDirectory,
        exact,
        debug,
        write
    });
}

run()
    .then(notifyUpdate)
    .catch(async (reason: any) => {
        console.log('Aborting installation.');
        console.log('Unexpected error');
        console.log(reason);
        await notifyUpdate();
        process.exit(1);
    });
