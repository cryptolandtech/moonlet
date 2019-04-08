import { h, Component } from 'preact';
import Select from 'preact-material-components/Select';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import TextField from 'preact-material-components/TextField';
import Button from 'preact-material-components/Button';
import LayoutGrid from 'preact-material-components/LayoutGrid';

import { bind } from 'bind-decorator';
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
}

export class CreateAccountTabAdd extends Component<IProps, IState> {
    private blockchainSelectRef;

    constructor(props) {
        super(props);

        this.state = {
            blockchain: undefined,
            blockchainError: false,
            accountName: ``,
            accountNameError: false
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
        if (this.state.blockchain && this.state.accountName) {
            this.setState({
                blockchainError: false,
                accountNameError: false
            });

            const account = await getWalletProvider().createAccount(
                this.state.blockchain,
                this.state.accountName
            );
            this.props.syncWallet();
            route(`/account/${this.state.blockchain}/${account.address}`, true);
        } else {
            this.setState({
                blockchainError: !!!this.state.blockchain,
                accountNameError: !!!this.state.accountName
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
                            maxLength={30}
                            onChange={(e: any) => this.setState({ accountName: e.target.value })}
                        />
                        {this.state.accountNameError && (
                            <p class="helper-text">
                                {translate('CreateAccountPage.accountNameError')}
                            </p>
                        )}
                    </LayoutGrid.Cell>
                    <LayoutGrid.Cell cols={12}>
                        <Button ripple raised secondary onClick={this.onCreateClick}>
                            {translate('App.labels.create')}
                        </Button>
                    </LayoutGrid.Cell>
                </LayoutGrid.Inner>
            </LayoutGrid>
        );
    }
}
