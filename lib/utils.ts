import { promises as fs, constants, Stats } from 'fs';

export const fileExists = async (path: string): Promise<boolean> => {
    try {
        await fs.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export const dirExists = async (path: string): Promise<{ stats: null|Stats }> => {
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
