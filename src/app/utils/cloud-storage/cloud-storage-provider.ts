import { IAuth } from '../authentication/auth-interface';

export interface ICreateFileOptions {
    name: string;
    parentId?: string;
    contentType?: string;
    data: any;
}

export enum CloudFileType {
    FILE = 'FILE',
    FOLDER = 'FOLDER'
}

export interface IUpdateFileOptions {
    name?: string;
    parentId?: string;
    data?: any;
    contentType?: string;
}

export interface ICreateFolderOptions {
    name: string;
    parentId?: string;
}

export interface IUpdateFolderOptions {
    name?: string;
    parentId?: string;
}

export abstract class CloudStorageProvider<AuthProvider = IAuth, IOptions = {}> {
    public authProvider: AuthProvider;

    protected options: IOptions;

    constructor(authProvider: AuthProvider, options?: IOptions) {
        this.options = options;
        this.authProvider = authProvider;
    }

    public abstract async isConnected(): Promise<boolean>;
    public abstract async connect(forceUserPrompt: boolean): Promise<string>;

    public abstract async getFilesList(parent?: string): Promise<any>;

    public abstract async createFile(options: ICreateFileOptions): Promise<any>;
    public abstract async createFolder(options: ICreateFolderOptions): Promise<any>;
    public abstract async readFile(fileId: string, onlyInfo: boolean): Promise<any>;
    public abstract async updateFile(fileId: string, options: IUpdateFileOptions): Promise<any>;
    public abstract async updateFolder(fileId: string, options: IUpdateFolderOptions): Promise<any>;
    public abstract async deleteFile(fileId: string): Promise<void>;
}
