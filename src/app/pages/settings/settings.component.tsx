import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import List from 'preact-material-components/List';
import { ListItem } from '../../components/list-item/list-item.component';
import Button from 'preact-material-components/Button';
import { route } from 'preact-router';
import { Translate } from '../../components/translate/translate.component';
import { translate } from '../../utils/translate';

interface IProps {
    icon?: string;
    primaryText: string;
    secondaryText: string;
    href?: string;
    target?: string;
}

export class SettingsPage extends Component {
    public getSetingsListItems(): IProps[] {
        const details: IProps[] = [];

        details.push({
            primaryText: translate('SettingsPage.aboutMoonlet'),
            secondaryText: '',
            href: '',
            target: '_blank'
        });

        details.push({
            primaryText: translate('SettingsPage.revealSecretPhrase'),
            secondaryText: translate('SettingsPage.passwordRequired'),
            href: '',
            target: '_blank'
        });

        details.push({
            primaryText: translate('SettingsPage.revealPrivateKey'),
            secondaryText: translate('SettingsPage.passwordRequired'),
            href: '',
            target: '_blank'
        });

        details.push({
            primaryText: translate('SettingsPage.restoreWallet'),
            secondaryText: translate('SettingsPage.passwordRequired'),
            href: '',
            target: '_blank'
        });

        return details;
    }

    public render() {
        return (
            <div className="settings-page">
                <LayoutGrid>
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell cols={12}>
                            <List two-line={true}>
                                {this.getSetingsListItems().map(item => {
                                    return [
                                        <ListItem
                                            primaryText={item.primaryText}
                                            secondaryText={item.secondaryText}
                                            href={item.href}
                                            target={item.target}
                                        />
                                    ];
                                })}
                            </List>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell>
                            <Button
                                ripple
                                outlined
                                onClick={() => {
                                    route('/');
                                }}
                            >
                                <Translate text="App.labels.signOut" />
                            </Button>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}
