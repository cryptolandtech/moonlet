import { h, Component } from 'preact';
import QRCode from 'qrcode.react';
import Card from 'preact-material-components/Card';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';

import './receive.scss';
import { Translate } from '../../components/translate/translate.component';
import { GenericAccount } from 'moonlet-core/src/core/account';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';

interface IProps {
    account: GenericAccount;
}

export class ReceivePage extends Component<IProps, any> {
    private textareaElement: HTMLTextAreaElement;

    public render() {
        return (
            <LayoutGrid className="receive-page">
                <Card className="card">
                    <QRCode
                        className="qr-image"
                        value={this.props.account.address}
                        renderAs="svg"
                    />
                    <TextareaAutoSize
                        value={this.props.account.address}
                        noBorder
                        className="address"
                        inputRef={el => (this.textareaElement = el)}
                    />
                    <Button onClick={() => this.copyToClipboard()}>
                        <Translate text="ReceivePage.copyToClipboard" />
                    </Button>
                </Card>
            </LayoutGrid>
        );
    }

    private copyToClipboard() {
        this.textareaElement.select();
        document.execCommand('copy');
    }
}
