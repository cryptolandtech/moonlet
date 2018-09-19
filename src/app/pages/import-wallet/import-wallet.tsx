import { Component, h } from 'preact';

import './import-wallet.scss';
import { CreatePassword } from '../../components/create-password/create-password.component';
import { route } from 'preact-router';
import { ImportWalletStep1 } from './step1/step1.component';

interface IState {
    words: string[];
    step: number;
}

export class ImportWalletPage extends Component<{}, IState> {
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
                        onComplete={password => route('/dashboard')}
                    />
                );
                break;
        }

        return <div class="import-wallet-page">{content}</div>;
    }
}
