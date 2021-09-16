class MaritalStatus {
    constructor() {
        this.DIVORCED = 'Divorced';
        this.ENGAGED = 'Engaged';
        this.KNOWN = 'Publicly Known';
        this.MARRIED = 'Married';
        this.OPEN = 'Open Relationship';
        this.RELATIONSHIP = 'In Relationship';
        this.SINGLE = 'Single';
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

    keyByValue(value) {
        for (let key of this.keys()) {
            if (value === this[key]) {
                return key;
            }
        }

        return 'SINGLE';
    }
}

const maritalStatuses = new MaritalStatus();
export default maritalStatuses;