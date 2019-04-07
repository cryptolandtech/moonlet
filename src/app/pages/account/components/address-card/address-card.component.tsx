import { h, Component } from 'preact';

import './address-card.scss';
import Card from 'preact-material-components/Card';
import { Translate } from '../../../../components/translate/translate.component';
import Menu from 'preact-material-components/Menu';
import Icon from 'preact-material-components/Icon';
import List from 'preact-material-components/List';
import Typography from 'preact-material-components/Typography';
import Snackbar from 'preact-material-components/Snackbar';
import { Copy } from '../../../../components/copy/copy.component';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { route } from 'preact-router';
import { DeviceScreenSize } from '../../../../types';
import Dialog from 'preact-material-components/Dialog';
import { translate } from '../../../../utils/translate';

interface IProps {
    account: any;
    showMenu?: boolean;

    accounts: GenericAccount[];
    screenSize: DeviceScreenSize;
    removeAccount: (blockchain: Blockchain, address: string) => any;
}

export class AddressCard extends Component<IProps> {
    private addressMenu;
    private bar;
    private discardDialogRef;

    public componentDidMount() {
        if (this.addressMenu) {
            this.addressMenu.MDComponent.setFixedPosition(true);
        }
    }

    public render() {
        const account = this.props.account;
        const address = account.address;
        return (
            <Card className="address-card">
                <div class="address-card-inner">
                    <Translate text="App.labels.address" className="address-label" />
                    {this.props.showMenu && (
                        <Menu.Anchor>
                            <Icon
                                class="address-more-icon"
                                onClick={() => {
                                    this.addressMenu.MDComponent.open = false;
                                    setTimeout(() => (this.addressMenu.MDComponent.open = true));
                                }}
                            >
                                more_vert
                            </Icon>
                            <Menu ref={m => (this.addressMenu = m)}>
                                <List.LinkItem
                                    href={`/reveal/privateKey/${account.node.blockchain}/${
                                        account.address
                                    }`}
                                >
                                    <Translate text="AccountPage.revealPrivateKey" />
                                    <List.ItemMeta>vpn_key</List.ItemMeta>
                                </List.LinkItem>
                                <List.LinkItem
                                    href={`/reveal/publicKey/${account.node.blockchain}/${
                                        account.address
                                    }`}
                                >
                                    <Translate text="AccountPage.revealPublicKey" />
                                    <List.ItemMeta>remove_red_eye</List.ItemMeta>
                                </List.LinkItem>
                                <List.LinkItem
                                    onClick={() => {
                                        setTimeout(() => {
                                            this.discardDialogRef.MDComponent.show();
                                        }, 50);
                                    }}
                                >
                                    <Translate text="AccountPage.discardAddress" />
                                    <List.ItemMeta>delete_forever</List.ItemMeta>
                                </List.LinkItem>
                            </Menu>
                        </Menu.Anchor>
                    )}
                    <Dialog
                        ref={ref => (this.discardDialogRef = ref)}
                        onAccept={() => {
                            setTimeout(() => {
                                this.props.removeAccount(account.node.blockchain, account.address);

                                if (this.props.screenSize === DeviceScreenSize.BIG) {
                                    const nextAccount = this.props.accounts.filter(
                                        acc =>
                                            !(
                                                acc.node.blockchain === account.node.blockchain &&
                                                acc.address === account.address
                                            )
                                    )[0];
                                    if (nextAccount) {
                                        route(
                                            `/account/${nextAccount.node.blockchain}/${
                                                nextAccount.address
                                            }`
                                        );
                                    } else {
                                        route(`/dashboard`);
                                    }
                                } else {
                                    route(`/dashboard`);
                                }
                            }, 50);
                        }}
                    >
                        <Dialog.Header>
                            <Translate text="AccountPage.discardDialog.title" />
                        </Dialog.Header>
                        <Dialog.Body>
                            <Translate text="AccountPage.discardDialog.text" />
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.FooterButton cancel={true}>
                                {translate('App.labels.cancel')}
                            </Dialog.FooterButton>
                            <Dialog.FooterButton accept={true}>
                                {translate('App.labels.discard')}
                            </Dialog.FooterButton>
                        </Dialog.Footer>
                    </Dialog>
                </div>

                <Copy text={this.props.account.address}>
                    <Typography headline6 class="address">
                        {address}
                    </Typography>
                </Copy>

                <Snackbar
                    ref={bar => {
                        this.bar = bar;
                    }}
                />
            </Card>
        );
    }
}
