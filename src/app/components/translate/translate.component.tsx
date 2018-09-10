import { h, Component, RenderableProps, AnyComponent } from 'preact';
import { translate, ITranslationParams } from '../../utils/translate';

interface IProps {
    text: string;
    params?: ITranslationParams;
    count?: number;
    tag?: string;
    className?: string;
}

export class Translate extends Component<IProps> {
    public render(props: RenderableProps<IProps>) {
        const Tag = props.tag || 'span';
        return (
            <Tag className={props.className}>
                {translate(props.text, props.params, props.count)}
            </Tag>
        );
    }
}
