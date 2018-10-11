import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import './reveal.scss';
import { translate } from '../../utils/translate';
import TextField from 'preact-material-components/TextField';
import { Translate } from '../../components/translate/translate.component';
import { route } from 'preact-router';
import Button from 'preact-material-components/Button';

interface IProps {
    words: string[];
    onComplete?: () => any;
}

interface IState {
    wordsVisible: boolean;
}

export class RevealPage extends Component<IProps, IState> {
    public onInputChange(field, value) {
        if (field in this.state) {
            this.setState({
                [field]: value
            });
        }
    }

    public render() {
        return (
            <div>
                <LayoutGrid className="reveal-page">
                    <Translate text="RevealPage.warning" body2 />
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell>
                            <TextField
                                type="password"
                                onInput={e =>
                                    this.onInputChange('password', (e.target as any).value)
                                }
                                label={translate('CreatePassword.createPassword')}
                                outlined
                            />
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell cols={12} className="center">
                            <Button
                                ripple
                                raised
                                secondary
                                className="restore-wallet"
                                onClick={() => route('/import-wallet')}
                            >
                                <Translate text="RevealPage.revealSecretPhrase" />
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}
