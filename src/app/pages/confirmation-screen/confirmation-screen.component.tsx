import { h, Component } from 'preact';
import { IConfirmationScreen } from '../../data/page-config/state';
import { ConfirmationScreenType } from '../../../plugins/confirmation-screen/iconfirmation-screen-plugin';
import AccountAccessPage from './screens/account-access/account-access.container';
import TransactionConfirmationPage from './screens/transaction-confirmation/transaction-confirmation.container';

interface IProps {
    confirmationScreen: IConfirmationScreen;
}

export class ConfirmationScreenPage extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (this.props.confirmationScreen) {
            switch (this.props.confirmationScreen.type) {
                case ConfirmationScreenType.ACCOUNT_ACCESS:
                    return <AccountAccessPage {...this.props.confirmationScreen} />;
                case ConfirmationScreenType.TRANSACTION_CONFIRMATION:
                    return <TransactionConfirmationPage {...this.props.confirmationScreen} />;
            }
        }

        return '';
    }
}
