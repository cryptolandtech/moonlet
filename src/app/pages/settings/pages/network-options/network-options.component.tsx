import { h, Component } from 'preact';
import { Translate } from '../../../../components/translate/translate.component';
import IconButton from 'preact-material-components/IconButton';
import './network-options.scss';
import { IUserPreferences } from '../../../../data/user-preferences/state';
import { Button } from 'preact-material-components/Button';
import { timingSafeEqual } from 'crypto';
import { bind } from 'bind-decorator';

interface IProps {
    userPreferences: IUserPreferences;

    toggleTestNet: (v?: boolean) => any;
}

export class NetworkOptionsPage extends Component<IProps> {
    private switchRef;

    public componentDidMount() {
        this.switchRef.MDComponent.listen('MDCIconButtonToggle:change', this.onSwitchChange);
        this.switchRef.MDComponent.on = this.props.userPreferences.testNet;
    }

    public componentWillUnmount() {
        this.switchRef.MDComponent.unlisten('MDCIconToggle:change', this.onSwitchChange);
    }

    @bind
    public onSwitchChange(e) {
        this.props.toggleTestNet(e.detail.isOn);
    }

    public render() {
        return (
            <div class="network-options-page">
                <div class="switcher">
                    <Translate
                        className={`mainnet ${this.props.userPreferences.testNet ? '' : 'active'}`}
                        text="NetworkOptionsPage.mainnet"
                    />
                    <IconButton ref={r => (this.switchRef = r)}>
                        <IconButton.Icon>toggle_off</IconButton.Icon>
                        <IconButton.Icon on>toggle_on</IconButton.Icon>
                    </IconButton>
                    <Translate
                        className={`testnet ${this.props.userPreferences.testNet ? 'active' : ''}`}
                        text="NetworkOptionsPage.testnet"
                    />
                </div>
            </div>
        );
    }
}
