import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../../../components/textarea-auto-size/textarea-auto-size.components';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';

import './sign-message.scss';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { translate } from '../../../../utils/translate';
import { Translate } from '../../../../components/translate/translate.component';
import { Runtime } from 'webextension-polyfill-ts';
import { Response } from '../../../../../utils/response';
import { getPlugins } from '../../../../app-context';
import TextField from 'preact-material-components/TextField';

interface IProps {
    id: string;
    params: {
        blockchain: Blockchain;
        fromAddress: string;
        data: string;
    };
    sender: Runtime.MessageSender;

    testNet: boolean;
    currentNetworkName: string;
    currentNetworkId: number;
    accounts: string[];
    walletReady: boolean;
}

export class SignMessagePage extends Component<IProps> {
    public url: URL = new URL(location.href);

    public render() {
        if (!this.props.walletReady) {
            return '';
        }

        return (
            <div class="sign-message-page">
                <div class={`current-network ${this.props.testNet ? 'testnet' : ''}`}>
                    {this.props.currentNetworkName}
                </div>
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12} className="center-text">
                            <Translate body1 text={`ConfirmationScreen.SignMessage.signMessage`} />
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell cols={12}>
                            <TextareaAutoSize
                                outlined
                                disabled
                                label={translate('ConfirmationScreen.SignMessage.signWith')}
                                value={this.props.params.fromAddress}
                            />
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell cols={12}>
                            <TextField
                                class="details-box"
                                readOnly
                                textarea={true}
                                label={translate('App.labels.data')}
                                value={this.props.params.data}
                            />
                        </LayoutGrid.Cell>

                        <LayoutGrid.Cell desktopCols={6} tabletCols={4} phoneCols={2}>
                            <Button
                                ripple
                                raised
                                onClick={() => this.sendResult(false)}
                                className="button reject"
                            >
                                <Translate text="App.labels.cancel" />
                            </Button>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell
                            desktopCols={6}
                            tabletCols={4}
                            phoneCols={2}
                            className="right-text"
                        >
                            <Button
                                ripple
                                raised
                                secondary
                                onClick={() => this.sendResult(true)}
                                className="button confirm"
                            >
                                <Translate text="App.labels.sign" />
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }

    public async sendResult(confirmed) {
        try {
            if (confirmed) {
                await getPlugins().confirmationScreen.setConfirmationScreenResult(
                    this.props.id,
                    Response.resolve()
                );
            }
        } catch {
            /* */
        }
        window.close();
    }
}
