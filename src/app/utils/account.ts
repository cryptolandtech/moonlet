import { GenericAccount, AccountType } from 'moonlet-core/src/core/account';

export const getAccountIcon = (account: GenericAccount) => {
    let icon: any = account.type;

    if (account.type === AccountType.HARDWARE) {
        icon = account.deviceType;
    }

    return `/assets/icons/account-type-${icon.toLowerCase()}.svg`;
};
