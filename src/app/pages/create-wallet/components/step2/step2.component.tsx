import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';
import Chips from 'preact-material-components/Chips';
import { Translate } from '../../../../components/translate/translate.component';

import './step2.scss';

interface IProps {
    words: string[];
    onComplete?: () => any;
    onBack?: () => any;
}

interface IState {
    selectedWords: string[];
    shuffledWords: string[];
}

export class CreateWalletStep2 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            selectedWords: [],
            shuffledWords: this.shuffle(props.words)
        };
    }

    public render() {
        const legendClass = this.state.shuffledWords.length === 0 && !this.isValid() ? 'error' : '';
        return (
            <LayoutGrid className="create-wallet-step2">
                <Translate text="CreateWalletPage.step2.subtitle" className="subtitle" headline5 />
                <fieldset class="selected-words">
                    <legend>
                        <Translate text="CreateWalletPage.step2.secretPhrase" />
                    </legend>
                    <Chips>
                        {this.state.selectedWords.map(word => (
                            <Chips.Chip onClick={() => this.removeWord(word)}>
                                <Chips.Text>{word}</Chips.Text>
                                <Chips.Icon>close</Chips.Icon>
                            </Chips.Chip>
                        ))}
                    </Chips>
                </fieldset>
                <Translate
                    text="CreateWalletPage.step2.secretPhraseLegend"
                    caption
                    className={legendClass}
                />

                <Chips className="shuffled-words">
                    {this.state.shuffledWords.map(word => (
                        <Chips.Chip onClick={() => this.addWord(word)}>
                            <Chips.Text>{word}</Chips.Text>
                        </Chips.Chip>
                    ))}
                </Chips>

                <Button className="back" onClick={this.onBackClick.bind(this)}>
                    <Translate text="App.labels.back" />
                </Button>
                <Button
                    className="cta-button"
                    onClick={this.onValidateClick.bind(this)}
                    ripple
                    raised
                    secondary
                    disabled={!this.isValid()}
                >
                    <Translate text="CreateWalletPage.step2.validateSecret" />
                </Button>
            </LayoutGrid>
        );
    }

    public onBackClick() {
        if (typeof this.props.onBack === 'function') {
            this.props.onBack();
        }
    }

    public onValidateClick() {
        if (typeof this.props.onComplete === 'function' && this.isValid()) {
            this.props.onComplete();
        }
    }

    public isValid() {
        return this.props.words.join(' ') === this.state.selectedWords.join(' ');
    }

    public addWord(word) {
        const selectedWords = this.state.selectedWords.slice();
        const shuffledWords = this.state.shuffledWords.slice();

        if (selectedWords.indexOf(word) < 0) {
            selectedWords.push(word);
        }

        if (shuffledWords.indexOf(word) >= 0) {
            shuffledWords.splice(shuffledWords.indexOf(word), 1);
        }

        this.setState({
            selectedWords,
            shuffledWords
        });
    }

    public removeWord(word) {
        const selectedWords = this.state.selectedWords.slice();
        const shuffledWords = this.state.shuffledWords.slice();

        if (shuffledWords.indexOf(word) < 0) {
            shuffledWords.push(word);
        }

        if (selectedWords.indexOf(word) >= 0) {
            selectedWords.splice(selectedWords.indexOf(word), 1);
        }

        this.setState({
            selectedWords,
            shuffledWords
        });
    }

    public shuffle(array: any[]): any[] {
        let i;
        let j;
        let x;
        const a = array.slice();
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}
