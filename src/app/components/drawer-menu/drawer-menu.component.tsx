import { h, Component, RenderableProps } from 'preact';

import List from 'preact-material-components/List';

import './drawer-menu.scss';
import { Link } from 'preact-router/match';
import { Platform } from '../../types';
import NetworkSelector from '../network-selector/network-selector.container';
import { Translate } from '../translate/translate.component';

interface IProps {
    platform: Platform;
}

export class DrawerMenu extends Component<IProps> {
    public render(props: RenderableProps<IProps>) {
        return (
            <div class="drawer-menu" style="background: #15112f; color:white;">
                <div class="header">
                    <div class="header-logo">
                        <img src="/assets/logo.svg" />
                    </div>
                    <div class="header-text">
                        <Translate text="DrawerMenu.title" className="title" tag="div" />
                        <Translate text="DrawerMenu.subtitle" className="subtitle" tag="div" />
                    </div>
                </div>

                <NetworkSelector />

                <List className="list">
                    <Link
                        href="/dashboard"
                        activeClassName="mdc-list-item--activated"
                        className="mdc-list-item"
                        role="option"
                    >
                        <List.ItemGraphic>dashboard</List.ItemGraphic>
                        <Translate text="App.labels.dashboard" />
                    </Link>

                    <Link
                        href="/send"
                        activeClassName="mdc-list-item--activated"
                        className="mdc-list-item"
                        role="option"
                    >
                        <List.ItemGraphic>arrow_upward</List.ItemGraphic>
                        <Translate text="App.labels.send" />
                    </Link>

                    <Link
                        href="/receive"
                        activeClassName="mdc-list-item--activated"
                        className="mdc-list-item"
                        role="option"
                    >
                        <List.ItemGraphic>input</List.ItemGraphic>
                        <Translate text="App.labels.receive" />
                    </Link>

                    {props.platform === Platform.EXTENSION && (
                        <Link
                            href="/settings"
                            activeClassName="mdc-list-item--activated"
                            className="mdc-list-item"
                            role="option"
                        >
                            <List.ItemGraphic>settings</List.ItemGraphic>
                            <Translate text="App.labels.settings" />
                        </Link>
                    )}

                    <Link
                        href="/"
                        activeClassName="mdc-list-item--activated"
                        className="mdc-list-item"
                        role="option"
                    >
                        <List.ItemGraphic>power_settings_new</List.ItemGraphic>
                        <Translate text="App.labels.signOut" />
                    </Link>
                </List>
            </div>
        );
    }
}
