import { h, Component } from 'preact';

import './step1.scss';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import { Translate } from '../../../components/translate/translate.component';
import { TextField } from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import Wallet from 'moonlet-core/src/core/wallet';

interface IProps {
    onComplete?: (words: string[]) => any;
}

interface IState {
    words: string[];
    error: boolean;
}

export class ImportWalletStep1 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            words: [],
            error: false
        };

        this.onWordsInputChange = this.onWordsInputChange.bind(this);
        this.onRestoreWalletClick = this.onRestoreWalletClick.bind(this);
    }

    public render() {
        const isValid = !!this.state.words.filter(Boolean).length;

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
                        onInput={this.onWordsInputChange}
                    />
                </fieldset>
                <Translate
                    text={textFieldHelp}
                    className={this.state.error ? 'error' : ''}
                    caption
                />

                <div class="cta-wrapper">
                    <Button disabled={!isValid} ripple raised onClick={this.onRestoreWalletClick}>
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

    public validate() {
        try {
            const wallet = new Wallet(this.state.words.filter(Boolean).join(' '));
            return true;
        } catch {
            this.setState({ error: true });
            return false;
        }
    }

    public onRestoreWalletClick() {
        if (typeof this.props.onComplete === 'function' && this.validate()) {
            this.props.onComplete(this.state.words);
        }
    }
}
