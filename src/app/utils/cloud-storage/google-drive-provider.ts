import {
    CloudStorageProvider,
    ICreateFileOptions,
    ICreateFolderOptions,
    IUpdateFileOptions,
    IUpdateFolderOptions
} from './cloud-storage-provider';
import { GoogleAuth } from '../authentication/google-auth';

interface IRequestOptions {
    method: string;
    path: string;
    params?: {
        [name: string]: string | boolean;
    };
    headers?: {
        [name: string]: string;
    };
    body?: any;
}

const GOOGLE_API_BASE_URL = 'https://www.googleapis.com';
export class GoogleDriveProvider extends CloudStorageProvider {
    public authProvider = new GoogleAuth();

    constructor() {
        super();
    }

    public async getFilesList(parent?: string): Promise<any> {
        if (!parent) {
            parent = 'appDataFolder';
        }
        return this.request({
            method: 'GET',
            path: `/drive/v3/files`,
            params: {
                spaces: 'appDataFolder',
                q: `'${parent}' in parents`
            }
        });
    }

    public async createFile(options: ICreateFileOptions): Promise<any> {
        const body = new FormData();

        const contentType =
            options.contentType || (options.name.match(/.json$/gi) ? 'application/json' : '');
        const metadata = {
            name: options.name,
            mimeType: contentType,
            parents: [options.parentId || 'appDataFolder']
        };

        body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

        if (options.data) {
            const fileContent =
                contentType === 'application/json' ? JSON.stringify(options.data) : options.data;
            const file = new Blob([fileContent], { type: contentType });
            body.append('file', file);
        }

        return this.request({
            method: 'POST',
            path: '/upload/drive/v3/files',
            params: {
                uploadType: 'multipart',
                convert: false
            },
            body
        });
    }

    public async updateFile(fileId: string, options: IUpdateFileOptions): Promise<any> {
        const body = new FormData();
        const file = await this.readFile(fileId, true);
        const params: any = {};
        const metadata: any = {};

        if (options.parentId) {
            params.addParents = options.parentId;
            params.removeParents = file.parents.join(',');
        }

        let name = file.name;
        if (options.name) {
            metadata.name = options.name;
            name = options.name;
        }

        if (options.data) {
            metadata.mimeType =
                options.contentType || (name.match(/.json$/gi) ? 'application/json' : '');
        }

        body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

        if (options.data) {
            const fileContent =
                metadata.mimeType === 'application/json'
                    ? JSON.stringify(options.data)
                    : options.data;
            body.append('file', new Blob([fileContent], { type: metadata.mimeType }));
        }

        return this.request({
            method: 'PATCH',
            path: `/upload/drive/v3/files/${fileId}`,
            params: {
                uploadType: 'multipart',
                convert: false
            },
            body
        });
    }

    public async createFolder(options: ICreateFolderOptions): Promise<any> {
        return this.createFile({
            ...options,
            contentType: 'application/vnd.google-apps.folder',
            data: undefined
        });
    }

    public async updateFolder(fileId: string, options: IUpdateFolderOptions): Promise<any> {
        return this.updateFile(fileId, options);
    }

    public async deleteFile(id: string): Promise<void> {
        return this.request({
            method: 'DELETE',
            path: `/drive/v3/files/${id}`
        });
    }

    public async readFile(id: string, onlyInfo?: boolean): Promise<any> {
        let params = {};

        if (onlyInfo) {
            params = {
                fields: 'id, kind, name, mimeType, parents'
            };
        } else {
            params = {
                alt: 'media'
            };
        }

        return this.request({
            method: 'GET',
            path: `/drive/v3/files/${id}`,
            params
        });
    }

    private async request(options: IRequestOptions): Promise<any> {
        try {
            const token = await this.authProvider.getAuthToken();

            const authHeader = { Authorization: 'Bearer ' + token };

            const fetchOptions: any = {
                method: options.method,
                headers: new Headers({ ...authHeader, ...(options.headers || {}) })
            };

            if (options.body) {
                fetchOptions.body = options.body;
            }

            const response = await fetch(this.getRequestUrl(options), fetchOptions);
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') === 0) {
                const data = await response.json();
                if (data && data.error) {
                    return Promise.reject(data.error.message);
                } else {
                    return Promise.resolve(data);
                }
            } else {
                return Promise.resolve(await response.text());
            }
        } catch (e) {
            return Promise.reject((e || {}).message || 'Generic Error');
        }
    }

    private getRequestUrl(options: IRequestOptions): string {
        const url = new URL(GOOGLE_API_BASE_URL);

        url.pathname = (url.pathname + options.path).replace('//', '/');

        if (options.params) {
            for (const key of Object.keys(options.params)) {
                url.searchParams.append(key, options.params[key] + '');
            }
        }
        return url.toString();
    }
}
