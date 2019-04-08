import { browser } from 'webextension-polyfill-ts';

const ICON_DEFAULT = {};
const ICON_GREEN = {};

[16, 32, 48, 64, 128, 192, 256, 512].map(size => {
    ICON_DEFAULT[size] = `/assets/icon-${size}px.png`;
    ICON_GREEN[size] = `/assets/icon-green-${size}px.png`;
});

let blinkInterval;
export class BrowserIconManager {
    private currentIcon;
    private state = {
        tab: false,

        currentWindowId: undefined,
        popupsOpened: []
    };

    constructor() {
        this.stopBlink();
    }

    public setState(state: {
        currentWindowId?: number;
        popupOpenedOnWindow?: number;
        popupClosedOnWindow?: number;
        tab?: boolean;
    }) {
        const popupsOpened = Array.from(
            new Set([...this.state.popupsOpened, state.popupOpenedOnWindow])
        ).filter(Boolean);

        const index = popupsOpened.indexOf(state.popupClosedOnWindow);
        if (index >= 0) {
            popupsOpened.splice(index, 1);
        }

        delete state.popupOpenedOnWindow;
        delete state.popupClosedOnWindow;
        const newState = {
            ...this.state,
            ...state,
            popupsOpened
        };

        if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
            this.state = newState;
            this.updateIcon();
        }
    }

    public updateIcon() {
        if (!this.state.tab && this.state.popupsOpened.indexOf(this.state.currentWindowId) < 0) {
            // default icon
            this.stopBlink();
        } else {
            // blink
            this.startBlink();
        }
    }

    public startBlink() {
        if (!blinkInterval) {
            this.toggleIcon();
            blinkInterval = setInterval(() => this.toggleIcon(), 600);
        }
    }

    public stopBlink() {
        clearInterval(blinkInterval);
        blinkInterval = undefined;
        this.toggleIcon(ICON_DEFAULT);
    }

    public toggleIcon(icon?) {
        if (icon) {
            this.currentIcon = icon;
        } else {
            if (this.currentIcon === ICON_DEFAULT) {
                this.currentIcon = ICON_GREEN;
            } else {
                this.currentIcon = ICON_DEFAULT;
            }
        }

        browser.browserAction.setIcon({ path: this.currentIcon });
    }
}
