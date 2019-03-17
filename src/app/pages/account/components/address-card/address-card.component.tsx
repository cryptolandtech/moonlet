import { h, Component } from 'preact';

import './address-card.scss';
import Card from 'preact-material-components/Card';
import { Translate } from '../../../../components/translate/translate.component';
import Menu from 'preact-material-components/Menu';
import Icon from 'preact-material-components/Icon';
import List from 'preact-material-components/List';
import Typography from 'preact-material-components/Typography';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Snackbar from 'preact-material-components/Snackbar';
import { translate } from '../../../../utils/translate';
import { Copy } from '../../../../components/copy/copy.component';

interface IProps {
    account: any;
    showMenu?: boolean;
}

export class AddressCard extends Component<IProps> {
    private addressMenu;
    private bar;

    public componentDidMount() {
        this.addressMenu.MDComponent.setFixedPosition(true);
    }

    public render() {
        const account = this.props.account;
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
                                {/* <Menu.Item><Translate text="AccountPage.discardAddress"/><List.ItemMeta>delete_forever</List.ItemMeta></Menu.Item> */}
                            </Menu>
                        </Menu.Anchor>
                    )}
                </div>

                <Copy text={this.props.account.address}>
                    <Typography headline5 class="address">
                        {this.props.account.address}
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
