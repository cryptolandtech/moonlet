import { h, Component } from 'preact';
import { route } from 'preact-router';
import Button from 'preact-material-components/Button';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';
import Card from 'preact-material-components/Card';

import { Translate } from '../../components/translate/translate.component';
import { CreateWalletStep1 } from './components/step1/step1.component';

interface IState {
    words: string[];
    revealed: boolean;
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
            revealed: false
        };
    }

    public render(props, state) {
        return <CreateWalletStep1 words={this.state.words} />;

        let wordsList = this.getHiddenWords();
        if (state.revealed) {
            wordsList = this.getRevealedWords(wordsList, state);
        }
        return this.getPage(wordsList, state);
    }

    private getPage(wordsList, state) {
        return (
            <div className="create-wallet-page">
                <div class="padding-left-right">
                    <LayoutGrid.Cell cols={12} className="center">
                        <Translate
                            text="CreateNewWalletPage.subtitle"
                            tag="h1"
                            className="title mdc-typography--headline2"
                        />
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12} className="center">
                        <Translate
                            text="CreateNewWalletPage.warning"
                            tag="p"
                            className="left-text margin-top mdc-typography--caption"
                        />
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell className="center">{wordsList}</LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12} className="center">
                        <Translate
                            text="CreateNewWalletPage.tips"
                            tag="p"
                            className="left-text margin-top mdc-typography--caption"
                        />
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12} className="center">
                        <Button
                            ripple
                            raised
                            className="backup-button"
                            disabled={!state.revealed}
                            onClick={() => route('import-wallet')}
                        >
                            <Translate
                                text="CreateNewWalletPage.confirmBackup"
                                tag="span"
                                className=""
                            />
                        </Button>
                    </LayoutGrid.Cell>
                </div>
            </div>
        );
    }

    private getHiddenWords() {
        return (
            <div
                id="hidden-words"
                onClick={() => {
                    this.revealWords();
                }}
            >
                {/*<img  src="/assets/baseline-visibility-24px.svg" />*/}
                <Icon id="eye">remove_red_eye</Icon>
                <p id="hidden-words-text">Click Here to Reveal Secret Phrase</p>
            </div>
        );
    }

    private getRevealedWords(wordsList, state) {
        wordsList = (
            <div>
                <textarea id="words">{state.words.join(' ')}</textarea>
                <LayoutGrid className="words-grid">
                    <LayoutGrid.Inner className="inner">
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[0]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[1]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[2]}
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                    <LayoutGrid.Inner className="inner">
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[3]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[4]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[5]}
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                    <LayoutGrid.Inner className="inner">
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[6]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[7]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[8]}
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                    <LayoutGrid.Inner className="inner">
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[9]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[10]}
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={4}
                            tabletCols={2}
                            phoneCols={1}
                            className="secret-word"
                        >
                            {state.words[11]}
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                    <LayoutGrid.Inner className="inner">
                        <LayoutGrid.Cell desktopCols={12} tabletCols={4} phoneCols={3}>
                            <Card.ActionButton
                                ripple
                                className="copy-to-clipboard"
                                onClick={() => this.copyToClipboard()}
                            >
                                <Translate
                                    text="CreateNewWalletPage.copyToClipboard"
                                    tag="span"
                                    className=""
                                />
                            </Card.ActionButton>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
        return wordsList;
    }

    private revealWords() {
        this.setState({
            revealed: true
        });
    }

    private copyToClipboard() {
        const element = document.getElementById('words') as HTMLInputElement;
        element.select();
        document.execCommand('copy');
    }
}
