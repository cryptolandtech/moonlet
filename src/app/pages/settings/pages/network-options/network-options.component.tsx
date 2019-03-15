import { h, Component } from 'preact';
import { Translate } from '../../../../components/translate/translate.component';
import IconButton from 'preact-material-components/IconButton';
import './network-options.scss';
import { IUserPreferences } from '../../../../data/user-preferences/state';
import { Button } from 'preact-material-components/Button';
import { timingSafeEqual } from 'crypto';
import { bind } from 'bind-decorator';
import Dialog from 'preact-material-components/Dialog';
import List from 'preact-material-components/List';
import { ListItem } from '../../../../components/list-item/list-item.component';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { translate } from '../../../../utils/translate';
import { BLOCKCHAIN_INFO } from '../../../../utils/blockchain/blockchain-info';

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
    private switchRef;
    private switchDialogRef;

    public componentDidMount() {
        this.switchRef.MDComponent.listen('MDCIconButtonToggle:change', this.onSwitchChange);
        this.switchRef.MDComponent.on = this.props.userPreferences.testNet;
    }

    public componentWillUnmount() {
        this.switchRef.MDComponent.unlisten('MDCIconButtonToggle:change', this.onSwitchChange);
    }

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

    @bind
    public onSwitchChange(e) {
        this.props.toggleTestNet(e.detail.isOn);
        Object.keys(BLOCKCHAIN_INFO).map(blockchain => {
            this.props.switchNetwork(
                blockchain as Blockchain,
                this.getSelectedNetworkId(blockchain, e.detail.isOn),
                !e.detail.isOn
            );
        });
        if (e.detail.isOn) {
            this.switchDialogRef.MDComponent.show();
        }
    }

    public render() {
        return (
            <div class="network-options-page">
                <div class="switcher">
                    <Translate
                        className={`mainnet ${this.props.userPreferences.testNet ? '' : 'active'}`}
                        text="NetworkOptionsPage.mainnet"
                    />
                    <IconButton ref={r => (this.switchRef = r)}>
                        <IconButton.Icon>toggle_off</IconButton.Icon>
                        <IconButton.Icon on>toggle_on</IconButton.Icon>
                    </IconButton>
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
                    onCancel={() => {
                        this.switchRef.MDComponent.on = false;
                        this.props.toggleTestNet(false);
                    }}
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
