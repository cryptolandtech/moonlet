import { h, Component, render } from 'preact';
import Chips from 'preact-material-components/Chips';
import { removeType } from '../../utils/remove-type';

import './network-selector.scss';
import NetworkSelectorBlockChainDialog from './blockchain-dialog/blockchain-dialog.container';
import { Blockchain } from 'moonlet-core/src/core/blockchain';
import { Network } from 'moonlet-core/src/core/network';
import { route } from 'preact-router';

interface IProps {
    blockchain: Blockchain;

    onBlockchainChange: (blockchain: Blockchain, network?: Network) => any;
}

export class NetworkSelector extends Component<IProps> {
    private dialog;
    public render() {
        return (
            <div class="network-selector">
                <Chips onClick={() => this.dialog.open()}>
                    {removeType(
                        <Chips.Chip>
                            {removeType(
                                <Chips.Text>
                                    <div class="circle" />
                                </Chips.Text>
                            )}
                            {removeType(<Chips.Text>{this.props.blockchain}</Chips.Text>)}
                            {removeType(<Chips.Icon>keyboard_arrow_down</Chips.Icon>)}
                        </Chips.Chip>
                    )}
                </Chips>
                <NetworkSelectorBlockChainDialog
                    ref={el => (this.dialog = el && el.getWrappedInstance())}
                    onSelect={blockchain => {
                        this.props.onBlockchainChange(blockchain);
                        route('/dashboard');
                    }}
                />
            </div>
        );
    }
}
