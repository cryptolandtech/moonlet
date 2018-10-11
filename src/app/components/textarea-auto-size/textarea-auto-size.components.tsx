import { h, Component } from 'preact';
import Textarea from 'react-textarea-autosize';

import './textarea-auto-size.scss';

interface IProps {
    outlined?: boolean;
    noBorder?: boolean;
    label?: string;
    value?: string;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    helperTextValidationMsg?: boolean;

    inputRef?: (el) => any;
    onChange?: (e: any) => any;
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

        let helperTextClassName =
            'mdc-text-field-helper-text mdc-text-field-helper-text--persistent';
        if (this.props.helperTextValidationMsg) {
            helperTextClassName += ' mdc-text-field-helper-text--validation-msg';
        }

        return (
            <div class="textarea-auto-resize">
                <fieldset className={className + ' mdc-text-field mdc-text-field--textarea'}>
                    {this.props.label && <legend>{this.props.label}</legend>}
                    <Textarea
                        {...this.props}
                        className={this.props.className + ' mdc-text-field__input'}
                    />
                </fieldset>
                {this.props.helperText && (
                    <div className={helperTextClassName}>{this.props.helperText}</div>
                )}
            </div>
        );
    }
}
