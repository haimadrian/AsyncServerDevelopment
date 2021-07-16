class IllegalStudentFormatException {
    constructor(errorMessage, causedBy = undefined) {
        this.errorMessage = errorMessage;
        this.causedBy = causedBy;
    }

    toString() {
        let str = this.errorMessage;

        if (this.causedBy !== undefined) {
            str += ", causedBy: " + this.causedBy;
        }

        return str;
    }
}