import { h, Component, RenderableProps } from 'preact';

import './bottom-navigation.scss';
import { BottomNavigationAction } from './bottom-navigation-action.component';

export class BottomNavigation extends Component {
  public static readonly Action = BottomNavigationAction;

  public render(props: RenderableProps<{}>) {
    return (
      <nav class="mdc-bottom-navigation mdc-bottom-navigation--fixed">
        <ul class="mdc-bottom-navigation__actions">{props.children}</ul>
      </nav>
    );
  }
}
