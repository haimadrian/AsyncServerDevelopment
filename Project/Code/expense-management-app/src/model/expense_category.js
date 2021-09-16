class ExpenseCategory {
    constructor() {
        this.ASSOCIATION = 'ASSOCIATION';
        this.EDUCATION = 'EDUCATION';
        this.ELECTRIC = 'ELECTRIC';
        this.FUEL = 'FUEL';
        this.HEALTH = 'HEALTH';
        this.HOUSING = 'HOUSING';
        this.NURSERY = 'NURSERY';
        this.RESTAURANT = 'RESTAURANT';
        this.SPORT = 'SPORT';
        this.SUPERMARKET = 'SUPERMARKET';
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
}

const expenseCategories = new ExpenseCategory();
export default expenseCategories;