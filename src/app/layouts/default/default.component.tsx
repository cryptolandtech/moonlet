import { h, Component, RenderableProps } from 'preact';

import './default.scss';
import { TopBar } from '../../components/top-bar/top-bar.component';
import DrawerMenu from '../../components/drawer-menu/drawer-menu.container';
import { ILayout, IDevice } from '../../data/page-config/state';
import { BottomBar } from '../../components/bottom-bar/bottom-bar.components';
import { IAction } from '../../data/action';

interface IProps {
    layout: ILayout;
    device: IDevice;

    dispatch: { (action: IAction) };
}

export class DefaultLayout extends Component<IProps> {
    public render(props: RenderableProps<IProps>) {
        return (
            <div class="default-layout mdc-typography">
                <TopBar
                    config={props.layout.topBar}
                    screenSize={props.device.screenSize}
                    dispatch={props.dispatch}
                />
                {props.layout.drawerMenu && <DrawerMenu platform={props.device.platform} />}
                <div
                    className={
                        'page-container ' +
                        (props.layout.topBar ? 'mdc-top-app-bar--fixed-adjust' : '')
                    }
                >
                    {props.children}
                </div>
                {props.layout.bottomNav && <BottomBar platform={props.device.platform} />}
            </div>
        );
    }
}
