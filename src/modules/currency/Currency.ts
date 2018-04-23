export class Currency {
    protected currency: string;

    public getCurrency() {
        return this.currency;
    }

    public setCurrency(currency: string) {
        this.currency = currency;
    }

    public formatCurrency(amount: number) {
        let strAmount = amount.toString();
        let decimals = strAmount.slice(-2);
        let wholeAmount = '';
        strAmount = strAmount.slice(0, -2);
        while (strAmount.length > 3) {
            wholeAmount = ',' + strAmount.slice(-3) + wholeAmount;
            strAmount = strAmount.slice(0, -3);
        }
        wholeAmount = strAmount + wholeAmount;
        return '$' + wholeAmount + '.' + decimals;
    }
}