import { h, Component } from 'preact';

import './enter-mnemonic.scss';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import { Translate } from '../../../components/translate/translate.component';
import { TextField } from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import { getWalletPlugin } from '../../../app-context';

interface IProps {
    onComplete?: (words: string[]) => any;
}

interface IState {
    words: string[];
    error: boolean;
}

export class EnterMnemonic extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            words: [],
            error: false
        };
    }

    public render() {
        let textFieldHelp = 'ImportWalletPage.step1.inputHelp';
        if (this.state.error) {
            textFieldHelp = 'ImportWalletPage.step1.inputError';
        }

        return (
            <LayoutGrid className="import-wallet-step1">
                <Translate text="ImportWalletPage.step1.warning" body2 />

                <fieldset class="words-input-wrapper">
                    <legend>
                        <Translate text="ImportWalletPage.step1.secretPhrase" />
                    </legend>

                    <TextField
                        textarea
                        fullwidth
                        value={this.state.words.join(' ')}
                        onInput={this.onWordsInputChange.bind(this)}
                    />
                </fieldset>
                <Translate
                    text={textFieldHelp}
                    className={this.state.error ? 'error' : ''}
                    caption
                />

                <div class="cta-wrapper">
                    <Button ripple raised secondary onClick={this.onRestoreWalletClick.bind(this)}>
                        <Translate text="ImportWalletPage.step1.restoreWallet" />
                    </Button>
                </div>
            </LayoutGrid>
        );
    }

    public onWordsInputChange(e) {
        this.setState({
            words: e.target.value.split(' ')
        });
    }

    public async validate(): Promise<boolean> {
        try {
            if (this.state.words.filter(Boolean).length === 0) {
                this.setState({ error: true });
                return false;
            }

            return getWalletPlugin().validateMnemonics(this.state.words.filter(Boolean).join(' '));
        } catch {
            this.setState({ error: true });
            return false;
        }
    }

    public async onRestoreWalletClick() {
        if (typeof this.props.onComplete === 'function' && (await this.validate())) {
            this.props.onComplete(this.state.words);
        }
    }
}
