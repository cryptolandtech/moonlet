import { h, Component } from 'preact';
import {Router, CustomHistory} from "preact-router";
import createHashHistory from 'history/createHashHistory';

import Button from "preact-material-components/Button";
import "preact-material-components/Button/mdc-button.scss";

import './app.scss';
import { LandingPage } from './pages/landing/landing';
import { DashboardPage } from './pages/dashboard/dashboard';
import { ImportWalletPage } from './pages/import-wallet/import-wallet';
import { CreateWalletPage } from './pages/create-wallet/create-wallet';

interface IProps {
	history: CustomHistory,
	platform: "web" | "extension"
}

export default class App extends Component<IProps> {
	render(props: IProps) {
		return (
			<div class="app-root">
				<Router history={props.history}>
					<LandingPage path="/"/>
					<CreateWalletPage path="/create-wallet"/>
					<ImportWalletPage path="/import-wallet"/>
					<DashboardPage path="/dashboard"/>
				</Router>
			</div>
		);
	}
}
