import { Component, h } from 'preact';

import './import-wallet.scss';
import { CreatePassword } from '../../components/create-password/create-password.component';
import { route } from 'preact-router';
import { ImportWalletStep1 } from './step1/step1.component';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Platform } from '../../types';
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

export class ImportWalletPage extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            words: [],
            step: 1
        };
    }

    public render() {
        let content;

        switch (this.state.step) {
            case 1:
                content = (
                    <ImportWalletStep1 onComplete={words => this.setState({ words, step: 2 })} />
                );
                break;
            case 2:
                content = (
                    <CreatePassword
                        onBack={() => this.setState({ step: 1 })}
                        onComplete={this.onWalletCreated.bind(this)}
                    />
                );
                if (this.props.platform === Platform.WEB) {
                    content = null;
                    this.onWalletCreated('');
                }
                break;
        }

        return <div class="import-wallet-page">{content}</div>;
    }

    public async onWalletCreated(password: string) {
        this.props.createWallet(appContext('walletProvider'), this.state.words.join(' '), password);
    }
}
