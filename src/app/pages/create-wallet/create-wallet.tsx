import { h, Component } from 'preact';
import { route } from 'preact-router';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';
import Card from 'preact-material-components/Card';

export class CreateWalletPage extends Component {
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
        let wordsList;
        if (state.revealed) {
            wordsList = (
                <div>
                    <textarea id="words">{state.words.join(' ')}</textarea>
                    <LayoutGrid className="words-grid">
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[0]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[1]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[2]}
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[3]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[4]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[5]}
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[6]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[7]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[8]}
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[9]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[10]}
                            </LayoutGrid.Cell>
                            <LayoutGrid.Cell cols={4} className="secret-word">
                                {state.words[11]}
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                        <LayoutGrid.Inner>
                            <LayoutGrid.Cell cols={12}>
                                <Card.ActionButton
                                    ripple
                                    className="copy-to-clipboard"
                                    onClick={() => this.copyToClipboard()}
                                >
                                    COPY TO CLIPBOARD
                                </Card.ActionButton>
                            </LayoutGrid.Cell>
                        </LayoutGrid.Inner>
                    </LayoutGrid>
                </div>
            );
        } else {
            wordsList = (
                <div
                    id="hidden-words"
                    onClick={() => {
                        this.revealWords();
                    }}
                >
                    <img id="eye" src="/assets/eye.png" />
                    <p id="hidden-words-text">Click Here to Reveal Secret Phrase</p>
                </div>
            );
        }

        return (
            <div className="create-wallet-page">
                <div class="padding-left-right">
                    <LayoutGrid className="mdc-top-app-bar--fixed-adjust" />
                    <LayoutGrid.Cell cols={12} className="center">
                        <h1 class="title mdc-typography--headline2">Backup Secret Phrase</h1>
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12} className="center">
                        <p className="left-text margin-top mdc-typography--caption">
                            WARNING: Never disclose your secret phrase. Anyone with this phrase can
                            take your funds forever.
                        </p>
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell className="center">{wordsList}</LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12} className="center">
                        <p className="left-text mdc-typography--caption">
                            Backup Tips: It's important to backup this secret phrase securely where
                            nobody else can access it, such as on a piece of paper or in a password
                            manager. Don't email or screenshot the secret phrase.{' '}
                        </p>
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12} className="center">
                        <Button
                            ripple
                            raised
                            className="backup-button"
                            disabled={!state.revealed}
                            onClick={() => route('import-wallet')}
                        >
                            CONFIRM BACKUP
                        </Button>
                    </LayoutGrid.Cell>
                </div>
            </div>
        );
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
