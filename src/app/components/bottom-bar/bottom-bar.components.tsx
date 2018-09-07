import { h, Component, RenderableProps } from 'preact';

import { BottomNavigation } from '../material-components/bottom-navigation/bottom-navigation.component';
import { Platform } from '../../types';

interface IProps {
  platform: Platform;
}

export class BottomBar extends Component<IProps> {
  public render(props: RenderableProps<IProps>) {
    return (
      <BottomNavigation>
        <BottomNavigation.Action icon="dashboard" label="Dashboard" href="/dashboard" />
        <BottomNavigation.Action icon="arrow_upward" label="Send" href="/send" />
        <BottomNavigation.Action icon="input" label="Receive" href="/receive" />
        {props.platform === Platform.EXTENSION && (
          <BottomNavigation.Action icon="settings" label="Settings" href="/settings" />
        )}
      </BottomNavigation>
    );
  }
}
