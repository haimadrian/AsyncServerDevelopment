class Currency {
    constructor() {
        this.AUD = 'AUD';
        this.CAD = 'CAD';
        this.EUR = 'EUR';
        this.GBP = 'GBP';
        this.ILS = 'ILS';
        this.JPY = 'JPY';
        this.USD = 'USD';
    }

    keys() {
        return Object.getOwnPropertyNames(this);
    }
}

const currencies = new Currency();
module.exports = currencies;
