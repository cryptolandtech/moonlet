import { Component, h } from 'preact';
import { route } from 'preact-router';

import Button from 'preact-material-components/Button';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import TopBar from '../../components/top-bar/top-bar.container';

import './landing.scss';

export class LandingPage extends Component {
  public render() {
    return (
      <div className="landing-page">
        <TopBar />
        <LayoutGrid className="mdc-top-app-bar--fixed-adjust">
          <LayoutGrid.Inner>
            <LayoutGrid.Cell cols={12} className="center">
              <h1 class="title mdc-typography--headline2">Moonlet</h1>
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
                Create new wallet
              </Button>
            </LayoutGrid.Cell>
            <LayoutGrid.Cell cols={12} className="center">
              <Button
                ripple
                raised
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
