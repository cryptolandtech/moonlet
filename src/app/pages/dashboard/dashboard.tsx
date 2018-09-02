import { Component, h } from 'preact';

import Card, { CardMediaContent } from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import TopBar from '../../components/top-bar/top-bar.container';
import './dashboard.scss';

export class DashboardPage extends Component<any, any> {
  private textareaElement: HTMLTextAreaElement;

  constructor() {
    super();
    this.state = {
      coin: 'ZIL',
      address: '0x5FC7409B4B41E06E73BA1AA7F3127D93C76BD557',
      balance: '0.00000000'
    };
  }

  public render() {
    return (
      <div className="dashboard-page">
        <TopBar />
        <LayoutGrid className="mdc-top-app-bar--fixed-adjust">
          <LayoutGrid.Cell cols={12}>
            <Card className="balance-card">
              <CardMediaContent className="balance-card-text">
                <p className="mdc-typography--body2">Total Balance</p>
                <p className="mdc-typography--headline5">
                  {this.state.coin} {this.state.balance}
                </p>
              </CardMediaContent>
            </Card>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell cols={12}>
            <Card className="address-card">
              <CardMediaContent className="address-card-text">
                <p className="mdc-typography--body2">Wallet address</p>
                <textarea
                  readOnly={true}
                   spellcheck={false}
                  className="mdc-typography--headline5 textarea"
                  ref={el => (this.textareaElement = el)}
                >
                  {this.state.address}
                </textarea>
                <Icon className="icon" onClick={() => this.copyToClipboard()}>
                  file_copy
                </Icon>
              </CardMediaContent>
              <Card.ActionButton
                ripple
                className="copy-button"
                onClick={() => this.copyToClipboard()}
              >
                Copy
              </Card.ActionButton>
            </Card>
          </LayoutGrid.Cell>
          <LayoutGrid.Cell>
            <p className="center mdc-typography--caption">
              No transaction history is available at this moment.
            </p>
          </LayoutGrid.Cell>
        </LayoutGrid>
      </div>
    );
  }

  private copyToClipboard() {
    this.textareaElement.select();
    document.execCommand('copy');
  }
}
