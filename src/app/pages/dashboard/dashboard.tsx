import {h, Component} from 'preact';

import {TopBar} from "../layouts/top-bar/top-bar";

import LayoutGrid from "preact-material-components/LayoutGrid";
import Card, {CardMediaContent} from "preact-material-components/Card";
import 'preact-material-components/Card/style.css';
import Icon from "preact-material-components/Icon";
import "./dashboard.scss";

export class DashboardPage extends Component {
    render() {
        return (
            <div className="dashboard-page">
                <TopBar/>
                <LayoutGrid className="mdc-top-app-bar--fixed-adjust">
                    <LayoutGrid.Cell cols={12}>
                        <Card className="balance-card">
                            <CardMediaContent className="balance-card-text">
                                <p className="mdc-typography--body2">Total Balance</p>
                                <p className="mdc-typography--headline5">ZIL 0.00000000</p>
                            </CardMediaContent>
                        </Card>
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12}>
                        <Card className="address-card">
                            <CardMediaContent className="address-card-text">
                                <p className="mdc-typography--body2">Wallet address</p>
                                <p className="mdc-typography--headline5">0x5FC7409B4B41E06E73BA1AA7F3127D93C76BD557</p>
                                <Icon className="icon">baseline-file_copy-24</Icon>
                            </CardMediaContent>
                        </Card>
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell>
                        <p className="center mdc-typography--caption">No transaction history is available at this moment.</p>
                    </LayoutGrid.Cell>
                </LayoutGrid>
            </div>
        );
    }
}