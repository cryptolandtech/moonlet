import { h, Component } from 'preact';
import { DeviceScreenSize } from '../../../types';
import Dialog from 'preact-material-components/Dialog';
import List from 'preact-material-components/List';
import TopAppBar from 'preact-material-components/TopAppBar';
import TextField from 'preact-material-components/TextField';

import './blockchain-dialog.scss';
import Wallet from 'moonlet-core/src/core/wallet';

interface IProps {
    wallet: Wallet;

    onSelect: (value: any) => any;
}

interface IState {
    showSearch: boolean;
    searchValue: string;
}

export class NetworkSelectorBlockChainDialog extends Component<IProps, IState> {
    private scrollingDlg;

    constructor(props: IProps) {
        super(props);

        this.state = {
            showSearch: false,
            searchValue: ''
        };
    }

    public render() {
        if (!this.props.wallet) {
            return null;
        }

        return (
            <Dialog
                ref={scrollingDlg => {
                    this.scrollingDlg = scrollingDlg;
                }}
                className="network-selector-dialog"
            >
                <TopAppBar
                    onNav={() => {
                        /**/
                    }}
                    className="top-bar"
                >
                    <TopAppBar.Row>
                        <TopAppBar.Section align-start>
                            <TopAppBar.Title>
                                {!this.state.showSearch && 'Select blockchain'}
                                {this.state.showSearch && (
                                    <TextField fullwidth placeholder="type something" />
                                )}
                            </TopAppBar.Title>
                        </TopAppBar.Section>
                        <TopAppBar.Section align-end>
                            <TopAppBar.Icon navigation onClick={() => this.close()}>
                                close
                            </TopAppBar.Icon>
                        </TopAppBar.Section>
                    </TopAppBar.Row>
                </TopAppBar>
                <Dialog.Body scrollable={true}>
                    <List>
                        {Array.from(this.props.wallet.getAccountsMap().keys()).map(
                            (blockchain, index, allBlockchains) => [
                                <List.Item onClick={() => this.select(blockchain)}>
                                    {blockchain}
                                </List.Item>,
                                index < allBlockchains.length - 1 ? <List.Divider /> : null
                            ]
                        )}
                    </List>
                </Dialog.Body>
                {/* <Dialog.Footer>
                    <Dialog.FooterButton>Add</Dialog.FooterButton>
                </Dialog.Footer> */}
            </Dialog>
        );
    }

    public open() {
        this.scrollingDlg.MDComponent.show();
    }

    public close() {
        this.scrollingDlg.MDComponent.close();
    }

    public select(value) {
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(value);
        }
        this.close();
    }
}
