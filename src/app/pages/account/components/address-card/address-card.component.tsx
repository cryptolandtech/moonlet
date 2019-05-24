import { h, Component } from 'preact';

import './address-card.scss';
import Card from 'preact-material-components/Card';
import { Translate } from '../../../../components/translate/translate.component';
import Menu from 'preact-material-components/Menu';
import Icon from 'preact-material-components/Icon';
import List from 'preact-material-components/List';
import Typography from 'preact-material-components/Typography';
import { Copy } from '../../../../components/copy/copy.component';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { GenericAccount, AccountType } from 'moonlet-core/src/core/account';
import { route } from 'preact-router';
import { DeviceScreenSize } from '../../../../types';
import Dialog from 'preact-material-components/Dialog';
import { translate } from '../../../../utils/translate';
import { BLOCKCHAIN_INFO } from '../../../../../utils/blockchain/blockchain-info';

interface IProps {
    account: GenericAccount;
    showMenu?: boolean;

    accounts: GenericAccount[];
    screenSize: DeviceScreenSize;
    removeAccount: (blockchain: Blockchain, address: string) => any;
}

export class AddressCard extends Component<IProps> {
    private addressMenu;
    private discardDialogRef;

    public componentDidMount() {
        if (this.addressMenu) {
            this.addressMenu.MDComponent.setFixedPosition(true);
        }
    }

    public getExplorerMenuItem() {
        if (this.props.account.node.network.explorerAccountPattern) {
            const href = this.props.account.node.network.explorerAccountPattern.replace(
                '{addr}',
                this.props.account.address.replace(/^0x/, '')
            );

            return (
                <List.LinkItem href={href} onClick={() => window.open(href)} target="_blank">
                    <Translate
                        text="AccountPage.viewOn"
                        params={{ explorer: new URL(href).hostname }}
                    />
                    <List.ItemMeta>launch</List.ItemMeta>
                </List.LinkItem>
            );
        }
        return null;
    }

    public render() {
        const account = this.props.account;
        const address = account.address;
        const pagesConfig = BLOCKCHAIN_INFO[account.node.blockchain].pagesConfig;
        const multipleFormats =
            pagesConfig &&
            pagesConfig.accountPage &&
            pagesConfig.accountPage.multipleAddressFormats;

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
                                {multipleFormats && (
                                    <List.LinkItem
                                        href={`/reveal/addressFormat/${account.node.blockchain}/${
                                            account.address
                                        }`}
                                    >
                                        <Translate text="AccountPage.addressFormat" />
                                        <List.ItemMeta>format_align_justify</List.ItemMeta>
                                    </List.LinkItem>
                                )}
                                {account.type !== AccountType.HARDWARE && [
                                    <List.LinkItem
                                        href={`/reveal/privateKey/${account.node.blockchain}/${
                                            account.address
                                        }`}
                                    >
                                        <Translate text="AccountPage.revealPrivateKey" />
                                        <List.ItemMeta>vpn_key</List.ItemMeta>
                                    </List.LinkItem>,
                                    <List.LinkItem
                                        href={`/reveal/publicKey/${account.node.blockchain}/${
                                            account.address
                                        }`}
                                    >
                                        <Translate text="AccountPage.revealPublicKey" />
                                        <List.ItemMeta>remove_red_eye</List.ItemMeta>
                                    </List.LinkItem>
                                ]}
                                {this.getExplorerMenuItem()}
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
                {multipleFormats && (
                    <Typography
                        body2
                        className="error-text"
                        style="margin-top: 10px;font-size: 12px;"
                    >
                        This is a new address format.{' '}
                        <a
                            href={`/reveal/addressFormat/${account.node.blockchain}/${
                                account.address
                            }`}
                            class="secondary-color"
                        >
                            Check address format >>
                        </a>
                    </Typography>
                )}
            </Card>
        );
    }
}
