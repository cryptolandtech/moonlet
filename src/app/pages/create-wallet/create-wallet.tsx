import { h, Component } from 'preact';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';

import { CreateWalletStep1 } from './components/step1/step1.component';
import { CreateWalletStep2 } from './components/step2/step2.component';
import { CreateWalletStep3 } from './components/step3/step3.component';
import { route } from 'preact-router';

interface IState {
    words: string[];
    step: number;
}

export class CreateWalletPage extends Component<{}, IState> {
    constructor() {
        super();
        this.state = {
            words: [
                'Word 1',
                'Word 2',
                'Word 3',
                'Word 4',
                'Word 5',
                'Word 6',
                'Word 7',
                'Word 8',
                'Word 9',
                'Word 10',
                'Word 11',
                'Word 12'
            ],
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
                    <CreateWalletStep3
                        onBack={() => this.setState({ step: 2 })}
                        onComplete={password => route('/dashboard')}
                    />
                );
                break;
        }

        return <div class="create-wallet-page">{content}</div>;
    }
}
