import { h, Component } from 'preact';
import { Translate } from '../../../../components/translate/translate.component';

import './disclaimer.scss';

export class DisclaimerPage extends Component {
    public render() {
        return (
            <div class="disclaimer-page">
                <p class="strong-text">
                    <Translate text="DisclaimerPage.p1" />
                </p>
                <p>
                    <Translate text="DisclaimerPage.p21" />
                    <Translate className="strong-text" text="DisclaimerPage.p22" />
                </p>
                <p>
                    <Translate className="strong-text" text="DisclaimerPage.p31" />
                    <Translate text="DisclaimerPage.p32" />
                </p>
                <p>
                    <Translate className="strong-text" text="DisclaimerPage.p41" />
                    <br />
                    <Translate text="DisclaimerPage.p42" />
                    <br />
                    <Translate text="DisclaimerPage.p43" />
                    <br />
                    <Translate text="DisclaimerPage.p44" />
                    <br />
                    <Translate className="strong-text" text="DisclaimerPage.p45" />
                </p>
            </div>
        );
    }
}
