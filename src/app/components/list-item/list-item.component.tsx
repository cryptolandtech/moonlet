import { h, Component } from 'preact';
import List from 'preact-material-components/List';

interface IProps {
    icon?: any;
    iconProps?: {};
    primaryText: string | JSX.Element;
    secondaryText?: string | JSX.Element;
    href?: string;
    target?: string;
    noDivider?: boolean;
    disabled?: boolean;
    className?: string;
    onClick?: (e?) => any;
}

export class ListItem extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public getItemText(primary, secondary) {
        if (primary && secondary) {
            return (
                <List.TextContainer>
                    <List.PrimaryText>{primary}</List.PrimaryText>
                    <List.SecondaryText>{secondary}</List.SecondaryText>
                </List.TextContainer>
            );
        } else {
            return primary;
        }
    }

    public getListItem() {
        let ItemComponent = List.Item;
        if (!this.props.disabled && this.props.href) {
            ItemComponent = List.LinkItem as any;
        }

        let itemProps = {};

        if (this.props.href) {
            itemProps = {
                onClick: this.props.onClick,
                href: this.props.href === '#' ? '' : this.props.href,
                target: this.props.target || '_self'
            };
        }

        return (
            <ItemComponent
                {...itemProps}
                className={`${this.props.className || ''} ${
                    this.props.disabled ? 'mdc-list-item--disabled' : ''
                }`}
            >
                {this.props.icon && (
                    <List.ItemGraphic {...this.props.iconProps || {}}>
                        {this.props.icon}
                    </List.ItemGraphic>
                )}
                {this.getItemText(this.props.primaryText, this.props.secondaryText)}
                {this.props.href && <List.ItemMeta>keyboard_arrow_right</List.ItemMeta>}
                {this.props.children && this.props.children}
            </ItemComponent>
        );
    }

    public render() {
        return (
            <div>
                {this.getListItem()} {!this.props.noDivider && <List.Divider />}
            </div>
        );
    }
}
