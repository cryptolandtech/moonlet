import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Card from 'preact-material-components/Card';
import { Button } from 'preact-material-components/Button';

import './backup.scss';
import { GoogleDriveProvider } from '../../../../utils/cloud-storage/google-drive-provider';
import { CloudStorageProvider } from '../../../../utils/cloud-storage/cloud-storage-provider';
import { Loader } from '../../../../components/material-components/loader/loader.component';
import { getLastBackupDate, ensureBackupFolderStructure } from '../../../../utils/backup';
import { translate } from '../../../../utils/translate';
import { Translate } from '../../../../components/translate/translate.component';
import TextField from 'preact-material-components/TextField';
import { bind } from 'bind-decorator';
import { getWalletPlugin } from '../../../../app-context';
import Icon from 'preact-material-components/Icon';
import sha3 from 'crypto-js/sha3';

interface IState {
    screen: Screen;

    providers: {
        [providerId: string]: IProviderState;
    };
    selectedProvider: string;

    tasks: {
        encrypt: TaskStatus;
        checkStructure: TaskStatus;
        upload: TaskStatus;
        verify: TaskStatus;
        done: TaskStatus;
    };

    passwordInput: string;
    passwordInputError: string;
}

enum TaskStatus {
    DONE = 'DONE',
    IN_QUEUE = 'IN_QUEUE',
    IN_PROGRESS = 'IN_PROGRESS'
}

enum Screen {
    PROVIDERS_LIST = 'PROVIDERS_LIST',
    PASSWORD_CONFIRM = 'PASSWORD_CONFIRM',
    CREATE_BACKUP = 'CREATE_BACKUP'
}

interface IProviderState {
    lastBackup: Date;
    connected: boolean;
    inProgress: boolean;
}

interface IProvider {
    id: string;
    icon: string;
    instance: CloudStorageProvider;
}

export class BackupPage extends Component<{}, IState> {
    private providers: IProvider[] = [
        {
            id: 'googleDrive',
            icon: '/assets/icons/cloud/google-drive.svg',
            instance: new GoogleDriveProvider()
        },
        {
            id: 'dropbox',
            icon: '/assets/icons/cloud/dropbox.svg',
            instance: undefined
        },
        {
            id: 'oneDrive',
            icon: '/assets/icons/cloud/one-drive.svg',
            instance: undefined
        }
    ];

    constructor(props) {
        super(props);

        // initialize providers
        const providersState: any = {};
        this.providers.map(provider => {
            providersState[provider.id] = {
                lastBackup: undefined,
                connected: false,
                inProgress: true
            };
        });

        this.state = {
            providers: providersState,
            selectedProvider: undefined,
            passwordInput: '',
            passwordInputError: '',
            screen: Screen.PROVIDERS_LIST,
            tasks: {
                encrypt: TaskStatus.IN_QUEUE,
                checkStructure: TaskStatus.IN_QUEUE,
                upload: TaskStatus.IN_QUEUE,
                verify: TaskStatus.IN_QUEUE,
                done: TaskStatus.IN_QUEUE
            }
        };

        // update providers
        this.providers.map(provider => this.updateProvider(provider));
    }

    public async updateProvider(provider: IProvider) {
        const connected = !!provider.instance && (await provider.instance.isConnected());
        let lastBackup;
        if (connected) {
            lastBackup = await getLastBackupDate(
                provider.instance,
                sha3((await getWalletPlugin().getWallet()).mnemonics).toString()
            );
        }
        this.setState({
            providers: {
                ...this.state.providers,
                [provider.id]: {
                    inProgress: false,
                    lastBackup,
                    connected
                }
            }
        });
    }

    public async doBackup() {
        const provider = this.providers.filter(p => p.id === this.state.selectedProvider)[0]
            .instance;
        this.setState({ tasks: { ...this.state.tasks, encrypt: TaskStatus.IN_PROGRESS } });
        const walletProvider = getWalletPlugin();
        const encryptedWallet = await walletProvider.getEncryptedWallet();
        const walletSha3 = sha3((await walletProvider.getWallet()).mnemonics) + '';
        this.setState({
            tasks: {
                ...this.state.tasks,
                encrypt: TaskStatus.DONE,
                checkStructure: TaskStatus.IN_PROGRESS
            }
        });

        const backupFolderInfo = await ensureBackupFolderStructure(provider, walletSha3);
        this.setState({
            tasks: {
                ...this.state.tasks,
                checkStructure: TaskStatus.DONE,
                upload: TaskStatus.IN_PROGRESS
            }
        });

        const backupDate = Date.now();
        const backupFile = await provider.createFile({
            name: `backup_${backupDate}.json`,
            parentId: backupFolderInfo.id,
            data: {
                encryptedWallet
            }
        });
        this.setState({
            tasks: { ...this.state.tasks, upload: TaskStatus.DONE, verify: TaskStatus.IN_PROGRESS }
        });

        const cloudBackupFileInfo = await provider.readFile(backupFile.id, true);
        const cloudBackupData = await provider.readFile(backupFile.id, false);
        if ((cloudBackupData || {}).encryptedWallet === encryptedWallet) {
            this.setState({
                providers: {
                    ...this.state.providers,
                    [this.state.selectedProvider]: {
                        ...this.state.providers[this.state.selectedProvider],
                        lastBackup: new Date(cloudBackupFileInfo.createdTime)
                    }
                },
                tasks: { ...this.state.tasks, done: TaskStatus.DONE, verify: TaskStatus.DONE }
            });
            setTimeout(() => this.goTo(Screen.PROVIDERS_LIST), 2000);
        } else {
            // show error
        }
    }

    public goTo<K extends keyof IState>(nextScreen: Screen, nextState?: Pick<IState, K>) {
        let tasks = { ...this.state.tasks };
        if (nextScreen === Screen.CREATE_BACKUP) {
            tasks = {
                encrypt: TaskStatus.IN_QUEUE,
                checkStructure: TaskStatus.IN_QUEUE,
                upload: TaskStatus.IN_QUEUE,
                verify: TaskStatus.IN_QUEUE,
                done: TaskStatus.IN_QUEUE
            };
        }

        this.setState({
            ...nextState,
            screen: nextScreen,
            tasks,
            passwordInput: '',
            passwordInputError: undefined
        });

        if (nextScreen === Screen.CREATE_BACKUP) {
            this.doBackup();
        }
    }

    public async onConnectClick(provider: IProvider) {
        try {
            this.setState({
                providers: {
                    ...this.state.providers,
                    [provider.id]: {
                        ...this.state[provider.id],
                        inProgress: true
                    }
                }
            });
            await provider.instance.connect(true);
            this.setState({
                providers: {
                    ...this.state.providers,
                    [provider.id]: {
                        ...this.state[provider.id],
                        inProgress: false,
                        connected: true
                    }
                }
            });
        } catch (e) {
            this.setState({
                providers: {
                    ...this.state.providers,
                    [provider.id]: {
                        ...this.state[provider.id],
                        inProgress: false,
                        connected: false
                    }
                }
            });
        }
    }

    @bind
    public async checkPassword() {
        try {
            await getWalletPlugin().unlockWallet(this.state.passwordInput);
            this.goTo(Screen.CREATE_BACKUP);
        } catch (e) {
            this.setState({
                passwordInputError: translate('RevealPage.invalidPassword')
            });
        }
    }

    public renderCreateBackup() {
        return (
            <LayoutGrid.Cell cols={12}>
                {['encrypt', 'checkStructure', 'upload', 'verify', 'done'].map(task => (
                    <div class="backup-task">
                        <div class="icon">
                            {this.state.tasks[task] === TaskStatus.IN_QUEUE && (
                                <Icon>keyboard_arrow_right</Icon>
                            )}
                            {this.state.tasks[task] === TaskStatus.IN_PROGRESS && (
                                <Loader width="24px" height="24px" />
                            )}
                            {this.state.tasks[task] === TaskStatus.DONE && (
                                <Icon class="secondary-color">check</Icon>
                            )}
                        </div>
                        <div class="text">
                            <Translate text={`BackupPage.tasks.${task}`} />
                        </div>
                    </div>
                ))}
            </LayoutGrid.Cell>
        );
    }

    public renderPasswordConfirm() {
        return (
            <LayoutGrid.Cell cols={12}>
                <Translate text="BackupPage.confirmPassword" headline6 />
                <div class="password-input">
                    <TextField
                        outlined
                        label={translate('RevealPage.enterPassword')}
                        value={this.state.passwordInput}
                        type="password"
                        onKeyUp={e => {
                            this.setState({ passwordInput: (e.target as any).value });
                            if (e.code === 'Enter') {
                                this.checkPassword();
                            }
                        }}
                    />
                </div>
                {this.state.passwordInputError && (
                    <div class="error">{this.state.passwordInputError}</div>
                )}

                <div class="actions">
                    <Button ripple onClick={() => this.goTo(Screen.PROVIDERS_LIST)}>
                        <Translate text={`App.labels.cancel`} />
                    </Button>
                    <Button ripple secondary raised onClick={this.checkPassword}>
                        <Translate text={`App.labels.backup`} />
                    </Button>
                </div>
            </LayoutGrid.Cell>
        );
    }

    public renderProvider(provider: IProvider) {
        const state = this.state.providers[provider.id];
        const inactive = !provider.instance;
        return (
            <LayoutGrid.Cell cols={6}>
                <Card className="provider">
                    <div class="logo">
                        <img className={inactive ? 'inactive' : ''} src={provider.icon} />
                    </div>
                    {!state.inProgress && (
                        <div class="content">
                            <div class="last-backup">
                                {!inactive && [
                                    <Translate text="BackupPage.lastBackup" className="label" />,
                                    <br />,
                                    state.lastBackup
                                        ? state.lastBackup.toLocaleString()
                                        : translate('BackupPage.noBackup')
                                ]}
                                {inactive && (
                                    <Translate
                                        text="BackupPage.comingSoon"
                                        className="coming-soon"
                                    />
                                )}
                            </div>
                            <div class="action">
                                {state.connected && (
                                    <Button
                                        raised
                                        ripple
                                        secondary={!inactive}
                                        disabled={inactive}
                                        onClick={() =>
                                            this.goTo(Screen.PASSWORD_CONFIRM, {
                                                selectedProvider: provider.id
                                            })
                                        }
                                    >
                                        {translate('App.labels.backup')}
                                    </Button>
                                )}
                                {!state.connected && (
                                    <Button
                                        raised
                                        ripple
                                        secondary={!inactive}
                                        disabled={inactive}
                                        onClick={() => this.onConnectClick(provider)}
                                    >
                                        {translate('App.labels.connect')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {state.inProgress && <Loader width="36px" height="36px" className="loader" />}
                </Card>
            </LayoutGrid.Cell>
        );
    }

    public render() {
        let pageContent = null;

        switch (this.state.screen) {
            case Screen.PROVIDERS_LIST:
                pageContent = this.providers.map(provider => this.renderProvider(provider));
                break;
            case Screen.PASSWORD_CONFIRM:
                pageContent = this.renderPasswordConfirm();
                break;
            case Screen.CREATE_BACKUP:
                pageContent = this.renderCreateBackup();
        }

        return (
            <LayoutGrid className="backup-page">
                <LayoutGrid.Inner>{pageContent}</LayoutGrid.Inner>
            </LayoutGrid>
        );
    }
}
