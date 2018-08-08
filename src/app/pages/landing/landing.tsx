import { h, Component } from 'preact';

import TopAppBar from "preact-material-components/TopAppBar";
import Icon from "preact-material-components/Icon";
import LayoutGrid from "preact-material-components/LayoutGrid";

import "./landing.scss";

export class LandingPage extends Component {
    render() {
        return (
            <div className="landing-page">
                <TopAppBar fixed>
                    <TopAppBar.Row>
                        <TopAppBar.Section align-start>
                            <TopAppBar.Icon>sentiment_satisfied_alt</TopAppBar.Icon>
                        </TopAppBar.Section>
                    </TopAppBar.Row>
                </TopAppBar>

                <LayoutGrid className="mdc-top-app-bar--fixed-adjust">
                    <LayoutGrid.Inner>
                        <LayoutGrid.Cell align="middle" cols={6}>
                            <div style="width: 100%, height: 50px; background: red">asdasdas</div>
                        </LayoutGrid.Cell>
                        <LayoutGrid.Cell align="middle" cols={6}>
                            <div style="width: 100%, height: 50px; background: red">asdasdas</div>
                        </LayoutGrid.Cell>
                    </LayoutGrid.Inner>
                </LayoutGrid>
            </div>
        );
    }
}