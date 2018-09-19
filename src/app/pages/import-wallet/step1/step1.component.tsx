import { h, Component } from 'preact';

import './step1.scss';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import { Translate } from '../../../components/translate/translate.component';
import { TextField } from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';

interface IProps {
    onComplete?: (words: string[]) => any;
}

interface IState {
    words: string[];
}

export class ImportWalletStep1 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            words: []
        };
    }

    public render() {
        return (
            <LayoutGrid className="import-wallet-step1">
                <Translate text="ImportWalletPage.step1.warning" body2 />

                <fieldset class="words-input-wrapper">
                    <legend>
                        <Translate text="ImportWalletPage.step1.secretPhrase" />
                    </legend>

                    <TextField textarea fullwidth onInput={this.onWordsInputChange.bind(this)} />
                </fieldset>
                <Translate text="ImportWalletPage.step1.inputHelp" caption />

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

    public onRestoreWalletClick() {
        if (typeof this.props.onComplete === 'function') {
            this.props.onComplete(this.state.words);
        }
    }
}
