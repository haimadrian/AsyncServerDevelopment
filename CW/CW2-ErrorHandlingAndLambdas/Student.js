const STUDENT_DATA_COUNT = 4;

class Student extends Person {

    constructor(name, id, average, profilePicture) {
        super(name, id);
        this.average = average;
        this.profilePicture = profilePicture;
    }

    toString() {
        return `${super.toString()}, ${this.average}, ${this.profilePicture}`;
    }

    /**
     * Function that validates a comma string representation of a student, to be used before constructing
     * a new student from string, with unexpected errors.
     * @param studentDataString Comma separated string containing student data
     * @throws IllegalStudentFormatException
     */
    static validateStudentDataString(studentDataString) {
        if (!(studentDataString instanceof String)) {
            studentDataString = studentDataString.toString();
        }

        let studentDataParts = studentDataString.split(',');
        if (studentDataParts.length !== STUDENT_DATA_COUNT) {
            throw new IllegalStudentFormatException(`Illegal string format for student. Should be: name,id,average. Was: ${studentDataString}`);
        }

        let id = studentDataParts[1].trim();
        let avg = studentDataParts[2].trim();
        if (!this.#isValidId(id)) {
            throw new IllegalStudentFormatException(`Illegal student identifier. Was: ${id}`);
        }

        if (!this.#isValidAverage(avg)) {
            throw new IllegalStudentFormatException(`Illegal student average. Was: ${avg}`);
        }
    }

    /**
     * Builds a student out of student data string. e.g. "Pika,123456789,100"
     * @param studentDataString
     * @returns {Student}
     */
    static from(studentDataString) {
        let studentDataParts = studentDataString.toString().split(',');
        return new Student(studentDataParts[0].trim(), studentDataParts[1].trim(), parseFloat(studentDataParts[2].trim()), studentDataParts[3].trim());
    }

    static fromArrayOfStudentData(studentDataArray) {
        for (let i = 0; i < studentDataArray.length; i++) {
            Student.validateStudentDataString(studentDataArray[i]);
        }

        return studentDataArray.map(studentData => Student.from(studentData));
    }

    static #isValidId(id) {
        let isValid = true;

        try {
            parseInt(id.toString(), 10);
        } catch (e) {
            isValid = false;
        }

        return isValid;
    }

    static #isValidAverage(id) {
        let isValid = true;

        try {
            parseFloat(id.toString());
        } catch (e) {
            isValid = false;
        }

        return isValid;
    }
}