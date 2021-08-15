const path = require('path');
const fs = require("fs");

/**
 * Develop a simple web application that prints out the delimiter being used for separating the paths held in the
 * path environment variable. Usually it should be either ; or :
 */
function getLocalPathDelimiter() {
    return path.delimiter;
}

function getLocalPathSeparator() {
    return path.sep;
}

/**
 * Develop a simple web application that returns back to the user a detailed list of all files currently saved in the current directory.
 */
function listFiles() {
    try {
        fs.readdir(".", (err, files) => {
            if (err != null) {
                console.log("Error: " + err);
            } else {
                files.forEach(file => {
                    console.log(file);
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

console.log();
console.log("PATH delimiter: " + getLocalPathDelimiter());
console.log("PATH separator: " + getLocalPathSeparator());

console.log();
listFiles();
