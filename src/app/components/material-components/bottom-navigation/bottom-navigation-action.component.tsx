import { h, Component, RenderableProps } from 'preact';
import Match, { Link } from 'preact-router/match';

interface IActionProps {
  icon: string;
  label?: string;
  active?: boolean;
  href: string;
}
export class BottomNavigationAction extends Component<IActionProps> {
  public render(props: RenderableProps<IActionProps>) {
    const activeClass = 'mdc-bottom-navigation__action--active';
    return (
      <Match path={props.href}>
        {({ matches }) => (
          <li className={'mdc-bottom-navigation__action ' + (matches ? activeClass : '')}>
            <Link activeClassName="active" href={props.href}>
              <i class="material-icons mdc-bottom-navigation__icon" aria-hidden="true">
                {props.icon}
              </i>

              {props.label && <span class="mdc-bottom-navigation__label">{props.label}</span>}
            </Link>
          </li>
        )}
      </Match>
    );
  }
}
