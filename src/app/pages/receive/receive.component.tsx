import { h, Component } from 'preact';
import QRCode from 'qrcode.react';
import Card from 'preact-material-components/Card';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';

import './receive.scss';
import { Translate } from '../../components/translate/translate.component';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';
import { AccountCard } from '../account/components/account-card/account-card.component';
import { AddressCard } from '../account/components/address-card/address-card.component';

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
