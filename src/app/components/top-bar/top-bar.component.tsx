import { Component, h, RenderableProps } from 'preact';
import TopAppBar from 'preact-material-components/TopAppBar';

import { IAction } from '../../data/action';
import { IDefaultTopBarConfig } from '../../data/page-config/state';
import { DeviceScreenSize } from '../../types';
import './top-bar.scss';
import NetworkSelector from '../network-selector/network-selector.container';

interface IProps {
    config: IDefaultTopBarConfig;
    screenSize: DeviceScreenSize;

    dispatch: { (action: IAction) };
}

export class TopBar extends Component<IProps> {
    public getIcon(config) {
        const onClick = () => (config.action ? this.props.dispatch(config.action) : {});
        let icon = (
            <TopAppBar.Icon className="grey" navigation={!!config.action} onClick={onClick}>
                {config.icon}
            </TopAppBar.Icon>
        );

        if (config.icon === 'logo') {
            icon = (
                <a href="#" onClick={onClick}>
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

    public getMiddleTextStyle() {
        let centerClass = '';
        centerClass += this.props.screenSize === DeviceScreenSize.SMALL ? 'center' : '';
        centerClass +=
            this.props.screenSize === DeviceScreenSize.SMALL && !this.props.config.right
                ? ' middle-padding'
                : '';
        return centerClass;
    }

    public getMiddleSection() {
        const middle = this.props.config.middle;

        if (middle) {
            let sectionContent;
            switch (middle.type) {
                case 'text':
                    const centerClass = this.getMiddleTextStyle();
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
