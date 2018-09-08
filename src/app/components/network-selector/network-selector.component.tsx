import { h, Component, render } from 'preact';
import Chips from 'preact-material-components/Chips';

import './network-selector.scss';

export class NetworkSelector extends Component {
  public render() {
    return (
      <div class="network-selector">
        <Chips>
          <Chips.Chip>
            <div class="circle" />
            <Chips.Text>Main Zilliqa Network</Chips.Text>
            <Chips.Icon>keyboard_arrow_down</Chips.Icon>
          </Chips.Chip>
        </Chips>
      </div>
    );
  }
}
