import { Component, h, RenderableProps } from 'preact';
import TopAppBar from 'preact-material-components/TopAppBar';
import Menu from 'preact-material-components/Menu';
import { IAction } from '../../data/action';
import { IDefaultTopBarConfig } from '../../data/page-config/state';
import { DeviceScreenSize } from '../../types';
import './top-bar.scss';
import NetworkSelector from '../network-selector/network-selector.container';
import Icon from 'preact-material-components/Icon';
import List from 'preact-material-components/List';
import { route } from 'preact-router';

interface IProps {
    config: IDefaultTopBarConfig;
    screenSize: DeviceScreenSize;

    dispatch: { (action: IAction) };
}

export class TopBar extends Component<IProps> {
    private rightMenu;

    public getIcon(config) {
        const onClick = () => (config.action ? this.props.dispatch(config.action) : {});
        let icon = (
            <TopAppBar.Icon className="grey" navigation={!!config.action} onClick={onClick}>
                {config.icon}
            </TopAppBar.Icon>
        );

        if (config.icon === 'logo') {
            icon = (
                <a onClick={onClick}>
                    <img class="top-appbar-icon" src="/assets/logo.svg" />
                </a>
            );
        }

        return icon;
    }

    public getLeftSection() {
        const left = this.props.config.left;

        if (left) {
            return (
                <TopAppBar.Section align-start className="left-section">
                    {this.getIcon(left)}
                </TopAppBar.Section>
            );
        }

        return null;
    }

    public getMiddleSection() {
        const middle = this.props.config.middle;

        if (middle) {
            let sectionContent;
            switch (middle.type) {
                case 'text':
                    const centerClass =
                        this.props.screenSize === DeviceScreenSize.SMALL && this.props.config.right
                            ? 'center'
                            : '';
                    sectionContent = (
                        <TopAppBar.Title className={`title ${centerClass}`}>
                            {middle.text}
                        </TopAppBar.Title>
                    );
                    break;
                case 'networkSelection':
                    sectionContent = <NetworkSelector />;
                    break;
            }
            return (
                <TopAppBar.Section className="middle-section">{sectionContent}</TopAppBar.Section>
            );
        }

        return null;
    }
    public getRightSection() {
        const right = this.props.config.right;

        if (right) {
            let sectionContent;
            switch (right.type) {
                case 'icon':
                    sectionContent = this.getIcon(right);
                    break;
                case 'text':
                    sectionContent = <div className="right-text grey">{right.text}</div>;
                    break;
                case 'menu':
                    sectionContent = (
                        <Menu.Anchor>
                            <TopAppBar.Icon
                                navigation={true}
                                onClick={() => (this.rightMenu.MDComponent.open = true)}
                            >
                                {right.icon}
                            </TopAppBar.Icon>

                            <Menu ref={m => (this.rightMenu = m)}>
                                {Array.isArray(right.items) &&
                                    right.items.map(item => (
                                        <Menu.Item
                                            onClick={() => {
                                                if (item.href) {
                                                    route(item.href);
                                                } else if (item.action) {
                                                    this.props.dispatch(item.action as any);
                                                }
                                            }}
                                        >
                                            {item.text}
                                            {item.icon && (
                                                <List.ItemMeta>{item.icon}</List.ItemMeta>
                                            )}
                                        </Menu.Item>
                                    ))}
                            </Menu>
                        </Menu.Anchor>
                    );
                    break;
            }

            return (
                <TopAppBar.Section align-end className="right-section">
                    {sectionContent}
                </TopAppBar.Section>
            );
        }
    }

    public render(props: RenderableProps<IProps>) {
        if (props.config) {
            return (
                <TopAppBar
                    fixed
                    className="top-bar"
                    onNav={() => {
                        /**/
                    }}
                >
                    <TopAppBar.Row>
                        {this.getLeftSection()}
                        {this.getMiddleSection()}
                        {this.getRightSection()}
                    </TopAppBar.Row>
                </TopAppBar>
            );
        }

        return null;
    }
}
