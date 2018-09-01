import { h, Component } from 'preact';
import TopAppBar, { ITopAppBarProps } from "preact-material-components/TopAppBar";

import "./top-bar.scss";
import { DeviceScreenSize } from '../../types';
import commonConfig from '../../../../config/common.config';
import { IDefaultTopBarConfig } from '../../data/page-config/state';
import { Action } from '../../data/action';

interface IProps {
    config: IDefaultTopBarConfig,
    screenSize: DeviceScreenSize,

    dispatch: {(action: Action)}
}

export class TopBar extends Component<IProps> {

    getIcon(config) {
        const onClick = () => config.action ? this.props.dispatch(config.action) : {};
        let icon = (
            <TopAppBar.Icon navigation={!!config.action} onClick={onClick}>{config.icon}</TopAppBar.Icon>
        );

        if (config.icon === "logo") {
            icon = (
                <a href="#" onClick={onClick}>
                    <img class="top-appbar-icon" src="/assets/logo.svg"></img>
                </a>
            );
        }

        return icon;
    }

    getLeftSection() {
        const left = this.props.config.left;
        
        if (left) {
            return (
                <TopAppBar.Section align-start className="no-grow">
                    {this.getIcon(left)}
                </TopAppBar.Section>
            );
        }

        return null;
    }

    getMiddleSection() {
        const middle = this.props.config.middle;

        if (middle) {
            let sectionContent;
            switch(middle.type) {
                case "text": 
                    const centerClass = (this.props.screenSize === DeviceScreenSize.SMALL) ? "center" : "";
                    sectionContent = (
                        <TopAppBar.Title className={`title ${centerClass}`}>
                            {middle.text}
                        </TopAppBar.Title>
                    )
                    break;
                case "networkSelection":
                    sectionContent = (
                        <div>TBD</div>
                    )
                    break;
            }
            return (
                <TopAppBar.Section>
                    {sectionContent}
                </TopAppBar.Section>
            )
        } 

        return null;
    }

    getRightSection() {
        const right = this.props.config.right;

        if (right) {
            let sectionContent;
            switch(right.type) {
                case "icon":
                    sectionContent = this.getIcon(right);
                    break;
                case "text":
                    sectionContent = (
                        <div>{right.text}</div>
                    )
            }

            return (
                <TopAppBar.Section align-end>
                    {sectionContent}
                </TopAppBar.Section>
            )
        }
    }

    render(props: IProps) {
        if (props.config) {
            return (
                <TopAppBar fixed className="top-bar">
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
