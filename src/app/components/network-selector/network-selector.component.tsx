import { h, Component, render } from 'preact';
import Chips from 'preact-material-components/Chips';
import { removeType } from '../../utils/remove-type';

import './network-selector.scss';

export class NetworkSelector extends Component {
    public render() {
        return (
            <div class="network-selector">
                <Chips>
                    {removeType(
                        <Chips.Chip>
                            {removeType(
                                <Chips.Text>
                                    <div class="circle" />
                                </Chips.Text>
                            )}
                            {removeType(<Chips.Text>Main Zilliqa Network</Chips.Text>)}
                            {removeType(<Chips.Icon>keyboard_arrow_down</Chips.Icon>)}
                        </Chips.Chip>
                    )}
                </Chips>
            </div>
        );
    }
}
