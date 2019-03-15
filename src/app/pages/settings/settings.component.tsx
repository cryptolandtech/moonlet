import { h, Component } from 'preact';
import List from 'preact-material-components/List';
import { ListItem } from '../../components/list-item/list-item.component';
import Button from 'preact-material-components/Button';
import { Translate } from '../../components/translate/translate.component';
import { translate } from '../../utils/translate';
import Switch from 'preact-material-components/Switch';

import './settings.component.scss';
import { IWalletProvider } from '../../iwallet-provider';
import { appContext } from '../../app-context';
import { IUserPreferences, INetworksOptions } from '../../data/user-preferences/state';

interface IProps {
    level1: string;
    version: string;
    userPreferences: IUserPreferences;

    signOut: (walletProvider: IWalletProvider) => any;
    toggleDevMode: (devMode: boolean, testNet: boolean, networks: INetworksOptions) => any;
}

interface IListItem {
    icon?: string;
    primaryText: string;
    secondaryText: string;
    href?: string;
    target?: string;
    onClick?: (e?) => any;
}

interface ISettingsMenu {
    name: string;
    items: ISettingsMenuItem[];
}

interface ISettingsMenuItem {
    primaryText: string;
    secondaryText?: string;
    href?: string;
    onClick?: (e?) => any;

    type?: 'advanced' | 'switch';
    getValue?: () => any;
    setValue?: (value: any) => any;
    isDisabled?: () => boolean;

    subMenu?: ISettingsMenu;
}

export class SettingsPage extends Component<IProps> {
    private dev = false;

    private menu: ISettingsMenu = {
        name: 'root',
        items: [
            {
                primaryText: 'Disclaimer',
                href: '/settings/disclaimer'
            },
            {
                primaryText: 'Security',
                href: '/settings/security',
                subMenu: {
                    name: 'security',
                    items: [
                        {
                            primaryText: 'Reveal Secret Phrase',
                            href: '/reveal/secretPhrase'
                        }
                    ]
                }
            },
            {
                primaryText: 'Currency',
                href: '/settings/currency'
            },
            {
                primaryText: 'Developer Options',
                href: '/settings/developerOptions',
                subMenu: {
                    name: 'developerOptions',
                    items: [
                        {
                            primaryText: 'On',
                            type: 'switch',
                            getValue: () => this.props.userPreferences.devMode,
                            setValue: (v?) =>
                                this.props.toggleDevMode(
                                    v,
                                    this.props.userPreferences.testNet,
                                    this.props.userPreferences.networks
                                )
                        },
                        {
                            primaryText: 'Network Options',
                            href: '/settings/networkOptions',
                            isDisabled: () => !this.props.userPreferences.devMode
                        }
                    ]
                }
            },
            {
                primaryText: 'Application Version',
                secondaryText: this.props.version || ''
            }
        ]
    };

    public getSettingsListItems(...levels): ISettingsMenuItem[] {
        let menu = { ...this.menu };

        for (const level of levels) {
            if (!level) {
                break;
            }
            const m = menu.items.filter(item => item.subMenu && item.subMenu.name === level)[0]
                .subMenu;
            if (m) {
                menu = m;
            } else {
                break;
            }
        }

        return menu.items;
    }

    public renderMenuItem(item: ISettingsMenuItem) {
        switch (item.type) {
            case 'switch':
                return [
                    <List.Item>
                        {item.secondaryText ? (
                            <List.TextContainer>
                                <List.PrimaryText>{item.primaryText}</List.PrimaryText>
                                <List.SecondaryText>{item.secondaryText}</List.SecondaryText>
                            </List.TextContainer>
                        ) : (
                            item.primaryText
                        )}
                        <List.ItemMeta>
                            <Switch
                                checked={item.getValue()}
                                onChange={(e: any) => item.setValue(e.target.checked)}
                            />
                        </List.ItemMeta>
                    </List.Item>,
                    <List.Divider />
                ];
                break;
            default:
                return (
                    <ListItem
                        primaryText={item.primaryText}
                        secondaryText={item.secondaryText}
                        href={item.href}
                        disabled={typeof item.isDisabled === 'function' && item.isDisabled()}
                    />
                );
                break;
        }
    }

    public render() {
        return (
            <div className="settings-page">
                <List two-line={true}>
                    {this.getSettingsListItems(this.props.level1).map(item => {
                        return this.renderMenuItem(item);
                    })}
                </List>

                {!this.props.level1 && (
                    <div className="sign-out">
                        <Button
                            ripple
                            outlined
                            onClick={() => {
                                this.props.signOut(appContext('walletProvider'));
                            }}
                        >
                            <Translate text="App.labels.signOut" />
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}
