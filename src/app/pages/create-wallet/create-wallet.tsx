import { h, Component } from 'preact';
import { route } from 'preact-router';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/Card/style.css';
import './create-wallet.scss';
import TopBar from '../../components/top-bar/top-bar.container';

export class CreateWalletPage extends Component {
  public render(props, state) {
    return (
      <div className="create-wallet-page">
        <TopBar />
        <div class="padding-left-right">
          <LayoutGrid className="mdc-top-app-bar--fixed-adjust" />
          <LayoutGrid.Cell cols={12} className="center">
            <h1 class="title mdc-typography--headline2">Backup Secret Phrase</h1>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell cols={12} className="center">
            <p className="left-text margin-top mdc-typography--caption">
              WARNING: Never disclose your secret phrase. Anyone with this phrase can take your
              funds forever.
            </p>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell cols={12} className="center">
            <section class="hidden">dfhdfh</section>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell cols={12} className="center">
            <p className="left-text mdc-typography--caption">
              Backup Tips: It's important to backup this secret phrase securely where nobody else
              can access it, such as on a piece of paper or in a password manager. Don't email or
              screenshot the secret phrase.{' '}
            </p>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell cols={12} className="center">
            <Button ripple raised className="backup-button" onClick={() => route('import-wallet')}>
              CONFIRM BACKUP
            </Button>
          </LayoutGrid.Cell>
        </div>
      </div>
    );
  }
}
