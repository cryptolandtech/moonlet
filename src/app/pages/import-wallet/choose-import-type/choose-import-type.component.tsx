import { h, Component } from 'preact';
import Button from 'preact-material-components/Button';

import './choose-import-type.scss';
import { GoogleDriveProvider } from '../../../utils/cloud-storage/google-drive-provider';
import { isCloudProviderConnected } from '../../../utils/backup';
import { route } from 'preact-router';
import { Loader } from '../../../components/material-components/loader/loader.component';
import { translate } from '../../../utils/translate';

export enum ImportType {
    MNEMONIC = 'MNEMONIC',
    GOOGLE_DRIVE = 'GOOGLE_DRIVE'
}

interface IState {
    googleDriveLoading: boolean;
}

export class ChooseImportType extends Component<{}, IState> {
    constructor(props) {
        super(props);

        this.state = {
            googleDriveLoading: false
        };
    }
    public render() {
        return (
            <div class="import-wallet-choose-import-type">
                <div>
                    <Button raised ripple secondary href={`/import-wallet/${ImportType.MNEMONIC}`}>
                        <Button.Icon>lock</Button.Icon>
                        {translate('ImportWalletPage.chooseImportType.restoreUsingSecret')}
                    </Button>
                </div>
                <div class="divider" />
                <div>
                    <Button
                        raised
                        ripple
                        secondary
                        onClick={async () => {
                            this.setState({ googleDriveLoading: true });
                            try {
                                const gDrive = new GoogleDriveProvider();
                                const connected = await isCloudProviderConnected(gDrive);
                                if (!connected) {
                                    await gDrive.authProvider.renewAuthToken();
                                }
                                this.setState({ googleDriveLoading: false });
                                route(`/import-wallet/${ImportType.GOOGLE_DRIVE}`);
                            } catch {
                                this.setState({ googleDriveLoading: false });
                            }
                        }}
                    >
                        {this.state.googleDriveLoading && (
                            <Loader width="24px" height="24px" className="button-logo" />
                        )}
                        {!this.state.googleDriveLoading && (
                            <img
                                src="/assets/icons/cloud/google-drive-flat-icon.svg"
                                class="button-logo"
                            />
                        )}
                        {translate('ImportWalletPage.chooseImportType.restoreFrom', {
                            provider: 'Google Drive'
                        })}
                    </Button>
                </div>

                <div>
                    <Button raised secondary className="disabled">
                        <img src="/assets/icons/cloud/dropbox-flat-icon.svg" class="button-logo" />
                        {translate('ImportWalletPage.chooseImportType.restoreFrom', {
                            provider: 'Dropbox'
                        })}
                    </Button>
                </div>

                <div>
                    <Button raised secondary className="disabled">
                        <img
                            src="/assets/icons/cloud/one-drive-flat-icon.svg"
                            class="button-logo"
                        />
                        {translate('ImportWalletPage.chooseImportType.restoreFrom', {
                            provider: 'One Drive'
                        })}
                    </Button>
                </div>
            </div>
        );
    }
}
