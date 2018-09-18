import { DashboardPage } from './../pages/dashboard/dashboard';
import { ITranslations } from './types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                dashboard: 'Dashboard',
                send: 'Send',
                receive: 'Receive',
                settings: 'Settings',
                signOut: 'Sign out'
            }
        },
        DrawerMenu: {
            title: 'Moonlet',
            subtitle: 'Web wallet'
        },
        LandingPage: {
            title: 'Moonlet',
            createNewWallet: 'Create new wallet',
            restoreExistingWallet: 'Restore existing wallet'
        },
        DashboardPage: {
            totalBalance: 'Total Balance',
            walletAddress: 'Wallet address',
            copy: 'Copy'
        },
        CreateWalletPage: {
            title: 'Create New Wallet',
            step1: {
                subtitle: 'Backup Secret Phrase',
                warning:
                    'WARNING: Never disclose your secret phrase. Anyone with this phrase can take your funds forever.',
                tips:
                    "Backup Tips: It's important to backup this secret phrase securely where nobody else can access it, such as on a piece of paper or in a password manager. Don't email or screenshot the secret phrase. ",
                confirmBackup: 'Confirm Backup',
                copyToClipboard: 'Copy to clipboard'
            }
        }
    },
    plural: (n: number, ord: boolean) => {
        const s = String(n).split('.');
        const v0 = !s[1];
        const t0 = Number(s[0]) === n;
        const n10 = t0 && s[0].slice(-1);
        const n100 = t0 && s[0].slice(-2);

        if (ord) {
            return n10 === '1' && n100 !== '11'
                ? 'one'
                : n10 === '2' && n100 !== '12'
                    ? 'two'
                    : n10 === '3' && n100 !== '13'
                        ? 'few'
                        : 'other';
        }
        return n === 1 && v0 ? 'one' : 'other';
    }
};
