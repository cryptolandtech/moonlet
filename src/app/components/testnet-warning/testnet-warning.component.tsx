import { h, Component } from 'preact';

import './testnet-warning.scss';
import Icon from 'preact-material-components/Icon';
import { translate } from '../../utils/translate';
import { GenericAccount } from 'moonlet-core/src/core/account';

interface IProps {
    account: GenericAccount;
    testNet: boolean;
}

export class TestnetWarning extends Component<IProps> {
    public render() {
        const params = this.props.account
            ? {
                  blockchain: this.props.account.node.blockchain,
                  testnetName: this.props.account.node.network.name
              }
            : undefined;

        const content = (
            <div class="testnet-warning-component">
                <Icon>report_problem</Icon>
                <div class="text">
                    <span class="strong-text">{translate('App.labels.warning')}!</span>{' '}
                    {translate(
                        params
                            ? 'TestnetWarningComponent.specific'
                            : 'TestnetWarningComponent.generic',
                        params
                    )}{' '}
                    {translate('TestnetWarningComponent.goTo')}
                </div>
            </div>
        );

        return this.props.testNet ? content : null;
    }
}
