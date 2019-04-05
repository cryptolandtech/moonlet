import { h, Component } from 'preact';
import Select from 'preact-material-components/Select';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import { bind } from 'bind-decorator';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import { getWalletProvider } from '../../../app-context';
import { route } from 'preact-router';
import { translate } from '../../../utils/translate';

interface IProps {
    accounts: any[];

    syncWallet: () => any;
}

interface IState {
    blockchain: Blockchain;
    blockchainError: boolean;
    accountName: string;
    accountNameError: boolean;
    privateKey: string;
    privateKeyError: boolean;
}

export class CreateAccountTabImport extends Component<IProps, IState> {
    private blockchainSelectRef;

    constructor(props) {
        super(props);

        this.state = {
            blockchain: undefined,
            blockchainError: false,
            accountName: ``,
            accountNameError: false,
            privateKey: '',
            privateKeyError: false
        };
    }

    public componentDidMount() {
        if (this.blockchainSelectRef && this.blockchainSelectRef.base) {
            const selectElement = this.blockchainSelectRef.base.querySelector('select');

            if (selectElement) {
                selectElement.value = this.state.blockchain;
            }
        }
    }

    @bind
    public async onCreateClick() {
        if (this.state.blockchain && this.state.accountName && this.state.privateKey) {
            this.setState({
                blockchainError: false,
                accountNameError: false,
                privateKeyError: false
            });

            try {
                const account = await getWalletProvider().importAccount(
                    this.state.blockchain,
                    this.state.privateKey,
                    this.state.accountName
                );
                this.props.syncWallet();
                route(`/account/${this.state.blockchain}/${account.address}`, true);
            } catch (e) {
                this.setState({
                    privateKeyError: true
                });
            }
        } else {
            this.setState({
                blockchainError: !!!this.state.blockchain,
                accountNameError: !!!this.state.accountName,
                privateKeyError: !!!this.state.privateKey
            });
        }
    }

    public render() {
        return (
            <LayoutGrid className="create-account-tab-add-component">
                <LayoutGrid.Inner>
                    <LayoutGrid.Cell cols={12}>
                        <Select
                            ref={ref => (this.blockchainSelectRef = ref)}
                            hintText={translate('App.labels.blockchain')}
                            onChange={(e: any) => {
                                const blockchain = e.target.value;
                                const accounts = this.props.accounts.filter(
                                    acc => acc.node.blockchain === blockchain
                                );
                                this.setState({
                                    blockchain,
                                    accountName: `${translate(
                                        'App.labels.account'
                                    )} ${accounts.length + 1}`
                                });
                            }}
                        >
                            {Object.keys(BLOCKCHAIN_INFO).map(blockchain => (
                                <Select.Item value={blockchain}>{blockchain}</Select.Item>
                            ))}
                        </Select>
                        {this.state.blockchainError && (
                            <p class="helper-text">
                                {translate('CreateAccountPage.blockchainError')}
                            </p>
                        )}
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12}>
                        <TextField
                            type="text"
                            label={translate('CreateAccountPage.accountName')}
                            value={this.state.accountName}
                            onChange={(e: any) => this.setState({ accountName: e.target.value })}
                        />
                        {this.state.accountNameError && (
                            <p class="helper-text">
                                {translate('CreateAccountPage.accountNameError')}
                            </p>
                        )}
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12}>
                        <TextField
                            type="text"
                            label={translate('App.labels.privateKey')}
                            textarea={true}
                            value={this.state.privateKey}
                            onChange={(e: any) => this.setState({ privateKey: e.target.value })}
                        />
                        {this.state.privateKeyError && (
                            <p class="helper-text">
                                {translate('CreateAccountPage.privateKeyError')}
                            </p>
                        )}
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12}>
                        <Button ripple raised secondary onClick={this.onCreateClick}>
                            {translate('App.labels.import')}
                        </Button>
                    </LayoutGrid.Cell>
                </LayoutGrid.Inner>
            </LayoutGrid>
        );
    }
}
