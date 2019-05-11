import { h, Component } from 'preact';
import { Translate } from '../../../../components/translate/translate.component';
import './network-options.scss';
import { IUserPreferences } from '../../../../data/user-preferences/state';
import Dialog from 'preact-material-components/Dialog';
import List from 'preact-material-components/List';
import { ListItem } from '../../../../components/list-item/list-item.component';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { translate } from '../../../../utils/translate';
import { BLOCKCHAIN_INFO } from '../../../../../utils/blockchain/blockchain-info';
import Icon from 'preact-material-components/Icon';

interface IProps {
    userPreferences: IUserPreferences;

    toggleTestNet: (v?: boolean) => any;
    switchNetwork: (blockchain: Blockchain, networkId: number, mainNet: boolean) => any;
}

const NETWORKS = {
    [Blockchain.ZILLIQA]: require('moonlet-core/src/blockchain/zilliqa/networks').default,
    [Blockchain.ETHEREUM]: require('moonlet-core/src/blockchain/ethereum/networks').default
};

export class NetworkOptionsPage extends Component<IProps> {
    private switchDialogRef;

    public getSelectedNetworkId(blockchain, testNet?: boolean) {
        testNet = typeof testNet === 'boolean' ? testNet : this.props.userPreferences.testNet;

        if (
            testNet &&
            this.props.userPreferences.networks[blockchain] &&
            this.props.userPreferences.networks[blockchain].testNet
        ) {
            return this.props.userPreferences.networks[blockchain].testNet;
        }

        if (
            !testNet &&
            this.props.userPreferences.networks[blockchain] &&
            this.props.userPreferences.networks[blockchain].mainNet
        ) {
            return this.props.userPreferences.networks[blockchain].mainNet;
        }

        return NETWORKS[blockchain].filter(n => n.mainNet === !testNet)[0].network_id;
    }

    public toggleTestNet(testNet) {
        this.props.toggleTestNet(testNet);
        Object.keys(BLOCKCHAIN_INFO).map(blockchain => {
            this.props.switchNetwork(
                blockchain as Blockchain,
                this.getSelectedNetworkId(blockchain, testNet),
                !testNet
            );
        });
    }

    public render() {
        return (
            <div class="network-options-page">
                <div class="switcher">
                    <Translate
                        className={`mainnet ${this.props.userPreferences.testNet ? '' : 'active'}`}
                        text="NetworkOptionsPage.mainnet"
                    />
                    <Icon
                        onClick={() => {
                            if (!this.props.userPreferences.testNet) {
                                this.switchDialogRef.MDComponent.show();
                            } else {
                                this.toggleTestNet(!this.props.userPreferences.testNet);
                            }
                        }}
                    >
                        {this.props.userPreferences.testNet ? 'toggle_on' : 'toggle_off'}
                    </Icon>

                    <Translate
                        className={`testnet ${this.props.userPreferences.testNet ? 'active' : ''}`}
                        text="NetworkOptionsPage.testnet"
                    />
                </div>
                <List two-line>
                    {Object.keys(NETWORKS).map(blockchain => [
                        <ListItem primaryText={blockchain} noDivider />,
                        NETWORKS[blockchain]
                            .filter(n => n.mainNet === !this.props.userPreferences.testNet)
                            .map(network => (
                                <List.LinkItem
                                    onClick={() =>
                                        this.props.switchNetwork(
                                            blockchain as Blockchain,
                                            network.network_id,
                                            !this.props.userPreferences.testNet
                                        )
                                    }
                                    className="network-list-item"
                                >
                                    <List.ItemGraphic
                                        className={
                                            this.getSelectedNetworkId(blockchain) ===
                                            network.network_id
                                                ? 'secondary-color'
                                                : ''
                                        }
                                    >
                                        {this.getSelectedNetworkId(blockchain) ===
                                        network.network_id
                                            ? 'check'
                                            : 'radio_button_unchecked'}
                                    </List.ItemGraphic>
                                    <List.TextContainer>
                                        <List.PrimaryText>{network.name}</List.PrimaryText>
                                        <List.SecondaryText>{network.url}</List.SecondaryText>
                                    </List.TextContainer>
                                </List.LinkItem>
                            ))
                    ])}
                </List>

                <Dialog
                    ref={ref => (this.switchDialogRef = ref)}
                    onAccept={() => this.toggleTestNet(true)}
                >
                    <Dialog.Header>
                        <Translate text="NetworkOptionsPage.switchDialog.title" />
                    </Dialog.Header>
                    <Dialog.Body>
                        <Translate text="NetworkOptionsPage.switchDialog.text" />
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Dialog.FooterButton cancel={true}>
                            {translate('App.labels.cancel')}
                        </Dialog.FooterButton>
                        <Dialog.FooterButton accept={true}>
                            {translate('App.labels.switch')}
                        </Dialog.FooterButton>
                    </Dialog.Footer>
                </Dialog>
            </div>
        );
    }
}
