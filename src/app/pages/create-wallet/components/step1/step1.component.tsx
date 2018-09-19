import { h, Component } from 'preact';
import { Translate } from '../../../../components/translate/translate.component';
import Button from 'preact-material-components/Button';
import Chips from 'preact-material-components/Chips';
import Dialog from 'preact-material-components/Dialog';

import './step1.scss';
import { LayoutGrid } from 'preact-material-components/LayoutGrid';
import { translate } from '../../../../utils/translate';

interface IProps {
    words: string[];
    onComplete?: () => any;
}

interface IState {
    wordsVisible: boolean;
}

export class CreateWalletStep1 extends Component<IProps, IState> {
    private wordsTextarea;
    private confirmationDialog;

    constructor(props: IProps) {
        super(props);

        this.state = {
            wordsVisible: false
        };
    }

    public getWordList() {
        let list;
        if (this.state.wordsVisible) {
            list = (
                <Chips>
                    {this.props.words.map(word => (
                        <Chips.Chip>
                            <Chips.Text>{word}</Chips.Text>
                        </Chips.Chip>
                    ))}
                    <div class="copy-button-wrapper">
                        <Button ripple onClick={this.copyToClipboard.bind(this)}>
                            <Translate text="CreateWalletPage.step1.copyToClipboard" />
                        </Button>
                    </div>
                </Chips>
            );
        } else {
            list = (
                <div class="word-list-overlay center-text">
                    <Button ripple secondary raised onClick={this.onRevealClick.bind(this)}>
                        <Button.Icon>remove_red_eye</Button.Icon>
                        <Translate text="CreateWalletPage.step1.revealSecretPhrase" />
                    </Button>
                </div>
            );
        }

        return list;
    }

    public getConfirmationDialog() {
        return (
            <Dialog
                ref={el => (this.confirmationDialog = el)}
                onAccept={this.onConfirmBackup.bind(this)}
            >
                <Dialog.Header>
                    <Translate text="CreateWalletPage.step1.confirmationDialog.title" />
                </Dialog.Header>
                <Dialog.Body>
                    <Translate text="CreateWalletPage.step1.confirmationDialog.body" />
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.FooterButton cancel={true}>
                        {translate('App.labels.no')}
                    </Dialog.FooterButton>
                    <Dialog.FooterButton accept={true}>
                        {translate('App.labels.yes')}
                    </Dialog.FooterButton>
                </Dialog.Footer>
            </Dialog>
        );
    }

    public onRevealClick() {
        this.setState({ wordsVisible: true });
    }

    public onConfirmButtonClick() {
        if (this.state.wordsVisible) {
            this.confirmationDialog.MDComponent.show();
        }
    }

    public onConfirmBackup() {
        if (this.state.wordsVisible && typeof this.props.onComplete === 'function') {
            this.props.onComplete();
        }
    }

    public copyToClipboard() {
        if (this.wordsTextarea) {
            this.wordsTextarea.select();
            document.execCommand('copy');
        }
    }

    public render() {
        return (
            <LayoutGrid className="create-wallet-step1">
                <textarea
                    class="words-textarea"
                    ref={el => {
                        this.wordsTextarea = el;
                    }}
                >
                    {this.props.words.join(' ')}
                </textarea>
                <Translate text="CreateWalletPage.step1.subtitle" className="subtitle" headline5 />
                <Translate text="CreateWalletPage.step1.warning" className="warning" body2 />

                {this.getWordList()}

                <Translate text="CreateWalletPage.step1.tips" className="tips" body2 />
                <Button
                    className="cta-button"
                    ripple
                    secondary
                    raised
                    disabled={!this.state.wordsVisible}
                    onClick={this.onConfirmButtonClick.bind(this)}
                >
                    <Translate text="CreateWalletPage.step1.confirmBackup" />
                </Button>
                {this.getConfirmationDialog()}
            </LayoutGrid>
        );
    }
}
