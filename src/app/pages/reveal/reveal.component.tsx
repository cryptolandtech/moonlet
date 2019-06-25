import { Component, h } from 'preact';
import './reveal.scss';
import { Translate } from '../../components/translate/translate.component';
import Button from 'preact-material-components/Button';
import Chips from 'preact-material-components/Chips';
import { removeType } from '../../utils/remove-type';
import { translate } from '../../utils/translate';
import TextField from 'preact-material-components/TextField';
import { getWalletPlugin } from '../../app-context';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from '../../components/copy/copy.component';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { bind } from 'bind-decorator';
import Typography from 'preact-material-components/Typography';

interface IProps {
    account: any;
    words?: string[];
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
            currentScreen: props.type === 'addressFormat' ? 'info' : 'password',
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
                        onKeyUp={e => {
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
                <Button ripple secondary raised class="reveal-button" onClick={this.checkPassword}>
                    <Translate text={`RevealPage.${this.props.type}.title`} />
                </Button>
            </div>
        );
    }

    public getInfo() {
        switch (this.props.type) {
            case 'secretPhrase':
                return [
                    <Chips className="info">
                        {this.props.words.map(word =>
                            removeType(
                                <Chips.Chip>
                                    {removeType(<Chips.Text>{word}</Chips.Text>)}
                                </Chips.Chip>
                            )
                        )}
                    </Chips>,
                    <div class="center-text">
                        <CopyToClipboard text={this.props.words.join(' ')}>
                            <Button ripple>
                                <Translate text="App.labels.copyToClipboard" />
                            </Button>
                        </CopyToClipboard>
                    </div>
                ];
                break;
            case 'publicKey':
            case 'privateKey':
                return (
                    <Copy text={this.props.account[this.props.type]}>
                        <div class="info key">{this.props.account[this.props.type]}</div>
                    </Copy>
                );
                break;
            case 'addressFormat':
                const pagesConfig = BLOCKCHAIN_INFO[this.props.account.node.blockchain].pagesConfig;
                const multipleFormats =
                    pagesConfig &&
                    pagesConfig.accountPage &&
                    pagesConfig.accountPage.multipleAddressFormats;
                return (
                    multipleFormats &&
                    pagesConfig.accountPage.displayFormats.map(format => (
                        <div>
                            <Translate
                                body1
                                text={`RevealPage.addressFormat.formats.${format}`}
                                className="format-title"
                            />
                            <Copy text={this.props.account.addressFormats[format]}>
                                <Typography headline6 class="address">
                                    {this.props.account.addressFormats[format]}
                                </Typography>
                            </Copy>
                        </div>
                    ))
                );
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

    @bind
    public async checkPassword() {
        try {
            await getWalletPlugin().unlockWallet(this.state.passwordInput);
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
