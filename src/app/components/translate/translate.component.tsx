import { h, Component, RenderableProps } from 'preact';
import { translate, ITranslationParams } from '../../utils/translate';

interface IProps {
    text: string;
    params?: ITranslationParams;
    count?: number;
    tag?: string;
    className?: string;
    style?: string;

    body1?: boolean;
    body2?: boolean;
    button?: boolean;
    caption?: boolean;
    headline1?: boolean;
    headline2?: boolean;
    headline3?: boolean;
    headline4?: boolean;
    headline5?: boolean;
    headline6?: boolean;
    overline?: boolean;
    subtitle1?: boolean;
    subtitle2?: boolean;
}

export class Translate extends Component<IProps> {
    public mdcProps = {
        headline1: 'h1',
        headline2: 'h2',
        headline3: 'h3',
        headline4: 'h4',
        headline5: 'h5',
        headline6: 'h6',
        subtitle1: 'h6',
        subtitle2: 'h6',
        body1: 'p',
        body2: 'p',
        button: 'span',
        caption: 'span',
        overline: 'span'
    };

    public render(props: RenderableProps<IProps>) {
        let defaultTag = 'span';
        let className = props.className;
        for (const p in this.mdcProps) {
            if (this.mdcProps.hasOwnProperty(p) && props[p] === true) {
                defaultTag = this.mdcProps[p];
                className += ' mdc-typography--' + p;
                break;
            }
        }

        const Tag = props.tag || defaultTag;

        return (
            <Tag
                {...{
                    ...props,
                    className
                }}
            >
                {translate(props.text, props.params, props.count)}
            </Tag>
        );
    }
}
