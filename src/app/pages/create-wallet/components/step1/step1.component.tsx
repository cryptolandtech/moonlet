import { h, Component } from 'preact';
import { Translate } from '../../../../components/translate/translate.component';
import Button from 'preact-material-components/Button';
import Chips from 'preact-material-components/Chips';

import './step1.scss';

interface IProps {
    words: string[];
    onComplete?: () => any;
}

interface IState {
    wordsVisible: boolean;
}

export class CreateWalletStep1 extends Component<IProps, IState> {
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
                </Chips>
            );
        } else {
            list = (
                <div class="word-list-overlay center-text">
                    <Button ripple secondary raised onClick={this.onRevealClick.bind(this)}>
                        <Button.Icon>remove_red_eye</Button.Icon>
                        Reveal Secret Phrase
                    </Button>
                </div>
            );
        }

        return list;
    }

    public onRevealClick() {
        this.setState({ wordsVisible: true });
    }

    public onConfirmBackup() {
        if (this.state.wordsVisible && typeof this.props.onComplete === 'function') {
            this.props.onComplete();
        }
    }

    public render() {
        return (
            <div class="create-wallet-step1">
                <Translate text="CreateWalletPage.step1.subtitle" headline5 />
                <Translate text="CreateWalletPage.step1.warning" body2 />

                {this.getWordList()}

                <Translate text="CreateWalletPage.step1.tips" body2 />
                <Button
                    className="confirm-backup"
                    ripple
                    secondary
                    raised
                    disabled={!this.state.wordsVisible}
                    onClick={this.onConfirmBackup.bind(this)}
                >
                    <Translate text="CreateWalletPage.step1.confirmBackup" />
                </Button>
            </div>
        );
    }
}
