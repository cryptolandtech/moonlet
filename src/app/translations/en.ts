import { ITranslations } from './types';

export const translation: ITranslations = {
    texts: {
        App: {
            labels: {
                account: 'Account',
                accept: 'Accept',
                address: 'Address',
                authorize: 'Authorize',
                connect: 'Connect',
                dashboard: 'Dashboard',
                decline: 'Decline',
                discard: 'Discard',
                send: 'Send',
                receive: 'Receive',
                settings: 'Settings',
                signOut: 'Sign out',
                yes: 'Yes',
                no: 'No',
                back: 'Back',
                recipient: 'Recipient',
                amount: 'Amount',
                confirm: 'Confirm',
                transactions: 'Transactions',
                transactionFee: 'Transaction Fee',
                fee: 'Fee',
                cancel: 'Cancel',
                reject: 'Reject',
                alert: 'Alert',
                ok: 'OK',
                from: 'From',
                total: 'Total',
                copyToClipboard: 'Copy to clipboard',
                copiedToClipboard: 'Copied to clipboard',
                switch: 'Switch',
                blockchain: 'Blockchain',
                privateKey: 'Private key',
                import: 'Import',
                create: 'Create',
                warning: 'Warning',
                on: 'On',
                pending: 'Pending',
                success: 'Success',
                giveFeedback: 'Give feedback',
                getZilDomain: 'Get your .zil domain',
                dismiss: 'Dismiss',
                reportIssue: 'Report Issue',
                backup: 'Backup',
                more: 'More'
            }
        },
        LandingPage: {
            title: 'Moonlet',
            createNewWallet: 'Create new wallet',
            restoreExistingWallet: 'Restore existing wallet',
            signIn: 'Sign in',
            enterPassword: 'Enter password',
            invalidPassword: 'Invalid password'
        },
        DashboardPage: {
            totalBalance: 'Total Balance',
            walletAddress: 'Wallet address',
            copy: 'Copy',
            noTransactions:
                'Your transaction history will appear here once you send or receive tokens.',
            menu: {
                addNewAccount: 'Add new account',
                openNewTab: 'Open new tab'
            },
            xSell: {
                text:
                    'Make your crypto payments simple. Get your .zil domain now before someone else buys it! (e.g. johndoe.zil).',
                getOneNow: 'Get yours now'
            }
        },
        SendPage: {
            addAllBalance: 'Add all balance',
            added: 'Added',
            errors: {
                recipient: 'Recipient should be a valid address.',
                recipientLookupInProgress: 'Name lookup in progress. Please wait to complete.',
                recipientNameAddressInvalid: 'Name resolves to an invalid address.',
                recipientNameNotFound: 'Name not found.',
                amount: 'Amount should be a positive number.',
                invalidValue: 'Invalid value.',
                insufficientFounds: 'Insufficient funds.',
                hwAccountError:
                    "The hardware wallet you inserted doesn't host the account you want to access."
            },
            confirmationDialog: {
                title: 'Re-Confirm & Send',
                message:
                    'You are going to send {{amount}} to the following recipient address {{address}}'
            },
            errorDialog: {
                generic:
                    'Sorry, there was an error posting your transaction to blockchain. Try again or come back later.'
            },
            progressDialog: {
                instructionsConnect:
                    'Connect your Ledger directly to your computer and open {{appName}} application.',
                instructionsSign: 'Check your ledger device and approve transaction signing.'
            },

            TransactionFee: {
                safeLow: 'Cheap',
                standard: 'Standard',
                fast: 'Fast',
                fastest: 'Fastest',
                advanced: 'Advanced',
                simple: 'Simple',

                GasFee: {
                    gasPrice: 'Gas Price ({{unit}})',
                    gasLimit: 'Gas Limit'
                }
            }
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
                        'Did you understand that if you lose your secret phrase, you will not be able to restore your wallet and access your funds ?'
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
                inputError: 'Invalid mnemonic.',
                restoreWallet: 'Restore wallet'
            },
            chooseImportType: {
                restoreUsingSecret: 'Restore using secret phrase',
                restoreFrom: 'Restore from {{provider}}'
            },
            cloudRestore: {
                walletName: 'Wallet {{index}} ({{hash}})',
                enterPassword: 'Enter password',
                restoreInfo: 'You are going to restore {{name}} from {{date}}.',
                invalidPassword: 'Invalid password.',
                genericError: 'There was an error while restoring your wallet.',
                noBackups: 'There are no backups on the selected account.'
            }
        },
        TransactionDetailsPage: {
            title: 'Transaction details',
            dateTime: 'Date and time',
            amount: 'Amount',
            fees: 'Fees',
            status: 'Transaction status',
            from: 'From',
            recipient: 'Recipient',
            id: 'Transaction ID',
            nonce: 'Nonce'
        },
        ReceivePage: {
            copyToClipboard: 'Copy to clipboard'
        },
        SettingsPage: {
            applicationVersion: 'Application version',
            revealSecretPhrase: 'Reveal Secret Phrase',
            revealPrivateKey: 'Reveal Private Key',
            restoreWallet: 'Restore Existing Wallet',
            passwordRequired: 'Your password is required for the next step',
            security: 'Security',
            developerOptions: 'Developer options',
            currency: 'Currency',
            disclaimer: 'Disclaimer'
        },
        RevealPage: {
            enterPassword: 'Enter password',
            invalidPassword: 'Invalid password',
            secretPhrase: {
                title: 'Reveal Secret Phrase',
                warning:
                    'WARNING: Never disclose your secret phrase. Anyone with this phrase can take your funds forever.',
                tips:
                    "Backup Tips: It's important to backup this secret phrase securely where nobody else can access it, such as on a piece of paper or in a password manager. Don't email or screenshot the secret phrase."
            },
            privateKey: {
                title: 'Reveal Private Key',
                warning:
                    'WARNING: Never disclose your private key. Anyone with this key can take your funds forever.',
                tips:
                    'Backup Tips: It’s important to backup this private key securely where nobody else can access it, such as on a piece of paper or in a password manager. Don’t email or screenshot the private key.'
            },
            publicKey: {
                title: 'Reveal Public Key',
                warning:
                    'Info: The address, which is used in transactions, is a shorter representative form of the public key.',
                tips: ''
            },
            addressFormat: {
                title: 'ZIL Address Format',
                warning:
                    'In order to prevent funds loss by mistake and distinguish itself from Ethereum address format, Zilliqa changed their address standard. Below you can find both formats:',
                formats: {
                    default: 'New format',
                    base16: 'Old format'
                }
            }
        },
        AccountPage: {
            addressFormat: 'Address Format',
            revealPrivateKey: 'Reveal Private Key',
            revealPublicKey: 'Reveal Public Key',
            discardAddress: 'Discard Address',
            addressCopied: 'Address copied to clipboard',
            viewOn: 'View on {{explorer}}',

            discardDialog: {
                title: 'Discard Account',
                text:
                    'This account will be discarded from Moonlet Wallet. Please make sure you have the original seed phrase or private key for this account. You can still create, connect or import accounts again from topbar menu.'
            }
        },
        DisclaimerPage: {
            title: 'Disclaimer',

            p1: 'Always be vigilant about safety and security!',
            p21:
                'Always backup your keys: We do not have access to, nor do we store, your keys to the tokens or funds you have on our software. No data leaves your computer/phone/browser. We only provide a service to make it easy for users to create, save and access information that is needed to interact with the blockchain. ',
            p22: 'It is your responsibility to securely store and backup your keys.',
            p31: 'We are not responsible for any loss: ',
            p32:
                'The Zilliqa blockchain as well as the software are under active development. There is always the possibility of something unexpected happening that causes your tokens or funds to be lost. Please do not use the software for more than what you are willing to lose, and please be careful. By using the software, you agree that each of S.C. JAXABLE S.R.L. and Zilliqa Research Pte Ltd. assume no responsibility or liability for any error, omission, delay, damages, costs, loss or expense (together “Losses”) incurred by you from the use of the software. You acknowledge that you may suffer a Loss from the use of the software and that the use of the software is at your own risk.',

            p41: 'MIT License',
            p42: 'Copyright (c) 2019 S.C. JAXABLE S.R.L.',
            p43:
                'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:',
            p44:
                'The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.',
            p45:
                'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'
        },
        NetworkOptionsPage: {
            title: 'Network Options',
            mainnet: 'Mainnets',
            testnet: 'Testnets',
            switchDialog: {
                title: 'Network switch',
                text:
                    'You are about to switch to testnet networks. Bear in mind that the account/addresses will differ from main networks.'
            }
        },
        CurrencyPage: {
            title: 'Preferred Currency'
        },
        ZilliqaAccountRecoverPage: {
            title: 'Zilliqa old accounts access',
            text:
                'If you ever used an older version of Moonlet, before 31st of January 2019, this section would help you recover access to old addresses.'
        },
        CreateAccountPage: {
            title: 'New Account',
            blockchainError: 'Select a blockchain.',
            accountName: 'Account name',
            accountNameError: 'Enter an account name.',
            privateKeyError: 'Enter a valid private key.',
            sections: {
                add: {
                    title: 'Add'
                },
                connect: {
                    title: 'Connect',
                    ledger: {
                        accountName: 'Ledger {{index}}',
                        hdPath: 'HD Path',
                        selectAccount: 'Select an Account',
                        waiting: 'Waiting for device to be ready.',
                        instructions:
                            'Connect your Ledger directly to your computer and open {{appName}} application.',
                        derivationPathInfo:
                            "If you don't see your existing Ledger accounts below, try switching HD Paths",
                        paths: {
                            live: 'Ledger Live',
                            legacy: 'Legacy'
                        }
                    }
                },
                import: {
                    title: 'Import'
                }
            }
        },
        TestnetWarningComponent: {
            generic: "You're using testnets for all accounts.",
            specific: "You're using {{blockchain}} {{testnetName}} testnet.",
            goTo: 'Go to Settings -> Dev Tools to switch networks.'
        },
        SupportUsPage: {
            title: 'Support us',
            text: 'Donating is a helpful way to support us.'
        },
        BackupPage: {
            lastBackup: 'Last backup',
            noBackup: 'No backups yet.',
            comingSoon: 'Coming soon',
            confirmPassword: 'Confirm your password',
            tasks: {
                encrypt: 'Encrypt your wallet.',
                checkStructure: 'Check cloud folder structure.',
                upload: 'Upload encrypted wallet.',
                verify: 'Verify backup.',
                done: 'Done'
            }
        },
        AddressCard: {
            formats: {
                ZILLIQA: {
                    base16: 'Legacy'
                }
            }
        },
        ConfirmationScreen: {
            AccountAccess: {
                authRequest: 'Authorization request',
                description: '{{dappTitle}} would like to connect to your wallet.',
                securityDescription:
                    'This site is requesting access to a {{blockchain}} account from your wallet. Always make sure you trust the sites you interact with.'
            },
            TransactionConfirmation: {
                confirmTransaction: 'Confirm Transaction',
                confirmContractDeploy: 'Confirm Contract Deployment',
                confirmContractCall: 'Confirm Contract Call',
                deploy: 'Deploy',
                transfer: 'Transfer'
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
