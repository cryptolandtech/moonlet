import { h, Component } from 'preact';
import List from 'preact-material-components/List';

interface IProps {
    icon?: string;
    primaryText: string;
    secondaryText: string;
    href?: string;
    target?: string;
}

export class ListItem extends Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public getListItem() {
        const ItemComponent = this.props.href ? List.LinkItem : List.Item;
        let itemProps = {};

        if (this.props.href) {
            itemProps = {
                href: this.props.href,
                target: this.props.target || '_self'
            };
        }

        return (
            <ItemComponent {...itemProps}>
                {this.props.icon && <List.ItemGraphic>{this.props.icon}</List.ItemGraphic>}
                <List.TextContainer>
                    <List.PrimaryText>{this.props.primaryText}</List.PrimaryText>
                    <List.SecondaryText>{this.props.secondaryText}</List.SecondaryText>
                </List.TextContainer>
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
