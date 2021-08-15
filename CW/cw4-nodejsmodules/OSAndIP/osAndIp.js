const os = require('os');

/**
 * Develop a simple web application that prints out the OSAndIP number of the computer on which the code is running.
 * Please note that you can get some inspiration at https://gist.github.com/sviatco/9054346
 */
function getMyIp() {
    return Object.values(os.networkInterfaces()).flat().find(ip => ip.family.toUpperCase() === 'IPV4' && !ip.internal).address;
}

function printAllLocalAddresses() {
    console.log("All Addresses:");
    Object.values(os.networkInterfaces()).forEach(i => console.log(i));
}

/**
 * Develop a simple web application that prints out the name of the operating system on which the code is running (Linux? Windows? etc.).
 */
function getOsName() {
    return os.platform() + " (" + os.arch() + ")";
}

console.log();
console.log("my IPv4: " + getMyIp());
console.log("my hostname: " + os.hostname());

console.log();
console.log("my hostname: " + getOsName());