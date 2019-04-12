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
import { DisclaimerPage } from '../settings/pages/disclaimer/disclaimer.component';
import Dialog from 'preact-material-components/Dialog';

interface IProps {
    wallet: IWalletState;
    networkConfig: any;
    disclaimerVersionAccepted: number;

    loadWallet: (walletProvider: IWalletProvider, netWorksConfig, password?: string) => any;
    acceptDisclaimer: () => any;
}

interface IState {
    password: string;
}

export class LandingPage extends Component<IProps, IState> {
    public disclaimerAcceptAction;
    public disclaimerDialogRef;

    constructor(props) {
        super(props);

        this.state = {
            password: ''
        };
    }

    public checkDisclaimerAndExecute(fn: () => any) {
        if (DisclaimerPage.version !== this.props.disclaimerVersionAccepted) {
            this.disclaimerAcceptAction = fn;
            this.disclaimerDialogRef.MDComponent.show();
        } else if (typeof fn === 'function') {
            fn();
        }
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
                            <img class="logo" src="/assets/logo.svg" />
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
                                            this.checkDisclaimerAndExecute(() =>
                                                this.props.loadWallet(
                                                    appContext('walletProvider'),
                                                    this.props.networkConfig,
                                                    this.state.password
                                                )
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
                                            this.checkDisclaimerAndExecute(() =>
                                                this.props.loadWallet(
                                                    appContext('walletProvider'),
                                                    this.props.networkConfig,
                                                    this.state.password
                                                )
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
                                    onClick={() =>
                                        this.checkDisclaimerAndExecute(() =>
                                            route('/create-wallet')
                                        )
                                    }
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
                                    onClick={() =>
                                        this.checkDisclaimerAndExecute(() =>
                                            route('/import-wallet')
                                        )
                                    }
                                >
                                    <Translate text="LandingPage.restoreExistingWallet" />
                                </Button>
                            </LayoutGrid.Cell>
                        )}
                    </LayoutGrid.Inner>
                </LayoutGrid>

                <Dialog
                    className="disclaimer-dialog"
                    ref={ref => (this.disclaimerDialogRef = ref)}
                    onAccept={() => {
                        if (typeof this.disclaimerAcceptAction === 'function') {
                            this.props.acceptDisclaimer();
                            this.disclaimerAcceptAction();
                        }
                    }}
                >
                    <Dialog.Header>
                        <Translate text="DisclaimerPage.title" />
                    </Dialog.Header>
                    <Dialog.Body scrollable={true}>
                        <DisclaimerPage />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>
                            {translate('App.labels.decline')}
                        </Dialog.FooterButton>
                        <Button
                            raised
                            secondary
                            className="mdc-dialog__footer__button mdc-dialog__footer__button--accept"
                        >
                            {translate('App.labels.accept')}
                        </Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}
