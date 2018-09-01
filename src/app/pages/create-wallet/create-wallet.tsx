import {h, Component} from 'preact';

import {TopBar} from "../layouts/top-bar/top-bar";
import LayoutGrid from "preact-material-components/LayoutGrid";
import "preact-material-components/Card/style.css";
import "./create-wallet.scss";

export class CreateWalletPage extends Component {
    render(props, state) {
        return (
            <div className="create-wallet-page">
                <TopBar title="Create New Wallet"/>
                <LayoutGrid className="mdc-top-app-bar--fixed-adjust">
                        <span class="mdc-top-app-bar__title">Content</span>
                </LayoutGrid>
            </div>
        );
    }
}