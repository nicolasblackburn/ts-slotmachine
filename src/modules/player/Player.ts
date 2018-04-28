import { PlayerData } from "./PlayerData";

export class Player {
    public balance: number;
    public currency: string;
    public locale: string;

    constructor(balance: number, locale: string, currency: string) {
        this.balance = balance;
        this.locale = locale;
        this.currency = currency;
    }

    public serialize() {
        return {
            balance: this.balance,
            currency: this.currency,
            locale: this.locale
        };
    }

    public unserialize(data: PlayerData) {
        this.balance = data.balance;
        this.currency = data.currency;
        this.locale = data.locale;
    }
}

