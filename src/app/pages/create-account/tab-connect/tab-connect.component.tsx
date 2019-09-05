import { h, Component } from 'preact';
import { BLOCKCHAIN_INFO } from '../../../../utils/blockchain/blockchain-info';
import { Card } from 'preact-material-components/Card';

import './tab-connect.scss';
import { LedgerDeviceScreen } from './devices/ledger/ledger.component';
import { GenericAccount, HWDevice } from 'moonlet-core/src/core/account';
import { getWalletPlugin } from '../../../app-context';
import { Navigation } from '../../../utils/navigation';

interface IProps {
    accounts: GenericAccount[];

    syncWallet: () => any;
}

enum Screen {
    CHOOSE_DEVICE_TYPE = 'CHOOSE_DEVICE_TYPE',
    DEVICE_SCREEN = 'DEVICE_SCREEN'
}

interface IState {
    screen: Screen;
    device: string;
}

export class CreateAccountTabConnect extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            screen: Screen.CHOOSE_DEVICE_TYPE,
            device: undefined
        };
    }

    public goTo(nextScreen, state) {
        this.setState({
            ...state,
            screen: nextScreen
        });
    }

    public renderChooseDeviceTypeScreen() {
        const availableDevices = [];
        for (const blockchain of Object.keys(BLOCKCHAIN_INFO)) {
            const bi = BLOCKCHAIN_INFO[blockchain];
            if (bi.hardwareWallet) {
                for (const device of Object.keys(bi.hardwareWallet)) {
                    if (bi.hardwareWallet[device] && availableDevices.indexOf(device) < 0) {
                        availableDevices.push(device);
                    }
                }
            }
        }

        return availableDevices.map(device => (
            <Card class="device-card" onClick={() => this.goTo(Screen.DEVICE_SCREEN, { device })}>
                <img class={device} src={`/assets/icons/hw/${device}.svg`} />
            </Card>
        ));
    }

    public renderDeviceScreen() {
        switch (this.state.device) {
            case 'ledger':
                return (
                    <LedgerDeviceScreen
                        accounts={this.props.accounts}
                        onAccountSelected={(blockchain, accountName, address, pubKey, options) => {
                            getWalletPlugin().importHWAccount(
                                HWDevice.LEDGER,
                                blockchain,
                                accountName,
                                options.path,
                                address,
                                pubKey,
                                options.index,
                                options.derivationIndex
                            );
                            this.props.syncWallet();
                            Navigation.goTo(`/account/${blockchain}/${address}`, true);
                        }}
                    />
                );
        }
    }

    public render() {
        let content = null;
        switch (this.state.screen) {
            case Screen.CHOOSE_DEVICE_TYPE:
                content = this.renderChooseDeviceTypeScreen();
                break;
            case Screen.DEVICE_SCREEN:
                content = this.renderDeviceScreen();
                break;
        }

        return <div class="create-account-tab-connect">{content}</div>;
    }
}
