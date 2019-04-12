import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import Typography from 'preact-material-components/Typography';
import { Translate } from '../../components/translate/translate.component';
import { Copy } from '../../components/copy/copy.component';

import './support-us.scss';

const ETH_ADDRESS = '0x8892827ed350AE88F580F023066770255af24453';
const BTC_ADDRESS = '3DuBPzk88D73PBwHAPMBEqDHqRRJy8kBXn';

export class SupportUsPage extends Component {
    public render() {
        return (
            <div class="support-us-page">
                <Translate text="SupportUsPage.text" headline6 className="text center-text" />
                <Card>
                    <Typography headline6>Ethereum</Typography>
                    <Copy text={ETH_ADDRESS}>
                        <Typography headline6 class="address">
                            {ETH_ADDRESS}
                        </Typography>
                    </Copy>
                </Card>
                <Card>
                    <Typography headline6>Bitcoin</Typography>
                    <Copy text={BTC_ADDRESS}>
                        <Typography headline6 class="address">
                            {BTC_ADDRESS}
                        </Typography>
                    </Copy>
                </Card>
            </div>
        );
    }
}
