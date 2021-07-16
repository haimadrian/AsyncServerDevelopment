class Person {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    toString() {
        return `${this.name}, ${this.id}`;
    }
}