import { h, Component } from 'preact';
import {
    IAddressOptions,
    ILedgerHwPlugin
} from '../../../../../../plugins/ledger-hw/iledger-hw-plugin';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import { BLOCKCHAIN_INFO } from '../../../../../../utils/blockchain/blockchain-info';
import Select from 'preact-material-components/Select';
import { translate } from '../../../../../utils/translate';
import { Translate } from '../../../../../components/translate/translate.component';
import { capitalize } from '../../../../../utils/string';
import { Loader } from '../../../../../components/material-components/loader/loader.component';
import { getPlugins } from '../../../../../app-context';
import List from 'preact-material-components/List';
import { Button } from 'preact-material-components/Button';
import LinearProgress from 'preact-material-components/LinearProgress';

interface IProps {
    onAccountSelected: (blockchain: Blockchain, address: string, options: IAddressOptions) => any;
}

interface IState {
    blockchain: Blockchain;
    derivationPath: string;
    deviceConnected: boolean;
    addresses: Array<{
        address: string;
        index: number;
        derivationIndex: number;
        path: string;
        balance: string;
    }>;
}

export class LedgerDeviceScreen extends Component<IProps, IState> {
    private blockchainSelectRef;
    private derivationPathSelectRef;
    private ledger: ILedgerHwPlugin = getPlugins().ledgerHw;
    private addressFetcher;

    constructor(props: IProps) {
        super(props);

        this.state = {
            blockchain: undefined,
            derivationPath: undefined,
            deviceConnected: false,
            addresses: []
        };
    }

    public componentDidMount() {
        if (this.blockchainSelectRef && this.blockchainSelectRef.base) {
            const selectElement = this.blockchainSelectRef.base.querySelector('select');

            if (selectElement) {
                selectElement.value = this.state.blockchain;
            }
        }

        if (this.derivationPathSelectRef && this.derivationPathSelectRef.base) {
            const selectElement = this.derivationPathSelectRef.base.querySelector('select');

            if (selectElement) {
                selectElement.value = this.state.derivationPath;
            }
        }
    }

    public selectedBlockchain(blockchain: Blockchain) {
        const derivationPaths =
            BLOCKCHAIN_INFO[blockchain].hardwareWallet.ledger.derivationPaths || [];
        this.setState({
            blockchain,
            derivationPath: derivationPaths[0],
            deviceConnected: false,
            addresses: []
        });

        // detect when device is connected
        const appName = BLOCKCHAIN_INFO[blockchain].hardwareWallet.ledger.appName;
        this.ledger.detectAppOpen(appName).then(() => {
            this.setState({ deviceConnected: true });
            this.fetchAddresses();
        });
    }

    public async selectedDerivationPath(derivationPath) {
        this.setState({ derivationPath, addresses: [] });

        if (this.addressFetcher) {
            await this.addressFetcher.stop();
        }
        this.fetchAddresses();
        this.forceUpdate();
    }

    public fetchAddresses() {
        const appName = BLOCKCHAIN_INFO[this.state.blockchain].hardwareWallet.ledger.appName;
        this.addressFetcher = this.ledger.fetchAddresses(
            appName,
            { index: 0, derivationIndex: 0, path: this.state.derivationPath },
            address => {
                this.setState({
                    addresses: [...this.state.addresses, { ...address, balance: undefined }]
                });
            }
        );
    }

    public renderInstructions() {
        if (this.state.blockchain && !this.state.deviceConnected) {
            return (
                <LayoutGrid.Cell cols={12} className="center-text">
                    <Loader width="40px" height="40px" />
                    <Translate body1 text="CreateAccountPage.sections.connect.ledger.waiting" />
                    <Translate
                        body2
                        text="CreateAccountPage.sections.connect.ledger.instructions"
                        params={{ appName: capitalize(this.state.blockchain) }}
                    />
                </LayoutGrid.Cell>
            );
        }

        return null;
    }

    public renderDerivationPathSelector() {
        if (this.state.blockchain && this.state.deviceConnected) {
            const derivationPaths =
                BLOCKCHAIN_INFO[this.state.blockchain].hardwareWallet.ledger.derivationPaths || [];

            if (derivationPaths.length > 0) {
                return (
                    <LayoutGrid.Cell cols={12}>
                        <Select
                            ref={ref => (this.derivationPathSelectRef = ref)}
                            hintText={translate('CreateAccountPage.sections.connect.ledger.hdPath')}
                            onChange={(e: any) => this.selectedDerivationPath(e.target.value)}
                            selectedIndex={
                                derivationPaths.indexOf(
                                    this.state.derivationPath || derivationPaths[0]
                                ) + 1
                            }
                        >
                            {derivationPaths.map(path => (
                                <Select.Item value={path}>
                                    {translate(
                                        `CreateAccountPage.sections.connect.ledger.paths.${path}`
                                    )}
                                </Select.Item>
                            ))}
                        </Select>
                        <Translate
                            body2
                            text="CreateAccountPage.sections.connect.ledger.derivationPathInfo"
                        />
                    </LayoutGrid.Cell>
                );
            }
        }
        return null;
    }

    public renderAccountsList() {
        if (this.state.blockchain && this.state.deviceConnected) {
            return (
                <LayoutGrid.Cell cols={12}>
                    <Translate
                        headline6
                        text="CreateAccountPage.sections.connect.ledger.selectAccount"
                    />
                    {this.addressFetcher.isInProgress() && <LinearProgress indeterminate />}
                    <List>
                        <List.Divider />
                        {this.state.addresses.map(acc => [
                            <List.Item
                                className="pointer"
                                onClick={() =>
                                    this.props.onAccountSelected(
                                        this.state.blockchain,
                                        acc.address,
                                        acc
                                    )
                                }
                            >
                                {acc.index + 1}. {acc.address.substr(0, 7)}...
                                {acc.address.substr(-5)}
                            </List.Item>,
                            <List.Divider />
                        ])}
                    </List>
                    {!this.addressFetcher.isInProgress() && (
                        <Button
                            raised
                            secondary
                            ripple
                            onClick={() => {
                                this.addressFetcher.more();
                                this.forceUpdate();
                            }}
                        >
                            {translate('App.labels.more')}
                        </Button>
                    )}
                </LayoutGrid.Cell>
            );
        }
        return null;
    }

    public render() {
        return (
            <LayoutGrid>
                <LayoutGrid.Inner>
                    <LayoutGrid.Cell cols={12}>
                        <Select
                            ref={ref => (this.blockchainSelectRef = ref)}
                            hintText={translate('App.labels.blockchain')}
                            onChange={(e: any) => this.selectedBlockchain(e.target.value)}
                        >
                            {Object.keys(BLOCKCHAIN_INFO)
                                .filter(blockchain => {
                                    const bi = BLOCKCHAIN_INFO[blockchain];
                                    return bi.hardwareWallet && bi.hardwareWallet.ledger;
                                })
                                .map(blockchain => (
                                    <Select.Item value={blockchain}>{blockchain}</Select.Item>
                                ))}
                        </Select>
                    </LayoutGrid.Cell>

                    {this.renderInstructions()}
                    {this.renderDerivationPathSelector()}
                    {this.renderAccountsList()}
                </LayoutGrid.Inner>
            </LayoutGrid>
        );
    }
}
