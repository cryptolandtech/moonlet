import { h, Component } from 'preact';
import { Blockchain } from 'moonlet-core/dist/types/core/blockchain';
import { Runtime } from 'webextension-polyfill-ts';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Typography from 'preact-material-components/Typography';
import Select from 'preact-material-components/Select';
import Button from 'preact-material-components/Button';
import { Translate } from '../../../../components/translate/translate.component';

import './account-access.scss';
import { capitalize } from '../../../../utils/string';
import { getPlugins } from '../../../../app-context';
import bind from 'bind-decorator';
import { Response } from '../../../../../utils/response';

interface IProps {
    id: string;
    params: {
        blockchain: Blockchain;
        forceAccountSelection: boolean;
    };
    sender: Runtime.MessageSender;

    testNet: boolean;
    currentNetworkName: string;
    currentNetworkId: number;
    accounts: string[];
    walletReady: boolean;
}

interface IState {
    selectedAccountAddress: string;
}

export class AccountAccessPage extends Component<IProps, IState> {
    public accounts = {};

    constructor(props: IProps) {
        super(props);

        this.state = {
            selectedAccountAddress: this.props.accounts[0]
        };

        this.checkAccess();
    }

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.accounts !== prevProps.accounts) {
            this.setState({ selectedAccountAddress: this.props.accounts[0] });
        }

        if (this.props.walletReady !== prevProps.walletReady) {
            this.checkAccess();
        }
    }

    public checkAccess() {
        if (this.props.walletReady && !this.props.params.forceAccountSelection) {
            getPlugins()
                .dappAccess.getAccount(
                    this.props.sender.tab.url,
                    this.props.params.blockchain,
                    this.props.currentNetworkId
                )
                .then(address => {
                    this.sendResult(this.props.currentNetworkId, address);
                });
        }
    }

    public render() {
        if (!this.props.walletReady) {
            return '';
        }

        const initiatorHostname = new URL(this.props.sender.tab.url).hostname;
        return (
            <div className="account-access-page">
                <div class={`current-network ${this.props.testNet ? 'testnet' : ''}`}>
                    {this.props.currentNetworkName}
                </div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center-text">
                            <Typography body1>Authorization request</Typography>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12} className="center-text">
                            <div class="dapp-logo">
                                <img
                                    width="64"
                                    height="64"
                                    src={this.props.sender.tab.favIconUrl}
                                />
                                <div>
                                    <Typography body2>
                                        {initiatorHostname ? `${initiatorHostname}` : ''}
                                    </Typography>
                                </div>
                            </div>

                            <div class="description">
                                <Typography headline6>{`${
                                    this.props.sender.tab.title
                                } would like to connect to your wallet.`}</Typography>
                            </div>
                            <div class="security-description">
                                <Typography caption>
                                    This site is requesting access to a{' '}
                                    {capitalize(this.props.params.blockchain)} account from your
                                    wallet. Always make sure you trust the sites you interact with
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
                                <Select.Item selected value={this.props.params.blockchain}>
                                    {this.props.params.blockchain}
                                </Select.Item>
                            </Select>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12}>
                            <Select
                                className="select account"
                                hintText="Account"
                                outlined
                                disabled={
                                    (this.accounts[this.props.params.blockchain] || []).length === 1
                                }
                                onChange={(e: any) => {
                                    const selectedAccountAddress = e.target.value;

                                    this.setState({
                                        selectedAccountAddress
                                    });
                                }}
                            >
                                {(this.props.accounts || []).map(address => (
                                    <Select.Item
                                        value={address}
                                        selected={address === this.state.selectedAccountAddress}
                                    >
                                        {address.substr(0, 7)}...{address.substr(-5)}
                                    </Select.Item>
                                ))}
                            </Select>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell desktopCols={6} tabletCols={4} phoneCols={2}>
                            <Button
                                ripple
                                raised
                                onClick={() => {
                                    window.close();
                                }}
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
                                onClick={this.onConfirmClick}
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

    @bind
    public async onConfirmClick() {
        this.sendResult(this.props.currentNetworkId, this.state.selectedAccountAddress);
    }

    public async sendResult(networkId, address) {
        try {
            await getPlugins().confirmationScreen.setConfirmationScreenResult(
                this.props.id,
                Response.resolve({
                    networkId,
                    address
                })
            );
        } catch {
            /* */
        }
        window.close();
    }
}
