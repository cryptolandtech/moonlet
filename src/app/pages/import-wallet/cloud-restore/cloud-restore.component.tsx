import { h, Component } from 'preact';
import { GoogleDriveProvider } from '../../../utils/cloud-storage/google-drive-provider';
import { CloudFileType } from '../../../utils/cloud-storage/cloud-storage-provider';
import List from 'preact-material-components/List';
import { translate } from '../../../utils/translate';
import { Loader } from '../../../components/material-components/loader/loader.component';

import './cloud-restore.scss';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import { Translate } from '../../../components/translate/translate.component';
import bind from 'bind-decorator';
import { getWalletProvider } from '../../../app-context';
import { WalletErrorCodes } from '../../../iwallet-provider';
import { isCloudProviderConnected } from '../../../utils/backup';
import { route } from 'preact-router';

enum Screen {
    PASSWORD = 'PASSWORD',
    BACKUP_LIST = 'BACKUP_LIST'
}

interface IBackup {
    id: string;
    walletHash: string;
    name: string;
    date: Date;
    fileId: string;
    loading: boolean;
}

interface IState {
    loading: boolean;
    backups: IBackup[];

    selectedBackup: IBackup;

    screen: Screen;
    passwordInput: string;
    passwordInputError: string;
}

interface IProps {
    syncWallet: () => any;
}

export class ImportWalletCloudRestore extends Component<IProps, IState> {
    private provider: GoogleDriveProvider;

    constructor(props) {
        super(props);

        this.provider = new GoogleDriveProvider();

        this.state = {
            loading: true,
            backups: [],
            selectedBackup: undefined,
            screen: Screen.BACKUP_LIST,
            passwordInput: '',
            passwordInputError: undefined
        };
        this.fetchBackupList();
    }

    public async fetchBackupList() {
        const provider = this.provider;

        try {
            const connected = await isCloudProviderConnected(provider);
            if (!connected) {
                await provider.authProvider.renewAuthToken();
            }

            const rootFolder = await provider.getFilesList();
            const backupsFolderInfo = rootFolder.files.filter(
                file => file.name === 'backups' && file.type === CloudFileType.FOLDER
            )[0];
            if (!backupsFolderInfo) {
                this.setState({ backups: [], loading: false });
                return;
            }
            const backupFolder = await provider.getFilesList(backupsFolderInfo.id);
            const backups = backupFolder.files
                .filter(f => f.type === CloudFileType.FOLDER)
                .reverse()
                .map((file, index) => {
                    return {
                        id: file.id,
                        walletHash: file.name,
                        name: translate('ImportWalletPage.cloudRestore.walletName', {
                            index: index + 1,
                            hash: file.name.substr(-6)
                        }),
                        date: undefined,
                        fileId: undefined,
                        loading: true
                    };
                });
            this.setState({ backups, loading: false });

            for (const b of backups) {
                const backupList = await provider.getFilesList(b.id);
                const backup = backupList.files[0];

                b.loading = false;
                if (backup) {
                    b.date = new Date(backup.createdTime);
                    b.fileId = backup.id;
                }
                this.setState({ backups });
            }
        } catch {
            route('/import-wallet');
        }
    }

    @bind
    public async restoreWallet() {
        try {
            this.setState({ loading: true });
            const walletData = await this.provider.readFile(this.state.selectedBackup.fileId);
            await getWalletProvider().loadEncryptedWallet(
                walletData.encryptedWallet,
                this.state.passwordInput
            );
            document.location.reload();
        } catch (e) {
            switch (e.code) {
                case WalletErrorCodes.INVALID_PASSWORD:
                    this.setState({
                        loading: false,
                        passwordInputError: translate(
                            'ImportWalletPage.cloudRestore.invalidPassword'
                        )
                    });
                    break;
                default:
                    this.setState({
                        loading: false,
                        passwordInputError: translate('ImportWalletPage.cloudRestore.genericError')
                    });
                    break;
            }
        }
    }

    public renderPasswordScreen() {
        return (
            <div class="password-screen">
                <Translate
                    body1
                    text="ImportWalletPage.cloudRestore.restoreInfo"
                    params={{
                        name: this.state.selectedBackup.name,
                        date: this.state.selectedBackup.date.toLocaleString()
                    }}
                />
                <div class="password-input">
                    <TextField
                        outlined
                        label={translate('ImportWalletPage.cloudRestore.enterPassword')}
                        value={this.state.passwordInput}
                        type="password"
                        onKeyUp={e => {
                            this.setState({ passwordInput: (e.target as any).value });
                            if (e.code === 'Enter') {
                                this.restoreWallet();
                            }
                        }}
                    />
                </div>
                {this.state.passwordInputError && (
                    <div class="error">{this.state.passwordInputError}</div>
                )}
                <Button ripple secondary raised class="reveal-button" onClick={this.restoreWallet}>
                    <Translate text={`ImportWalletPage.step1.restoreWallet`} />
                </Button>
            </div>
        );
    }

    public renderBackupList() {
        return (
            <List two-line={true}>
                {this.state.backups.map(backup => {
                    return [
                        <List.Item
                            className="pointer"
                            onClick={() => {
                                if (!backup.loading) {
                                    this.setState({
                                        selectedBackup: backup,
                                        screen: Screen.PASSWORD
                                    });
                                }
                            }}
                        >
                            <List.TextContainer>
                                <List.PrimaryText>{backup.name}</List.PrimaryText>
                                <List.SecondaryText>
                                    {backup.date ? backup.date.toLocaleString() : ''}
                                </List.SecondaryText>
                            </List.TextContainer>
                            <List.ItemMeta>
                                {backup.loading && <Loader width="24px" height="24px" />}
                                {!backup.loading && 'keyboard_arrow_right'}
                            </List.ItemMeta>
                        </List.Item>,
                        <List.Divider />
                    ];
                })}
            </List>
        );
    }

    public render() {
        let content = null;
        if (!this.state.loading) {
            switch (this.state.screen) {
                case Screen.PASSWORD:
                    content = this.renderPasswordScreen();
                    break;
                case Screen.BACKUP_LIST:
                    content =
                        this.state.backups.length > 0 ? (
                            this.renderBackupList()
                        ) : (
                            <Translate
                                className="no-backups"
                                headline6
                                text="ImportWalletPage.cloudRestore.noBackups"
                            />
                        );
                    break;
            }
        }

        return (
            <div class="import-wallet-cloud-restore">
                {this.state.loading && (
                    <div class="center-text">
                        <Loader width="40px" height="40px" />
                    </div>
                )}
                {content}
            </div>
        );
    }
}
