import { h, Component, RenderableProps } from 'preact';

import './drawer-menu.scss';

interface IProps {
  className: string;
}

export class DrawerMenu extends Component<IProps> {
  public render(props: RenderableProps<IProps>) {
    return (
      <div className={props.className} style="background: #15112f; color:">
        drawer-menu
      </div>
    );
  }
}
