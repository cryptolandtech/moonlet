import { Component, h } from 'preact';

import Card from 'preact-material-components/Card';
import Icon from 'preact-material-components/Icon';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import './dashboard.scss';
import List from 'preact-material-components/List';
import Elevation from 'preact-material-components/Elevation';
import { Translate } from '../../components/translate/translate.component';
import { route } from 'preact-router';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';

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
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={4} tabletCols={8}>
                            <Card className="card balance-card">
                                <Translate
                                    text="DashboardPage.totalBalance"
                                    tag="p"
                                    className="mdc-typography--body2"
                                />
                                <p className="mdc-typography--headline5">
                                    {this.state.coin} {this.state.balance}
                                </p>
                            </Card>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={8}>
                            <Card className="card address-card">
                                <Translate
                                    text="DashboardPage.walletAddress"
                                    tag="p"
                                    className="mdc-typography--body2"
                                />
                                <TextareaAutoSize
                                    value={this.state.address}
                                    noBorder
                                    inputRef={el => (this.textareaElement = el)}
                                    className="address-textarea"
                                />
                                {/* <textarea
                                    readOnly={true}
                                    // spellcheck={false}
                                    className="mdc-typography--headline5 address-textarea"
                                    ref={el => (this.textareaElement = el)}
                                    style="width: auto"
                                    rows={2}
                                >
                                    {this.state.address}
                                </textarea> */}

                                <Card.Actions>
                                    <Card.ActionButton
                                        ripple
                                        className="copy-button"
                                        onClick={() => this.copyToClipboard()}
                                    >
                                        <Icon>file_copy</Icon>
                                        <Translate text="DashboardPage.copy" />
                                    </Card.ActionButton>
                                </Card.Actions>
                            </Card>
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell cols={12}>
                            <Elevation z={2}>
                                <List className="transactions-list" two-line={true}>
                                    {[1, 2, 3].map(() => (
                                        <div>
                                            <List.LinkItem href="/transaction/1234567890">
                                                <List.ItemGraphic>file_copy</List.ItemGraphic>
                                                <List.TextContainer>
                                                    <List.PrimaryText>
                                                        ZIL 1,000.00000000
                                                    </List.PrimaryText>
                                                    <List.SecondaryText>
                                                        05/07/2018 4:23:38 PM
                                                    </List.SecondaryText>
                                                </List.TextContainer>
                                                <List.ItemMeta>keyboard_arrow_right</List.ItemMeta>
                                            </List.LinkItem>
                                            <List.Divider />
                                        </div>
                                    ))}
                                </List>
                            </Elevation>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }

    private copyToClipboard() {
        this.textareaElement.select();
        document.execCommand('copy');
    }
}
