import { CloudStorageProvider, CloudFileType } from './cloud-storage/cloud-storage-provider';

export const getLastBackupDate = async (provider: CloudStorageProvider, walletHash) => {
    if (provider) {
        const rootFolder = await provider.getFilesList();
        const backupsFolderInfo = rootFolder.files.filter(
            file => file.name === 'backups' && file.type === CloudFileType.FOLDER
        )[0];
        if (!backupsFolderInfo) {
            return undefined;
        }
        const backupFolder = await provider.getFilesList(backupsFolderInfo.id);
        const walletFolderInfo = backupFolder.files.filter(
            file => file.name === walletHash && file.type === CloudFileType.FOLDER
        )[0];
        if (!walletFolderInfo) {
            return undefined;
        }
        const walletFolder = await provider.getFilesList(walletFolderInfo.id);
        const backupFile = walletFolder.files.filter(file => file.type === CloudFileType.FILE)[0];

        if (backupFile) {
            return new Date(backupFile.createdTime);
        } else {
            return undefined;
        }
    }

    return undefined;
};

export const ensureBackupFolderStructure = async (
    provider: CloudStorageProvider,
    walletHash: string
) => {
    const rootFolder = await provider.getFilesList();

    // search backups folder
    let backupsFolderInfo = rootFolder.files.filter(
        file => file.name === 'backups' && file.type === CloudFileType.FOLDER
    )[0];
    if (!backupsFolderInfo) {
        backupsFolderInfo = await provider.createFolder({ name: 'backups' });
    }

    const backupFolder = await provider.getFilesList(backupsFolderInfo.id);
    let walletFolderInfo = backupFolder.files.filter(
        file => file.name === walletHash && file.type === CloudFileType.FOLDER
    )[0];
    if (!walletFolderInfo) {
        walletFolderInfo = await provider.createFolder({
            name: walletHash,
            parentId: backupsFolderInfo.id
        });
    }

    return walletFolderInfo;
};

export const getBackupList = async (provider: CloudStorageProvider) => {
    if (provider) {
        const rootFolder = await provider.getFilesList();
        const backupsFolderInfo = rootFolder.files.filter(
            file => file.name === 'backups' && file.type === CloudFileType.FOLDER
        )[0];
        if (!backupsFolderInfo) {
            return [];
        }
        const backupFolder = await provider.getFilesList(backupsFolderInfo.id);
        backupFolder.files.map(file => {
            return {
                walletHash: file.name,
                id: file.id
            };
        });

        const responses = await Promise.all(
            backupFolder.map(backup => {
                return provider.getFilesList(backup.id);
            })
        );
    }

    return undefined;
};
