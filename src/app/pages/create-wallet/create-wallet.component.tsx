import { h, Component } from 'preact';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';

import { CreateWalletStep1 } from './components/step1/step1.component';
import { CreateWalletStep2 } from './components/step2/step2.component';
import { route } from 'preact-router';
import { CreatePassword } from '../../components/create-password/create-password.component';
import { Platform } from '../../types';
import { setWallet } from '../../mock/wallet';
import { createWallet } from '../../utils/wallet';
import { Blockchain } from 'moonlet-core/src/core/blockchain';

interface IProps {
    platform: Platform;
}

interface IState {
    words: string[];
    step: number;
}

export class CreateWalletPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        const wallet = createWallet();

        this.state = {
            words: wallet.mnemonics.split(' '),
            step: 1
        };
    }

    public render(props, state) {
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
                break;
        }

        return <div class="create-wallet-page">{content}</div>;
    }

    public onWalletCreated(password: string) {
        if (this.props.platform === Platform.EXTENSION) {
            setWallet({
                password
            });
        }

        route('/dashboard');
    }
}
