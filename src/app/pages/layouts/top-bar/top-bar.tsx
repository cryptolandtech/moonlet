import {h, Component} from 'preact';
import TopAppBar from "preact-material-components/TopAppBar";
import "./top-bar.scss";

export class TopBar extends Component {
    render(props, state) {
        return (
            <TopAppBar fixed>
                <TopAppBar.Row>
                    <TopAppBar.Section align-start>
                        <img class="top-appbar-icon" src="/assets/logo.svg"></img>
                    </TopAppBar.Section>
                    <TopAppBar.Section/>
                    <TopAppBar.Section align-end/>
                </TopAppBar.Row>
            </TopAppBar>
        );
    }

}
