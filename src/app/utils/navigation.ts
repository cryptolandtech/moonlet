import { route, getCurrentUrl, RouterOnChangeArgs, Router } from 'preact-router';

let router: Router;
const HISTORY_SIZE = 10;
const navigationHistory = [];

const push = url => {
    if (navigationHistory[0] !== url) {
        navigationHistory.unshift(url);
    }

    navigationHistory.splice(HISTORY_SIZE);
};

const routeChange = (e: RouterOnChangeArgs) => {
    router = e.router;
    push(e.url);
};

const goBack = () => {
    let prevUrl = navigationHistory[1];

    if (!prevUrl) {
        prevUrl = getCurrentUrl()
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    if (!router.canRoute(prevUrl)) {
        prevUrl = '/';
    }

    navigationHistory.shift();
    route(prevUrl);
};

export const goTo = (url: string, replace?: boolean) => {
    if (replace) {
        navigationHistory.splice(0, 1);
    }
    route(url);
};

export const Navigation = {
    routeChange,
    goTo,
    goBack
};
