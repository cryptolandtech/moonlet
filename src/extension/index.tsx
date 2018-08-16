import { h } from 'preact';
import App from "../app/app"
import createHashHistory from 'history/createHashHistory';

export default (props) => (
    <App {...props} platform="extension" history={createHashHistory()}></App>
);