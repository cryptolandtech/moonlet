import { h, Component } from 'preact';
import { route } from 'preact-router';

import Icon from "preact-material-components/Icon";
import LayoutGrid from "preact-material-components/LayoutGrid";
import Button from 'preact-material-components/Button';
import {TopBar} from "../layouts/top-bar/top-bar";

import "./landing.scss";

export class LandingPage extends Component {
    render() {
        return (
            <div className="landing-page">
                <TopBar/>
                <LayoutGrid className="mdc-top-app-bar--fixed-adjust">
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center">
                            <h1 class="title mdc-typography--headline2">Moonlet</h1>
                            <Icon className="icon">account_balance_wallet</Icon>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12} className="center">
                            <Button 
                                ripple secondary raised 
                                className="create-wallet"
                                onClick={() => route('/create-wallet')}
                            >
                                Create new wallet
                            </Button>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12} className="center">
                            <Button 
                                ripple raised 
                                className="restore-wallet"
                                onClick={() => route('import-wallet')}
                            >
                                Restore existing wallet
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}