import { ITranslations } from './types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                dashboard: 'Dashboard',
                send: 'Send',
                receive: 'Receive',
                settings: 'Settings',
                signOut: 'Sign out',
                yes: 'Yes',
                no: 'No',
                back: 'Back'
            }
        },
        DrawerMenu: {
            title: 'Moonlet',
            subtitle: 'Web wallet'
        },
        LandingPage: {
            title: 'Moonlet',
            createNewWallet: 'Create new wallet',
            restoreExistingWallet: 'Restore existing wallet',
            signIn: 'Sign in',
            enterPassword: 'Enter password'
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
                copyToClipboard: 'Copy to clipboard',
                revealSecretPhrase: 'Reveal Secret Phrase',
                confirmationDialog: {
                    title: 'Re-confirm Backup',
                    body:
                        'Did you understand that if you loose your secret phrase, you will not be able to restore your wallet and access your founds ?'
                }
            },
            step2: {
                subtitle: 'Validate Secret Phrase',
                secretPhrase: 'Secret phrase',
                secretPhraseLegend:
                    "Let's make sure you have copied your secret phrase correctly. Click the words below in the correct order.",
                validateSecret: 'Validate secret phrase'
            }
        },
        CreatePassword: {
            subtitle: 'Create Password',
            body:
                'Setup a password to store your data securely. It will be required next time you want to access your wallet.',
            createPassword: 'Create password',
            enterPassword: 'Enter Password',
            confirmPassword: 'Confirm Password',
            validations: {
                match: 'Passwords should match',
                tenChars: '10 or more characters long',
                numbers: 'At least one number',
                lowercase: 'At least one lowercase character',
                uppercase: 'At least one UPPERCASE character'
            }
        },
        ImportWalletPage: {
            title: 'Restore Existing Wallet',
            step1: {
                warning:
                    'WARNING: Never disclose your secret phrase. Anyone with this phrase can get access to your funds.',
                secretPhrase: 'Secret phrase',
                inputHelp: 'Enter your secret phrase and write the words in the correct order.',
                restoreWallet: 'Restore wallet'
            }
        },
        TransactionDetailsPage: {
            dateTime: 'Date and time',
            amount: 'Amount',
            fees: 'Fees',
            status: 'Transaction status',
            from: 'From',
            recipient: 'Recipient',
            id: 'Transaction ID'
        },
        ReceivePage: {
            copyToClipboard: 'Copy to clipboard'
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
