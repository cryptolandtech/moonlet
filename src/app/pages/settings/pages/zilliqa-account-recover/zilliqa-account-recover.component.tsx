import { h, Component } from 'preact';

import Card from 'preact-material-components/Card';
import Typography from 'preact-material-components/Typography';
import { Copy } from '../../../../components/copy/copy.component';

import HDKey from 'moonlet-core/src/core/utils/hdkey';
import Mnemonic from 'moonlet-core/src/core/utils/mnemonic';
import Wallet from 'moonlet-core/src/core/wallet';
import { ZilliqaAccountUtils } from 'moonlet-core/src/blockchain/zilliqa/account-utils';

import './zilliqa-account-recover.scss';
import { getWalletProvider } from '../../../../app-context';
import { Translate } from '../../../../components/translate/translate.component';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { route } from 'preact-router';
import Button from 'preact-material-components/Button';
import { translate } from '../../../../utils/translate';

interface IProps {
    syncWallet: () => any;
}
interface IState {
    hdKey: HDKey;
}
export class ZilliqaAccountRecover extends Component<IProps, IState> {
    public accountUtil: ZilliqaAccountUtils = new ZilliqaAccountUtils();

    constructor(props) {
        super(props);
        getWalletProvider()
            .getWallet()
            .then((wallet: Wallet) => {
                this.setState({
                    hdKey: HDKey.fromMasterSeed(Mnemonic.mnemonicToSeed(wallet.mnemonics))
                });
            });
    }

    public getAccount(hdCoinValue) {
        const HDRootKey = this.state.hdKey.derivePath(`m/44'/${hdCoinValue}'/0'/0`);
        const key = HDRootKey.deriveChild(0);
        return {
            address: '0x' + this.accountUtil.privateToAddress(key.getPrivateKey()).toString('hex'),
            privateKey: '0x' + key.getPrivateKeyString()
        };
    }

    public async importAccount(privateKey) {
        const account = await getWalletProvider().importAccount(
            Blockchain.ZILLIQA,
            privateKey,
            'Old Account'
        );
        await this.props.syncWallet();
        route(`/dashboard`, true);
    }

    public render() {
        return (
            <div className="zilliqa-account-recover-page">
                <Translate text="ZilliqaAccountRecoverPage.text" className="text" />
                {this.state.hdKey &&
                    [10018, 1, 8888].map(hdCoinValue => {
                        const account = this.getAccount(hdCoinValue);
                        return (
                            <Card>
                                <Translate text="App.labels.address" className="label" />
                                <Copy text={account.address}>
                                    <Typography headline6 class="address">
                                        {account.address}
                                    </Typography>
                                </Copy>

                                <Button
                                    ripple
                                    raised
                                    secondary
                                    onClick={() => this.importAccount(account.privateKey)}
                                >
                                    {translate('App.labels.import')}
                                </Button>
                            </Card>
                        );
                    })}
            </div>
        );
    }
}
