import { join } from 'path';
import { dirExists, fileExists } from './utils';
import pj from 'package-json';
import { promises as fs } from 'fs';

export const PACKAGE_JSON = 'package.json';
export const LATEST = 'latest';

export interface PinLatestProps {
    targetDirectory: string;
    exact: boolean;
    debug: boolean;
    write: boolean;
}

const processDependencyBlock = async (key: string, packageJson: any, exact: boolean, debug: boolean) => {
    if (debug) {
        console.log(`Processing: ${key}`);
    }

    const currentDepBlock = packageJson[key];

    for (const packageName in currentDepBlock) {
        const currentPackage = currentDepBlock[packageName]

        if (currentPackage === LATEST) {
            if (debug) {
                console.log(`Pinning: ${key}/${packageName}`);
            }

            try {
                const { version } = await pj(packageName);
                const versionToWrite = exact ? version : `^${version}`;

                packageJson[key][packageName] = versionToWrite;
            } catch {
                console.error(`Failed to fetch package info for: ${packageName}`);
                continue;
            }
        }
    }

    return packageJson;    
}

const PinLatest = async ({ targetDirectory, exact, debug, write }: PinLatestProps) => {
    const { stats } = await dirExists(targetDirectory);

    if (!stats) {
        throw new Error(`${targetDirectory} does not exist`);
    }

    if (!(stats.isDirectory())) {
        throw new Error(`${targetDirectory} is not a directory`);
    }

    const packageJsonFile = join(targetDirectory, PACKAGE_JSON);

    if (!fileExists(packageJsonFile)) {
        throw new Error(`${packageJsonFile} does not exist`);
    }

    const packageJson = require(packageJsonFile);
    const original = packageJson;

    const dependencyKeys = ['dependencies', 'peerDependencies', 'devDependencies', 'bundledDependencies', 'optionalDependencies'];

    await Promise.all(
        dependencyKeys
            .filter(key => packageJson[key])
            .map(key => processDependencyBlock(key, packageJson, exact, debug))
    );

    const hasChanges = original === packageJson;
    
    if (!hasChanges) {
        console.log('No changes.');
        process.exit(0);
    }

    const formattedFile = JSON.stringify(packageJson, null, 2);

    if (!write) {
        console.log(formattedFile);
        return;
    }

    await fs.writeFile(packageJsonFile, formattedFile);

    console.log(`${packageJsonFile} updated.`);
    process.exit(0);
};

export default PinLatest;
