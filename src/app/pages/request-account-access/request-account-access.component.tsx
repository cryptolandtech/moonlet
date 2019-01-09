import { h, Component } from 'preact';

import './request-account-access.scss';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';
import { Translate } from '../../components/translate/translate.component';
import Typography from 'preact-material-components/Typography';
import Select from 'preact-material-components/Select';
import { IWalletState } from '../../data/wallet/state';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { Response } from '../../utils/response';

interface IProps {
    wallet: IWalletState;
}

interface IState {
    inputs: {
        blockchain: Blockchain;
        account: string;
    };
    initiatorInfo: Tabs.Tab;
}

export class RequestAccountAccessPage extends Component<IProps, IState> {
    private accounts = {};
    private url: URL = new URL(location.href);

    constructor(props: IProps) {
        super(props);

        Object.keys(props.wallet.data.accounts).map(blockchain => {
            if (props.wallet.data.accounts[blockchain].length > 0) {
                this.accounts[blockchain] = props.wallet.data.accounts[blockchain];
            }
        });

        this.state = {
            inputs: {
                blockchain: undefined,
                account: undefined
            },
            initiatorInfo: {} as any
        };

        browser.runtime
            .sendMessage({
                scope: 'remoteInterface',
                action: 'getData',
                params: [this.url.searchParams.get('id')]
            })
            .then(response =>
                this.setState({
                    inputs: {
                        blockchain: response.data.blockchain,
                        account: props.wallet.data.accounts[response.data.blockchain][0].address
                    },
                    initiatorInfo: response.data.siteInfo
                })
            );
    }

    public render() {
        const initiatorHostname = this.state.initiatorInfo.url
            ? new URL(this.state.initiatorInfo.url).hostname
            : '';
        return (
            <div className="request-account-access-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center-text">
                            <Typography headline6>Authorizations request</Typography>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12} className="center-text">
                            <div>
                                <img
                                    width="64"
                                    height="64"
                                    src={this.state.initiatorInfo.favIconUrl}
                                />
                            </div>
                            <div>
                                <Typography headline6>{`${this.state.initiatorInfo.title} ${
                                    initiatorHostname ? `(${initiatorHostname})` : ''
                                } would like to connect to your wallet.`}</Typography>
                            </div>
                            <div>
                                <Typography headline6>
                                    Choose the account you want to give access to
                                </Typography>
                            </div>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12}>
                            <Select
                                className="select blockchain"
                                hintText="Blockchain"
                                outlined
                                disabled
                            >
                                <Select.Item selected value={this.state.inputs.blockchain}>
                                    {this.state.inputs.blockchain}
                                </Select.Item>
                            </Select>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12}>
                            <Select
                                className="select account"
                                hintText="Account"
                                outlined
                                disabled={
                                    (this.accounts[this.state.inputs.blockchain] || []).length === 1
                                }
                            >
                                {(this.accounts[this.state.inputs.blockchain] || []).map(
                                    account => (
                                        <Select.Item
                                            value={account.address}
                                            selected={account.address === this.state.inputs.account}
                                        >
                                            {this.getShortAddress(account.address)}
                                        </Select.Item>
                                    )
                                )}
                            </Select>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell desktopCols={6} tabletCols={4} phoneCols={2}>
                            <Button
                                ripple
                                raised
                                onClick={this.onCancelClick.bind(this)}
                                className="button cancel"
                            >
                                <Translate text="App.labels.cancel" />
                            </Button>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={6}
                            tabletCols={4}
                            phoneCols={2}
                            className="right-text"
                        >
                            <Button
                                ripple
                                raised
                                secondary
                                onClick={this.onAuthorizeClick.bind(this)}
                                className="button confirm"
                            >
                                <Translate text="App.labels.authorize" />
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }

    public getShortAddress(address: string) {
        return address.substr(0, 16) + '...' + address.substr(-6);
    }

    public async onAuthorizeClick() {
        await browser.runtime.sendMessage({
            scope: 'remoteInterface',
            action: 'sendMessage',
            params: [
                this.url.searchParams.get('id'),
                Response.resolve({
                    blockchain: this.state.inputs.blockchain,
                    address: this.state.inputs.account
                })
            ]
        });
        window.close();
    }

    public async onCancelClick() {
        await browser.runtime.sendMessage({
            scope: 'remoteInterface',
            action: 'sendMessage',
            params: [this.url.searchParams.get('id'), Response.reject('CANCEL')]
        });
        window.close();
    }
}
