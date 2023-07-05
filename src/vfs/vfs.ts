import {VFS} from "./content";

export function vfs_read(path: string): string {
    if (VFS.has(path)) {
        return atob(VFS.get(path));
    }

    throw `Path '${path}' dont exists`;
}