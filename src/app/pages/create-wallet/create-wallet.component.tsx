import { h, Component } from 'preact';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';

import { CreateWalletStep1 } from './components/step1/step1.component';
import { CreateWalletStep2 } from './components/step2/step2.component';
import { CreatePassword } from '../../components/create-password/create-password.component';
import { Platform } from '../../types';

import { getWalletPlugin } from '../../app-context';
import { IWalletPlugin } from '../../../plugins/wallet/iwallet-plugin';
import { Loader } from '../../components/material-components/loader/loader.component';

interface IProps {
    platform: Platform;

    createWallet: (walletProvider: IWalletPlugin, mnemonics: string, password: string) => any;
}

interface IState {
    words: string[];
    step: number;
}

export class CreateWalletPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        getWalletPlugin()
            .generateMnemonics()
            .then(mnemonics => {
                this.setState({
                    words: mnemonics.split(' '),
                    step: 1
                });
            });

        this.state = {
            words: undefined,
            step: undefined
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
                        onComplete={() => {
                            if (this.props.platform === Platform.WEB) {
                                this.onWalletCreated('');
                            } else {
                                this.setState({ step: 3 });
                            }
                        }}
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
                }
                break;
            default:
                content = (
                    <div class="center-text">
                        <Loader width="40px" height="40px" />
                    </div>
                );
        }

        return <div class="create-wallet-page">{content}</div>;
    }

    public onWalletCreated(password: string) {
        this.props.createWallet(getWalletPlugin(), this.state.words.join(' '), password);
    }
}
