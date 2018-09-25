import { h, Component } from 'preact';
import Textarea from 'react-textarea-autosize';

import './textarea-auto-size.scss';

interface IProps {
    outlined?: boolean;
    noBorder?: boolean;
    label?: string;
    value?: string;
    className?: string;
    inputRef?: (el) => any;
}

interface IState {
    rows: number;
}

export class TextareaAutoSize extends Component<IProps, IState> {
    public textareaElement;

    constructor(props: IProps) {
        super(props);

        this.state = {
            rows: 1
        };
    }

    public render() {
        let className = '';
        if (this.props.outlined) {
            className = 'outlined';
        } else if (this.props.noBorder) {
            className = 'no-border';
        }

        return (
            <fieldset
                className={
                    className + ' textarea-auto-resize mdc-text-field mdc-text-field--textarea'
                }
            >
                {this.props.label && <legend>{this.props.label}</legend>}
                <Textarea
                    {...this.props}
                    className={this.props.className + ' mdc-text-field__input'}
                />
            </fieldset>
        );
    }
}
