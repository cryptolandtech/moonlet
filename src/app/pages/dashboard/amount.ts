import BigNumber from 'bignumber.js';

const AmountConfig = {
    ETH: {
        WEI: 18,
        GWEI: 9
    }
};

export class Amount {
    public coin: string;
    private value: BigNumber;

    constructor(value: number | BigNumber, coin: string, unit?: string) {
        if (typeof value === 'number') {
            value = new BigNumber(value);
        }

        if (unit && AmountConfig[unit]) {
            value.multipliedBy(Math.pow(10, -AmountConfig[unit]));
        }

        this.value = value;
        this.coin = coin;
    }

    public plus(amount: Amount): Amount {
        if (this.coin !== amount.coin) {
            throw new Error('Cannot add two amounts with different coins');
        }
        return new Amount(this.value.plus(amount.toBigNumber()), this.coin);
    }

    public minus(amount: Amount): Amount {
        if (this.coin !== amount.coin) {
            throw new Error('Cannot add two amounts with different coins');
        }
        return new Amount(this.value.minus(amount.toBigNumber()), this.coin);
    }

    public dividedBy(amount: Amount): Amount {
        if (this.coin !== amount.coin) {
            throw new Error('Cannot add two amounts with different coins');
        }
        return new Amount(this.value.dividedBy(amount.toBigNumber()), this.coin);
    }

    public multipliedBy(amount: Amount): Amount {
        if (this.coin !== amount.coin) {
            throw new Error('Cannot add two amounts with different coins');
        }
        return new Amount(this.value.multipliedBy(amount.toBigNumber()), this.coin);
    }

    public toBigNumber(unit?: string): BigNumber {
        if (unit && AmountConfig[unit]) {
            return this.value.multipliedBy(Math.pow(10, AmountConfig[unit]));
        }
        return this.value;
    }

    public toNumber(unit?: string) {
        return this.toBigNumber(unit).toNumber();
    }

    public toString(unit?: string) {
        return this.toBigNumber(unit).toString();
    }
}
