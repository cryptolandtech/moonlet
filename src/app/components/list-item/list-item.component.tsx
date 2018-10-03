import { h, Component } from 'preact';
import List from 'preact-material-components/List';

interface IProps {
    icon?: string;
    primaryText: string;
    secondaryText: string;
    href?: string;
    target?: string;

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
        const ItemComponent = this.props.href ? List.LinkItem : List.Item;
        let itemProps = {};

        if (this.props.href) {
            itemProps = {
                onClick: this.props.onClick,
                href: this.props.href,
                target: this.props.target || '_self'
            };
        }

        return (
            <ItemComponent {...itemProps}>
                {this.props.icon && <List.ItemGraphic>{this.props.icon}</List.ItemGraphic>}
                {this.getItemText(this.props.primaryText, this.props.secondaryText)}
                {this.props.href && <List.ItemMeta>keyboard_arrow_right</List.ItemMeta>}
            </ItemComponent>
        );
    }

    public render() {
        return (
            <div>
                {this.getListItem()} <List.Divider />
            </div>
        );
    }
}
