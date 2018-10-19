import { Component, h } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import './reveal.scss';
import { Translate } from '../../components/translate/translate.component';
import Button from 'preact-material-components/Button';
import { GenericAccount } from 'moonlet-core/src/core/account';
import Chips from 'preact-material-components/Chips';
import { removeType } from '../../utils/remove-type';

interface IProps {
    account: GenericAccount;
    words: string[];
    routeName: string;
}

interface IState {
    wordsVisible: boolean;
    layoutProps?: {
        warningText: string;
        tipsText: string;
        revealButtonText: string;
    };
}

export class RevealPage extends Component<IProps, IState> {
    private wordsTextarea;
    private isPrivateKeyLayout: boolean;

    constructor(props: IProps) {
        super(props);
        let layoutProps;
        switch (this.props.routeName) {
            case 'revealSecretPhrase':
                this.isPrivateKeyLayout = false;
                layoutProps = {
                    warningText: 'RevealPage.phraseWarning',
                    tipsText: 'RevealPage.phraseTips',
                    revealButtonText: 'RevealPage.revealSecretPhrase'
                };
                break;
            case 'revealPrivateKey':
                this.isPrivateKeyLayout = true;
                layoutProps = {
                    warningText: 'RevealPage.privateKeyWarning',
                    tipsText: 'RevealPage.privateKeyTips',
                    revealButtonText: 'RevealPage.revealPrivateKey'
                };
                break;
        }

        this.state = {
            wordsVisible: false,
            layoutProps
        };
    }

    public onRevealClick() {
        this.setState({ wordsVisible: true });
    }

    public copyToClipboard() {
        if (this.wordsTextarea) {
            this.wordsTextarea.select();
            document.execCommand('copy');
        }
    }

    public displayText() {
        let elementToRender;
        if (this.state.wordsVisible) {
            elementToRender = (
                <div>
                    {this.isPrivateKeyLayout ? (
                        <div className=" mdc-typography--headline5">
                            {this.props.account.privateKey}
                        </div>
                    ) : (
                        <Chips>
                            {this.props.words.map(word =>
                                removeType(
                                    <Chips.Chip>
                                        {removeType(<Chips.Text>{word}</Chips.Text>)}
                                    </Chips.Chip>
                                )
                            )}
                        </Chips>
                    )}
                    <div class="copy-button-wrapper">
                        <Button ripple onClick={this.copyToClipboard.bind(this)}>
                            <Translate text="RevealPage.copyToClipboard" />
                        </Button>
                    </div>
                </div>
            );
        } else {
            elementToRender = (
                <div class="word-list-overlay center-text">
                    <Button ripple secondary raised onClick={this.onRevealClick.bind(this)}>
                        <Button.Icon>remove_red_eye</Button.Icon>
                        <Translate text={this.state.layoutProps.revealButtonText} />
                    </Button>
                </div>
            );
        }
        return elementToRender;
    }

    public render() {
        return (
            <div>
                <LayoutGrid className="reveal-page">
                    <textarea
                        class="words-textarea"
                        ref={el => {
                            this.wordsTextarea = el;
                        }}
                    >
                        {this.isPrivateKeyLayout
                            ? this.props.account.privateKey
                            : this.props.words.join(' ')}
                    </textarea>
                    <Translate
                        text={this.state.layoutProps.warningText}
                        className="warning"
                        body2
                    />
                    {this.displayText()}
                    <Translate text={this.state.layoutProps.tipsText} className="tips" body2 />
                </LayoutGrid>
            </div>
        );
    }
}
