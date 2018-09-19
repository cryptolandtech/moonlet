import { Component, h } from 'preact';
import { route } from 'preact-router';

import Button from 'preact-material-components/Button';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';

import './landing.scss';
import { Translate } from '../../components/translate/translate.component';
import { getWallet } from '../../mock/wallet';
import { TextField } from 'preact-material-components/TextField';
import { translate } from '../../utils/translate';

interface IState {
    password: string;
}

export class LandingPage extends Component<{}, IState> {
    constructor(props) {
        super(props);

        this.state = {
            password: ''
        };
    }
    public render() {
        const wallet = getWallet();

        return (
            <div className="landing-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center">
                            <Translate
                                text="LandingPage.title"
                                tag="h1"
                                className="title mdc-typography--headline2"
                            />
                            <Icon className="icon">security</Icon>
                        </LayoutGrid.Cell>
                        {wallet && (
                            <LayoutGrid.Cell cols={12} class="center">
                                <div class="password-input-wrapper">
                                    <TextField
                                        type="password"
                                        onInput={e =>
                                            this.setState({ password: (e.target as any).value })
                                        }
                                        label={translate('LandingPage.enterPassword')}
                                    />
                                </div>
                                <Button
                                    ripple
                                    secondary
                                    raised
                                    className="create-wallet"
                                    onClick={() => {
                                        if (this.state.password === wallet.password) {
                                            route('/dashboard');
                                        } else {
                                            alert('wrong password');
                                        }
                                    }}
                                >
                                    <Translate text="LandingPage.signIn" />
                                </Button>
                            </LayoutGrid.Cell>
                        )}
                        {wallet === undefined && (
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
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}
