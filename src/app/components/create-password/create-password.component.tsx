import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import Button from 'preact-material-components/Button';
import TextField from 'preact-material-components/TextField';
import Icon from 'preact-material-components/Icon';

import './create-password.scss';
import { Translate } from '../translate/translate.component';
import { translate } from '../../utils/translate';

interface IProps {
    onComplete?: (password?: string) => any;
    onBack?: () => any;
}

interface IState {
    password: string;
    passwordConfirmation: string;
    isValid: boolean;
    validations: {
        match: boolean;
        tenChars: boolean;
        numbers: boolean;
        lowercase: boolean;
        uppercase: boolean;
    };
}

export class CreatePassword extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            password: '',
            passwordConfirmation: '',
            isValid: false,
            validations: {
                match: true,
                tenChars: false,
                numbers: false,
                lowercase: false,
                uppercase: false
            }
        };
    }

    public render() {
        return (
            <LayoutGrid className="create-wallet-step3">
                <Translate text="CreatePassword.subtitle" className="subtitle" headline5 />

                <Translate text="CreatePassword.body" body2 />

                <LayoutGrid.Inner>
                    <LayoutGrid.Cell>
                        <TextField
                            type="password"
                            onInput={e => this.onInputChange('password', (e.target as any).value)}
                            label={translate('CreatePassword.createPassword')}
                            outlined
                        />
                    </LayoutGrid.Cell>
                </LayoutGrid.Inner>
                <LayoutGrid.Inner>
                    <LayoutGrid.Cell>
                        <TextField
                            type="password"
                            onInput={e =>
                                this.onInputChange('passwordConfirmation', (e.target as any).value)
                            }
                            label={translate('CreatePassword.confirmPassword')}
                            outlined
                        />
                    </LayoutGrid.Cell>
                </LayoutGrid.Inner>

                <div class="rules">
                    {['match', 'tenChars', 'numbers', 'lowercase', 'uppercase'].map(rule => (
                        <p className={this.state.validations[rule] ? 'ok' : 'error'}>
                            <Icon>
                                {this.state.validations[rule]
                                    ? 'check_circle_outline'
                                    : 'highlight_off'}
                            </Icon>
                            <Translate text={'CreatePassword.validations.' + rule} />
                        </p>
                    ))}
                </div>

                <Button className="back" onClick={this.onBackClick.bind(this)}>
                    <Translate text="App.labels.back" />
                </Button>
                <Button
                    className="cta-button"
                    onClick={this.onCreatePasswordClick.bind(this)}
                    ripple
                    raised
                    secondary
                    disabled={!this.state.isValid}
                >
                    <Translate text="CreatePassword.createPassword" />
                </Button>
            </LayoutGrid>
        );
    }

    public onInputChange(field, value) {
        if (field in this.state) {
            this.setState({
                [field]: value
            });
            this.validate();
        }
    }

    public onBackClick() {
        if (typeof this.props.onBack === 'function') {
            this.props.onBack();
        }
    }

    public onCreatePasswordClick() {
        if (typeof this.props.onComplete === 'function' && this.state.isValid) {
            this.props.onComplete(this.state.password);
        }
    }

    public validate() {
        const match = this.state.password === this.state.passwordConfirmation;
        const tenChars = this.state.password.length >= 10;
        const numbers = /[0-9]/.test(this.state.password);
        const lowercase = /[a-z]/.test(this.state.password);
        const uppercase = /[A-Z]/.test(this.state.password);

        this.setState({
            validations: { match, tenChars, numbers, lowercase, uppercase },
            isValid: match && tenChars && numbers && lowercase && uppercase
        });
    }
}
