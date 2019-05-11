import { h, Component } from 'preact';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { IAccountBalance, IAccountsBalances } from '../../data/wallet/state';
import Currency from '../currency/currency.container';
import { BLOCKCHAIN_INFO } from '../../../utils/blockchain/blockchain-info';
import { formatAmount } from '../../../utils/blockchain/utils';

interface IProps {
    blockchain: Blockchain;
    address: string;
    hideCurrency: boolean;
    convert: boolean;

    balances: IAccountsBalances;
    updateBalance: (blockchain: Blockchain, address: string) => any;
}

export class Balance extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.updateBalance();
    }

    // componentDidMount() {
    //     this.updateBalance;
    // }

    public componentDidUpdate(prevProps: IProps, prevState, prevContext) {
        if (
            prevProps.blockchain !== this.props.blockchain ||
            prevProps.address !== this.props.address
        ) {
            this.updateBalance();
        }
    }

    public updateBalance() {
        const props = this.props;
        if (
            props.balances &&
            props.balances[props.blockchain] &&
            props.balances[props.blockchain][props.address] &&
            !props.balances[props.blockchain][props.address].loading
        ) {
            // balance available
            if (Date.now() - props.balances[props.blockchain][props.address].lastUpdate > 60000) {
                // balance is old, update it
                props.updateBalance(props.blockchain, props.address);
            }
        } else {
            props.updateBalance(props.blockchain, props.address);
        }
    }

    public render(props: IProps) {
        let balance: IAccountBalance = { loading: true, amount: undefined, lastUpdate: undefined };
        if (
            props.balances &&
            props.balances[props.blockchain] &&
            props.balances[props.blockchain][props.address]
        ) {
            balance = props.balances[props.blockchain][props.address];
        }

        return (
            <span>
                {balance.amount && (
                    <Currency
                        amount={parseFloat(
                            formatAmount(props.blockchain, balance.amount.toString())
                        )}
                        currency={BLOCKCHAIN_INFO[props.blockchain].coin}
                        hideCurrency={props.hideCurrency}
                        convert={props.convert}
                    />
                )}
                {!balance.amount && '...'}
            </span>
        );
    }
}
