import { h, Component } from 'preact';

import './loader.scss';

interface IProps {
    width: string;
    height: string;
    className?: string;
}

export class Loader extends Component<IProps> {
    public render() {
        let className = 'loader-component';
        if (this.props.className) {
            className += ' ' + this.props.className;
        }
        return (
            <svg
                class="loader-component"
                {...this.props}
                {...{ className }}
                viewBox="0 0 66 66"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    class="path"
                    fill="none"
                    stroke-width="6"
                    stroke-linecap="round"
                    cx="33"
                    cy="33"
                    r="30"
                />
            </svg>
        );
    }
}
