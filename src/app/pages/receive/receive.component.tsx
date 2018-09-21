import { h, Component } from 'preact';
import QRCode from 'qrcode.react';
import Card from 'preact-material-components/Card';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Typography from 'preact-material-components/Typography';
import Button from 'preact-material-components/Button';

import './receive.scss';
import { Translate } from '../../components/translate/translate.component';

export class ReceivePage extends Component {
    public render() {
        return (
            <LayoutGrid className="receive-page">
                <Card className="card">
                    <QRCode
                        className="qr-image"
                        value="0x5FC7409B4B41E06E73BA1AA7F3127D93C76BD557"
                        renderAs="svg"
                    />
                    <Typography headline5 className="address">
                        0x5FC7409B4B41E06E73BA1AA7F3127D93C76BD557
                    </Typography>
                    <Button>
                        <Translate text="ReceivePage.copyToClipboard" />
                    </Button>
                </Card>
            </LayoutGrid>
        );
    }
}
