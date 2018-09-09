import { h, Component, render } from 'preact';
import Chips from 'preact-material-components/Chips';

import './network-selector.scss';

export class NetworkSelector extends Component {
  public removeType(content): any {
    return content;
  }
  public render() {
    return (
      <div class="network-selector">
        <Chips>
          {this.removeType(
            <Chips.Chip>
              {this.removeType(
                <Chips.Text>
                  <div class="circle" />
                </Chips.Text>
              )}
              {this.removeType(<Chips.Text>Main Zilliqa Network</Chips.Text>)}
              {this.removeType(<Chips.Icon>keyboard_arrow_down</Chips.Icon>)}
            </Chips.Chip>
          )}
        </Chips>
      </div>
    );
  }
}
