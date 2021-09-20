class Currency {
    constructor() {
        this.AUD = '$';
        this.CAD = '$';
        this.EUR = '€';
        this.GBP = '£';
        this.ILS = '₪';
        this.JPY = '¥';
        this.USD = '$';
    }

    keys() {
        return Object.getOwnPropertyNames(this);
    }

    values() {
        let values = [];

        for (let key of this.keys()) {
            values.push(this[key]);
        }

        return values;
    }

    displayValues() {
        let values = [];

        for (let key of this.keys()) {
            values.push(`${this[key]} (${key})`);
        }

        return values;
    }

    keyFromDisplayValue(displayValue) {
        let key = displayValue.split(" ")[1];
        return key.substring(1, key.length-1);
    }
}

const currencies = new Currency();
export default currencies;
