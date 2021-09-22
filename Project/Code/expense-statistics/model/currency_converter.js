const axios = require("axios");
const xml2js = require('xml2js');
const currencies = require("./currency");

/**
 * A class responsible for currency conversion from our supported currencies
 * to USA dollar.<br/>
 * This converter is used by statistics calculation, cause we calculate the total
 * of expenses in USA. (We cannot just sum the expenses, cause each expense got
 * its own currency)<br/>
 * Currencies are updated from https://www.boi.org.il/currency.xml
 * @author Haim Adrian
 * @since 21-Sep-21
 */
class CurrencyConverter {
    #rates
    #lastRefreshTime

    /**
     * Constructs a new {@link CurrencyConverter}
     */
    constructor() {
        this.#rates = {};
        this.#lastRefreshTime = 0;
    }

    /**
     * Reload rates data from https://www.boi.org.il/currency.xml
     * @return {Promise}
     */
    async refresh() {
        let now = Date.now();

        const oneDayMillis = 24 * 60 * 60 * 1000;
        if (now - this.#lastRefreshTime >= oneDayMillis) {
            this.#lastRefreshTime = now;

            console.log('Refreshing currency rates. Time:', new Date(now));

            try {
                await this.#loadXml();
            } catch (error) {
                console.error(error);
                return error;
            } finally {
                console.log('Refresh complete. Time:', new Date(Date.now()));
            }
        }
    }

    /**
     * Convert amount of some currency to USA dollar.
     * @param {string} currency The currency to convert from, e.g. 'EUR'
     * @param {number} amount Amount to convert. e.g. 100
     * @return {number} Amount in USA dollar
     */
    toUsDollar(currency, amount) {
        return (this.#rates[currency] || 1) * amount;
    }

    /**
     * Load XML data from https://www.boi.org.il/currency.xml and then use
     * {@link #parseDoc} to parse and store the rates.
     * @return {Promise}
     */
    async #loadXml() {
        let response = await axios.get('https://www.boi.org.il/currency.xml');
        let currenciesJsFromXml = await xml2js.parseStringPromise(response.data);
        this.#parseDoc(currenciesJsFromXml);
    }

    /**
     * Parses an XML document received from {@link #loadXml} and store the rates in
     * our data member, so we'll use it in {@link #toUsDollar}
     * @param {object} xmlDoc The XML document to parse
     * @return {void}
     */
    #parseDoc(xmlDoc) {
        const currencyElements = xmlDoc.CURRENCIES.CURRENCY;

        // First find USD, cause we rely on it. (We convert to USD and not ILS)
        let usdRate = 1;
        for (let i = 0; i < currencyElements.length; i++) {
            const currencyCode = currencyElements[i].CURRENCYCODE[0];
            if (currencyCode === currencies.USD) {
                usdRate = parseFloat(currencyElements[i].RATE[0]);
                break;
            }
        }

        // Second fill in rates of currencies.
        for (let i = 0; i < currencyElements.length; i++) {
            const currencyCode = currencyElements[i].CURRENCYCODE[0];
            const currencyRate = parseFloat(currencyElements[i].RATE[0]);
            this.#rates[currencyCode] = currencyRate / usdRate;
        }

        this.#rates[currencies.USD] = 1;
    }
}

/**
 * @type {CurrencyConverter}
 */
const currencyConverter = new CurrencyConverter();
module.exports = currencyConverter