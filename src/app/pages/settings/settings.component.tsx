import { h, Component } from 'preact';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import List from 'preact-material-components/List';
import { ListItem } from '../../components/list-item/list-item.component';
import Button from 'preact-material-components/Button';
import { route } from 'preact-router';
import { Translate } from '../../components/translate/translate.component';
import { translate } from '../../utils/translate';
import { clearWallet } from '../../utils/wallet';

interface IProps {
    signOut: () => any;
}

interface IListItem {
    icon?: string;
    primaryText: string;
    secondaryText: string;
    href?: string;
    target?: string;
    onClick?: (e?) => any;
}

export class SettingsPage extends Component<IProps> {
    public getSettingsListItems(): IListItem[] {
        const details: IListItem[] = [];

        details.push({
            primaryText: translate('SettingsPage.aboutMoonlet'),
            secondaryText: '',
            href: '',
            target: '_blank'
        });

        details.push({
            primaryText: translate('SettingsPage.revealSecretPhrase'),
            secondaryText: translate('SettingsPage.passwordRequired'),
            href: '/revealSecretPhrase'
        });

        details.push({
            primaryText: translate('SettingsPage.revealPrivateKey'),
            secondaryText: translate('SettingsPage.passwordRequired'),
            href: '/revealPrivateKey'
        });

        return details;
    }

    public render() {
        return (
            <div className="settings-page">
                <List two-line={true}>
                    {this.getSettingsListItems().map(item => {
                        return [
                            <ListItem
                                primaryText={item.primaryText}
                                secondaryText={item.secondaryText}
                                href={item.href}
                                target={item.target}
                                onClick={item.onClick}
                            />
                        ];
                    })}
                </List>

                <Button
                    ripple
                    outlined
                    onClick={() => {
                        this.props.signOut();
                    }}
                >
                    <Translate text="App.labels.signOut" />
                </Button>
            </div>
        );
    }
}
