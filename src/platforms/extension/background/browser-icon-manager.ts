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
    private currentConnections = {};
    private focusCheckInterval;

    constructor() {
        this.stopBlink();
    }

    public openConnection(id) {
        this.currentConnections[id] = true;
        if (!this.focusCheckInterval && Object.keys(this.currentConnections).length > 0) {
            this.focusCheckInterval = setInterval(() => this.blink(), 1500);
            this.blink();
        }
    }

    public closeConnection(id) {
        delete this.currentConnections[id];
        if (this.focusCheckInterval && Object.keys(this.currentConnections).length === 0) {
            clearInterval(this.focusCheckInterval);
            this.focusCheckInterval = null;
            this.stopBlink();
        }
    }

    public blink() {
        if (this.isExtensionInFocus()) {
            this.startBlink();
        } else {
            this.stopBlink();
        }
    }

    public isExtensionInFocus() {
        return (
            browser.extension
                .getViews()
                .map(window => window.document.hasFocus())
                .filter(Boolean).length > 0
        );
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
