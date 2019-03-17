import { Component, h } from 'preact';
import { route } from 'preact-router';

import Button from 'preact-material-components/Button';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';

import './landing.scss';
import { Translate } from '../../components/translate/translate.component';
import { TextField } from 'preact-material-components/TextField';
import { translate } from '../../utils/translate';
import Card from 'preact-material-components/Card';

import { IWalletState, WalletStatus } from '../../data/wallet/state';
import { IWalletProvider } from '../../iwallet-provider';
import { appContext } from '../../app-context';

interface IProps {
    wallet: IWalletState;
    networkConfig: any;

    loadWallet: (walletProvider: IWalletProvider, netWorksConfig, password?: string) => any;
}

interface IState {
    password: string;
}

export class LandingPage extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            password: ''
        };
    }

    public render() {
        let className = 'landing-page';

        if (this.props.wallet.status === WalletStatus.LOCKED) {
            className += ' password';
        }

        return (
            <div className={className}>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center">
                            <Translate
                                text="LandingPage.title"
                                tag="h1"
                                className="title mdc-typography--headline4"
                            />
                            <h6 class="title mdc-typography mdc-typography--headline6">
                                beta version
                            </h6>
                            <Icon className="icon">security</Icon>
                        </LayoutGrid.Cell>
                        {this.props.wallet.status === WalletStatus.LOCKED && (
                            <LayoutGrid.Cell cols={12} class="center">
                                <Card className="password-input-wrapper">
                                    <TextField
                                        type="password"
                                        value={this.state.password}
                                        onInput={e =>
                                            this.setState({ password: (e.target as any).value })
                                        }
                                        onKeyPress={e =>
                                            e.code === 'Enter' &&
                                            this.props.loadWallet(
                                                appContext('walletProvider'),
                                                this.props.networkConfig,
                                                this.state.password
                                            )
                                        }
                                        label={translate('LandingPage.enterPassword')}
                                    />

                                    <div className="error">
                                        {this.props.wallet.invalidPassword && (
                                            <Translate text="LandingPage.invalidPassword" caption />
                                        )}
                                    </div>

                                    <Button
                                        ripple
                                        secondary
                                        raised
                                        className="sign-in"
                                        onClick={() =>
                                            this.props.loadWallet(
                                                appContext('walletProvider'),
                                                this.props.networkConfig,
                                                this.state.password
                                            )
                                        }
                                    >
                                        <Translate text="LandingPage.signIn" />
                                    </Button>
                                </Card>
                            </LayoutGrid.Cell>
                        )}
                        {this.props.wallet.status !== WalletStatus.LOADING && (
                            <LayoutGrid.Cell cols={12} className="center">
                                <Button
                                    ripple
                                    secondary
                                    raised
                                    className="create-wallet"
                                    onClick={() => route('/create-wallet')}
                                >
                                    <Translate text="LandingPage.createNewWallet" />
                                </Button>
                            </LayoutGrid.Cell>
                        )}
                        {this.props.wallet.status !== WalletStatus.LOADING && (
                            <LayoutGrid.Cell cols={12} className="center">
                                <Button
                                    ripple
                                    raised
                                    className="restore-wallet"
                                    onClick={() => route('/import-wallet')}
                                >
                                    <Translate text="LandingPage.restoreExistingWallet" />
                                </Button>
                            </LayoutGrid.Cell>
                        )}
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}
