import { Component, h } from 'preact';
import TopAppBar from 'preact-material-components/TopAppBar';

import { IAction } from '../../data/action';
import { IDefaultTopBarConfig } from '../../data/page-config/state';
import { DeviceScreenSize } from '../../types';
import './top-bar.scss';

interface IProps {
  config: IDefaultTopBarConfig;
  screenSize: DeviceScreenSize;

  dispatch: { (action: IAction) };
}

export class TopBar extends Component<IProps> {
  public getIcon(config) {
    const onClick = () => (config.action ? this.props.dispatch(config.action) : {});
    let icon = (
      <TopAppBar.Icon navigation={!!config.action} onClick={onClick}>
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

    if (config.icon === 'cancel') {
      // maybe concatenate the path with the name to keep the code cleaner?
      icon = (
        <a href="#" onClick={onClick}>
          <i class="material-icons md-dark">close</i>
        </a>
      );
    }

    return icon;
  }

  public getLeftSection() {
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

  public getMiddleSection() {
    const middle = this.props.config.middle;

    if (middle) {
      let sectionContent;
      switch (middle.type) {
        case 'text':
          const centerClass = this.props.screenSize === DeviceScreenSize.SMALL ? 'center' : '';
          sectionContent = (
            <TopAppBar.Title className={`title ${centerClass}`}>{middle.text}</TopAppBar.Title>
          );
          break;
        case 'networkSelection':
          sectionContent = <div>TBD</div>;
          break;
      }
      return <TopAppBar.Section>{sectionContent}</TopAppBar.Section>;
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
          sectionContent = <div class="right-text">{right.text}</div>;
      }

      return <TopAppBar.Section align-end>{sectionContent}</TopAppBar.Section>;
    }
  }

  public render(props: IProps) {
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
