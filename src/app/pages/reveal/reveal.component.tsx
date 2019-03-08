import { Component, h } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import './reveal.scss';
import { Translate } from '../../components/translate/translate.component';
import Button from 'preact-material-components/Button';
import { GenericAccount } from 'moonlet-core/src/core/account';
import Chips from 'preact-material-components/Chips';
import { removeType } from '../../utils/remove-type';
import { translate } from '../../utils/translate';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import TextField from 'preact-material-components/TextField';
import { getWalletProvider } from '../../app-context';

interface IProps {
    account: any;
    words: string[];
    type: string;
}

interface IState {
    currentScreen: 'password' | 'info';
    passwordInput: string;
    passwordInputError: string;
}

export class RevealPage extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            currentScreen: 'password',
            passwordInput: '',
            passwordInputError: ''
        };
    }

    public renderPasswordScreen() {
        return (
            <div>
                <div class="warning">{translate(`RevealPage.${this.props.type}.warning`)}</div>
                <div class="password-input">
                    <TextField
                        outlined
                        label={translate('RevealPage.enterPassword')}
                        value={this.state.passwordInput}
                        type="password"
                        onKeyPress={e => {
                            this.setState({ passwordInput: (e.target as any).value });
                            if (e.code === 'Enter') {
                                this.checkPassword();
                            }
                        }}
                    />
                </div>
                {this.state.passwordInputError && (
                    <div class="error">{this.state.passwordInputError}</div>
                )}
                <Button
                    ripple
                    secondary
                    raised
                    class="reveal-button"
                    onClick={this.checkPassword.bind(this)}
                >
                    <Translate text={`RevealPage.${this.props.type}.title`} />
                </Button>
            </div>
        );
    }

    public getInfo() {
        switch (this.props.type) {
            case 'secretPhrase':
                return (
                    <Chips className="info">
                        {this.props.words.map(word =>
                            removeType(
                                <Chips.Chip>
                                    {removeType(<Chips.Text>{word}</Chips.Text>)}
                                </Chips.Chip>
                            )
                        )}
                    </Chips>
                );
                break;
            case 'publicKey':
            case 'privateKey':
                return <div class="info key">{this.props.account[this.props.type]}</div>;
                break;
        }
    }

    public renderInfoScreen() {
        return (
            <div>
                <div class="warning">{translate(`RevealPage.${this.props.type}.warning`)}</div>
                {this.getInfo()}
                <div class="tips">{translate(`RevealPage.${this.props.type}.tips`)}</div>
            </div>
        );
    }

    public render() {
        return (
            <div class="reveal-page">
                {this.state.currentScreen === 'password' && this.renderPasswordScreen()}
                {this.state.currentScreen === 'info' && this.renderInfoScreen()}
            </div>
        );
    }

    public async checkPassword() {
        try {
            await getWalletProvider().unlockWallet(this.state.passwordInput);
            this.setState({
                currentScreen: 'info'
            });
        } catch (e) {
            this.setState({
                passwordInputError: translate('RevealPage.invalidPassword')
            });
        }
    }
}
