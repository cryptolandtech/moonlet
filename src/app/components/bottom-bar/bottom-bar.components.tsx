import { h, Component, RenderableProps } from 'preact';

import { BottomNavigation } from '../material-components/bottom-navigation/bottom-navigation.component';
import { Platform } from '../../types';
import { translate } from '../../utils/translate';

interface IProps {
    platform: Platform;
}

export class BottomBar extends Component<IProps> {
    public render(props: RenderableProps<IProps>) {
        return (
            <BottomNavigation>
                <BottomNavigation.Action
                    icon="dashboard"
                    label={translate('App.labels.dashboard')}
                    href="/dashboard"
                />
                <BottomNavigation.Action
                    icon="arrow_upward"
                    label={translate('App.labels.send')}
                    href="/send"
                />
                <BottomNavigation.Action
                    icon="input"
                    label={translate('App.labels.receive')}
                    href="/receive"
                />
                {props.platform === Platform.EXTENSION && (
                    <BottomNavigation.Action
                        icon="settings"
                        label={translate('App.labels.settings')}
                        href="/settings"
                    />
                )}
            </BottomNavigation>
        );
    }
}
