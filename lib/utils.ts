import { promises as fs, constants } from 'fs';

export const fileExists = async (path: string) => {
    try {
        await fs.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export const dirExists = async (path: string) => {
    try {
        const stats = await fs.stat(path);
        return { stats };
    } catch (e) {
        if (e !== 'ENOENT') { throw e; }
        return {
            stats: null
        }
    }
}
