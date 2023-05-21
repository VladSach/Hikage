export const LoaderUtils = {
    getFileFromEntry: async function (fileEntry) {
        return new Promise((resolve) => fileEntry.file(resolve));
    },

    parseDirectory: async function (directoryEntry, path, fileMap) {
        const reader = directoryEntry.createReader();
        const entries = await new Promise((resolve) => reader.readEntries(resolve));

        for (const entry of entries) {
            if (entry.isDirectory) {
                await LoaderUtils.parseDirectory(entry, `${path}/${entry.name}`, fileMap);
            } else {
                const file = await LoaderUtils.getFileFromEntry(entry);
                fileMap.set(`${path}/${entry.name}`, file);
            }
        }
    },

    getLoadedFiles: async function (filesToLoad) {
        const files = new Map();
        const { items } = filesToLoad;

        for (const item of items) {
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();

                if (entry.isDirectory) {
                    await LoaderUtils.parseDirectory(entry, '', files);
                } else {
                    files.set(item.name, item.getAsFile());
                }
            }
        }
        return files;
    },
};
