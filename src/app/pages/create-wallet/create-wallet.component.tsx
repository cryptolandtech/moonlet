import { h, Component } from 'preact';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';

import { CreateWalletStep1 } from './components/step1/step1.component';
import { CreateWalletStep2 } from './components/step2/step2.component';
import { CreatePassword } from '../../components/create-password/create-password.component';
import { Platform } from '../../types';
import Wallet from 'moonlet-core/src/core/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IWalletProvider } from '../../iwallet-provider';
import { appContext } from '../../app-context';

interface IProps {
    platform: Platform;

    createWallet: (walletProvider: IWalletProvider, mnemonics: string, password: string) => any;
}

interface IState {
    words: string[];
    step: number;
}

export class CreateWalletPage extends Component<IProps, IState> {
    public wallet: Wallet;
    constructor(props: IProps) {
        super(props);
        this.wallet = new Wallet();

        this.state = {
            words: this.wallet.mnemonics.split(' '),
            step: 1
        };
    }

    public render() {
        let content;
        switch (this.state.step) {
            case 1:
                content = (
                    <CreateWalletStep1
                        words={this.state.words}
                        onComplete={() => this.setState({ step: 2 })}
                    />
                );
                break;
            case 2:
                content = (
                    <CreateWalletStep2
                        words={this.state.words}
                        onBack={() => this.setState({ step: 1 })}
                        onComplete={() => this.setState({ step: 3 })}
                    />
                );
                break;
            case 3:
                content = (
                    <CreatePassword
                        onBack={() => this.setState({ step: 2 })}
                        onComplete={this.onWalletCreated.bind(this)}
                    />
                );
                if (this.props.platform === Platform.WEB) {
                    content = null;
                    this.onWalletCreated('');
                }
                break;
        }

        return <div class="create-wallet-page">{content}</div>;
    }

    public onWalletCreated(password: string) {
        this.props.createWallet(appContext('walletProvider'), this.wallet.mnemonics, password);
    }
}
