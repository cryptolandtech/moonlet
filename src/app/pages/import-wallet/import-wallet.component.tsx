import { Component, h } from 'preact';

import './import-wallet.scss';
import { CreatePassword } from '../../components/create-password/create-password.component';
import { EnterMnemonic } from './enter-mnemonic/enter-mnemonic.component';
import { Platform } from '../../types';
import { getWalletPlugin } from '../../app-context';
import { ChooseImportType, ImportType } from './choose-import-type/choose-import-type.component';
import ImportWalletCloudRestore from './cloud-restore/cloud-restore.container';
import { IWalletPlugin } from '../../../plugins/wallet/iwallet-plugin';
import { feature, FEATURE_CLOUD_BACKUP } from '../../utils/feature';

interface IProps {
    platform: Platform;

    importType: ImportType;

    createWallet: (walletProvider: IWalletPlugin, mnemonics: string, password: string) => any;
}

interface IState {
    words: string[];
    previousScreen: Screen;
    screen: Screen;
}

enum Screen {
    CHOOSE_IMPORT_TYPE = 'CHOOSE_IMPORT_TYPE',
    CLOUD_RESTORE = 'CLOUD_RESTORE',
    ENTER_MNEMONIC = 'ENTER_MNEMONIC',
    CREATE_PASSWORD = 'CREATE_PASSWORD'
}

export class ImportWalletPage extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            words: [],
            previousScreen: undefined,
            screen: this.getInitialScreen()
        };
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.importType !== prevProps.importType) {
            this.setState({
                screen: this.getInitialScreen()
            });
        }
    }

    public getInitialScreen() {
        switch (this.props.importType) {
            case ImportType.MNEMONIC:
                return Screen.ENTER_MNEMONIC;
            case ImportType.GOOGLE_DRIVE:
                return Screen.CLOUD_RESTORE;
            default:
                return feature.isActive(FEATURE_CLOUD_BACKUP)
                    ? Screen.CHOOSE_IMPORT_TYPE
                    : Screen.ENTER_MNEMONIC;
        }
    }

    public goTo<K extends keyof IState>(nextScreen: Screen, nextState?: Pick<IState, K>) {
        this.setState({
            ...nextState,
            previousScreen: this.state.screen,
            screen: nextScreen
        });
    }

    public render() {
        let content;

        switch (this.state.screen) {
            case Screen.CHOOSE_IMPORT_TYPE:
                content = <ChooseImportType />;
                break;
            case Screen.ENTER_MNEMONIC:
                content = (
                    <EnterMnemonic
                        onComplete={words => {
                            if (this.props.platform === Platform.WEB) {
                                this.onWalletCreated('');
                            } else {
                                this.goTo(Screen.CREATE_PASSWORD, { words });
                            }
                        }}
                    />
                );
                break;
            case Screen.CREATE_PASSWORD:
                content = (
                    <CreatePassword
                        onBack={() => this.goTo(this.state.previousScreen)}
                        onComplete={this.onWalletCreated.bind(this)}
                    />
                );
                if (this.props.platform === Platform.WEB) {
                    content = null;
                }
                break;
            case Screen.CLOUD_RESTORE:
                content = <ImportWalletCloudRestore />;
                break;
        }

        return <div class="import-wallet-page">{content}</div>;
    }

    public onWalletCreated(password: string) {
        this.props.createWallet(getWalletPlugin(), this.state.words.join(' '), password);
    }
}
