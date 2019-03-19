import { h, Component } from 'preact';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Translate } from '../translate/translate.component';
import Icon from 'preact-material-components/Icon';

import './copy.scss';

interface IProps {
    text: string;
}

interface IState {
    textCopied: boolean;
}

export class Copy extends Component<IProps, IState> {
    public notCopiedTimeout;

    constructor(props: IProps) {
        super(props);
    }

    public componentWillReceiveProps(nextPops) {
        if (this.props.text !== nextPops.text) {
            this.setState({
                textCopied: false
            });
        }
    }

    public render() {
        return (
            <CopyToClipboard
                text={this.props.text}
                onCopy={() => {
                    clearTimeout(this.notCopiedTimeout);
                    this.notCopiedTimeout = setTimeout(
                        () => this.setState({ textCopied: false }),
                        5000
                    );
                    this.setState({ textCopied: true });
                }}
            >
                <div>
                    {this.props.children || []}
                    <div
                        class={`copy-component center-text ${
                            this.state.textCopied ? 'copied' : ''
                        }`}
                    >
                        <Translate
                            text={
                                this.state.textCopied
                                    ? 'App.labels.copiedToClipboard'
                                    : 'App.labels.copyToClipboard'
                            }
                        />
                        <Icon>{this.state.textCopied ? 'check' : 'file_copy'}</Icon>
                    </div>
                </div>
            </CopyToClipboard>
        );
    }
}
