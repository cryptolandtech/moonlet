import { h, Component } from 'preact';
import QRCode from 'qrcode.react';

import { AccountCard } from '../account/components/account-card/account-card.component';
import AddressCard from '../account/components/address-card/address-card.container';

import './receive.scss';

interface IProps {
    account: any;
}

export class ReceivePage extends Component<IProps, any> {
    private textareaElement: HTMLTextAreaElement;

    public render() {
        return (
            <div class="receive-page">
                <AccountCard account={this.props.account} />
                <AddressCard account={this.props.account} />
                <QRCode className="qr-image" value={this.props.account.address} renderAs="svg" />
            </div>
        );
    }

    private copyToClipboard() {
        this.textareaElement.select();
        document.execCommand('copy');
    }
}
