import { Component, h } from 'preact';
import { TextareaAutoSize } from '../../components/textarea-auto-size/textarea-auto-size.components';

export class SendPage extends Component {
    public render() {
        return (
            <div>
                <TextareaAutoSize outlined label="Aloha" />
            </div>
        );
    }
}
