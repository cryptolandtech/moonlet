import { Component, h, RenderableProps } from 'preact';
import TopAppBar from 'preact-material-components/TopAppBar';
import Menu from 'preact-material-components/Menu';
import { IAction } from '../../data/action';
import { IDefaultTopBarConfig } from '../../data/page-config/state';
import { DeviceScreenSize } from '../../types';
import './top-bar.scss';
import List from 'preact-material-components/List';
import { route } from 'preact-router';
import { BLOCKCHAIN_INFO } from '../../utils/blockchain/blockchain-info';
import { isExtension } from '../../utils/platform-utils';
import CurrencyTotal from '../currency-total/currency-total.container';
import { IAccountsBalances } from '../../data/wallet/state';

interface IProps {
    config: IDefaultTopBarConfig;
    screenSize: DeviceScreenSize;
    accounts: any[];
    balances: IAccountsBalances;

    dispatch: { (action: IAction) };
}

export class TopBar extends Component<IProps> {
    private rightMenu;

    public getIcon(config) {
        const onClick = () => (config.action ? this.props.dispatch(config.action) : {});
        let icon = (
            <TopAppBar.Icon navigation={!!config.action} onClick={onClick}>
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

    public getText(text) {
        if (typeof text === 'function') {
            return text();
        }
        return text;
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
                case 'tokenPageTitle':
                    const blockchain = (isExtension() ? location.hash : location.pathname).split(
                        '/'
                    )[2];
                    const text = blockchain
                        ? blockchain[0].toUpperCase() +
                          blockchain.toLowerCase().slice(1) +
                          ` (${BLOCKCHAIN_INFO[blockchain].coin.toUpperCase()})`
                        : '';
                    sectionContent = <TopAppBar.Title className={`title`}>{text}</TopAppBar.Title>;
                    break;
                case 'text':
                    const centerClass =
                        this.props.screenSize === DeviceScreenSize.SMALL && this.props.config.right
                            ? 'center'
                            : '';
                    sectionContent = (
                        <TopAppBar.Title className={`title ${centerClass}`}>
                            {this.getText(middle.text)}
                        </TopAppBar.Title>
                    );
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
                    sectionContent = (
                        <div className="right-text grey">{this.getText(right.text)}</div>
                    );
                    break;
                case 'menu':
                    sectionContent = (
                        <Menu.Anchor>
                            <TopAppBar.Icon
                                navigation={true}
                                onClick={() => {
                                    this.rightMenu.MDComponent.open = false;
                                    setTimeout(() => (this.rightMenu.MDComponent.open = true));
                                }}
                            >
                                {right.icon}
                            </TopAppBar.Icon>

                            <Menu
                                ref={m => {
                                    this.rightMenu = m;
                                }}
                                style={`width: ${right.menuWidth || 150}px;`}
                            >
                                {Array.isArray(right.items) &&
                                    right.items.map(item => this.getMenuItem(item))}
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

    public getMenuItem(item) {
        if (item.divider) {
            return <List.Divider />;
        } else {
            return (
                <Menu.Item
                    onClick={() => {
                        setTimeout(() => {
                            if (item.href) {
                                if (item.target) {
                                    window.open(item.href);
                                } else {
                                    route(item.href);
                                }
                            } else if (item.action) {
                                this.props.dispatch(item.action as any);
                            }
                        }, 50);
                    }}
                >
                    {item.text}
                    {item.icon && <List.ItemMeta>{item.icon}</List.ItemMeta>}
                </Menu.Item>
            );
        }
    }

    public renderSecondRow() {
        if (this.props.config.secondRow) {
            let content = null;
            let rowExtraClass = '';

            switch (this.props.config.secondRow.type) {
                case 'total-balance':
                    rowExtraClass = 'total-balance';
                    content = (
                        <CurrencyTotal
                            amounts={this.props.accounts.map(acc => {
                                const amount =
                                    this.props.balances[acc.node.blockchain] &&
                                    this.props.balances[acc.node.blockchain][acc.address]
                                        ? parseFloat(
                                              this.props.balances[acc.node.blockchain][
                                                  acc.address
                                              ].amount.toString()
                                          )
                                        : undefined;
                                const coin = BLOCKCHAIN_INFO[acc.node.blockchain].coin;
                                return { amount, coin };
                            })}
                        />
                    );
                    break;
            }
            return <TopAppBar.Row className={rowExtraClass}>{content}</TopAppBar.Row>;
        }
        return null;
    }

    public render(props: RenderableProps<IProps>) {
        if (props.config) {
            let className = 'top-bar';

            if (this.props.config.options && this.props.config.options.theme) {
                className += ` theme-${this.props.config.options.theme}`;
            }
            return (
                <TopAppBar
                    fixed
                    className={className}
                    onNav={() => {
                        /**/
                    }}
                >
                    <TopAppBar.Row>
                        {this.getLeftSection()}
                        {this.getMiddleSection()}
                        {this.getRightSection()}
                    </TopAppBar.Row>
                    {this.renderSecondRow()}
                </TopAppBar>
            );
        }

        return null;
    }
}
