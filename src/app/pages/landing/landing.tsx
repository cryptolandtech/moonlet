import { Component, h } from 'preact';
import { route } from 'preact-router';

import Button from 'preact-material-components/Button';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';

import './landing.scss';
import { Translate } from '../../components/translate/translate.component';

export class LandingPage extends Component {
    public render() {
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
                        <LayoutGrid.Cell cols={12} className="center">
                            <Button
                                ripple
                                raised
                                className="restore-wallet"
                                onClick={() => route('/dashboard')}
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
