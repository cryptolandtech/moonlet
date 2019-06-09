import { h, Component, RenderableProps } from 'preact';

import './default.scss';
import TopBar from '../../components/top-bar/top-bar.container';
import { ILayout } from '../../data/page-config/state';

interface IProps {
    layout: ILayout;
}

export class DefaultLayout extends Component<IProps> {
    public render(props: RenderableProps<IProps>) {
        let topBarAdjustClass = '';
        if (props.layout.topBar) {
            topBarAdjustClass = props.layout.topBar.secondRow
                ? 'top-bar-adjust-two-rows'
                : 'top-bar-adjust-one-row';
        }
        return (
            <div
                class={`default-layout mdc-typography ${
                    props.layout.options && props.layout.options.backgroundColor
                        ? `bg-${props.layout.options.backgroundColor}`
                        : ''
                }`}
            >
                <TopBar />
                <div className={`page-container ${topBarAdjustClass}`}>{props.children}</div>
            </div>
        );
    }
}
