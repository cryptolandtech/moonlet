import { h, Component } from 'preact';
import {Router} from "preact-router";

import Button from "preact-material-components/Button";
import "preact-material-components/Button/mdc-button.scss";

import './app.scss';
import { LandingPage } from './pages/landing/landing';
import { DashboardPage } from './pages/dashboard/dashboard';
import { ImportWalletPage } from './pages/import-wallet/import-wallet';
import { CreateWalletPage } from './pages/create-wallet/create-wallet';

export default class App extends Component {
	render() {
		return (
			<div class="app-root">
				<Router>
					<LandingPage path="/"/>
					<CreateWalletPage path="/create-wallet"/>
					<ImportWalletPage path="/import-wallet"/>
					<DashboardPage path="/dashboard"/>
				</Router>
			</div>
		);
	}
}
