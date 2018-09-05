import { h, Component, RenderableProps } from 'preact';

import './default.scss';
import TopBar from '../../components/top-bar/top-bar.container';
import { DrawerMenu } from '../../components/drawer-menu/drawer-menu.component';
import { ILayout } from '../../data/page-config/state';

interface IProps {
  layout: ILayout;
}

export class DefaultLayout extends Component<IProps> {
  public render(props: RenderableProps<IProps>) {
    return (
      <div class="default-layout">
        <TopBar />
        {props.layout.drawerMenu && <DrawerMenu className="drawer-menu" />}
        <div
          className={
            'page-container ' + (props.layout.topBar ? 'mdc-top-app-bar--fixed-adjust' : '')
          }
        >
          {props.children}
        </div>
      </div>
    );
  }
}
