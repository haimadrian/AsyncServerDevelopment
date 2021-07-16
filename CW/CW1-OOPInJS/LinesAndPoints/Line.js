class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    getSlope() {
        return (0 === this.p2.x - this.p1.x) ? Number.POSITIVE_INFINITY : (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
    }

    toString() {
        return `(p1=${this.p1}, p2=${this.p2}, slope=${this.getSlope()})`;
    }

    static isParallel(line1, line2) {
        return (line1 !== undefined) && (line2 !== undefined) && (line1.getSlope() === line2.getSlope());
    }
}